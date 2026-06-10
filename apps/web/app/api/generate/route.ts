import { createOpenAI } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText, type CoreMessage } from "ai";
import { match } from "ts-pattern";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

const createMessages = (system: string, user: string): CoreMessage[] => [
  {
    role: "system",
    content: system,
  },
  {
    role: "user",
    content: user,
  },
];

const plainTextRule =
  "输出必须是可直接写回富文本编辑器的纯文本：不要使用 Markdown 标题、表格、代码块、加粗符号、项目符号或分隔线；不要包裹 ```；不要解释处理过程。";

export async function POST(req: Request): Promise<Response> {
  // AI 接口现在使用 DeepSeek 的 OpenAI-compatible API。
  // 没有配置 DEEPSEEK_API_KEY 时直接返回 400，避免前端一直等待流式响应。
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === "") {
    return new Response("缺少 DEEPSEEK_API_KEY，请在 .env 文件中配置。", {
      status: 400,
    });
  }

  const deepseek = createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    compatibility: "compatible",
  });

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // 如果配置了 Vercel KV，就按 IP 做限流，防止公开 demo 被刷接口。
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv as unknown as ConstructorParameters<typeof Ratelimit>[0]["redis"],
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

    if (!success) {
      return new Response("今日 AI 请求次数已达上限。", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  const { prompt, option, command } = await req.json();
  // option 来自前端 AI 菜单，不同操作对应不同 system prompt。
  // 做 DocFlow AI 时，可以把这些选项改成“总结文档、生成 FAQ、提取待办、制度改写”等企业场景。
  const messages: CoreMessage[] = match(option as string)
    .with("summary", () =>
      createMessages(
        `你是 DocFlow AI 的企业知识库文档助手。请用中文总结文档，输出结构包含：核心结论、关键要点、后续建议。保持专业、简洁，适合企业内部协作场景。${plainTextRule}`,
        `请总结以下文档：\n\n${prompt}`,
      ),
    )
    .with("todos", () =>
      createMessages(
        `你是企业项目管理助手。请从文档中提取待办事项，逐条输出负责人、事项、截止时间、优先级、备注。如果信息缺失，请写“未明确”。不要编造文档中不存在的信息。${plainTextRule}`,
        `请提取以下文档中的待办事项：\n\n${prompt}`,
      ),
    )
    .with("faq", () =>
      createMessages(
        `你是企业知识库运营助手。请基于文档生成 FAQ，面向新员工或跨团队成员，问题要覆盖背景、流程、注意事项和常见疑问。用“问题：”“回答：”格式逐条输出。${plainTextRule}`,
        `请基于以下文档生成 FAQ：\n\n${prompt}`,
      ),
    )
    .with("improve", () =>
      createMessages(
        `你是企业文档编辑专家。请润色选中文本，让表达更准确、顺畅、专业。必须保留原意，不新增事实。${plainTextRule}`,
        `请润色以下内容：\n\n${prompt}`,
      ),
    )
    .with("simplify", () =>
      createMessages(
        `你是企业文档编辑专家。请把文本改得更简洁，删除冗余表达，保留关键信息和原意。${plainTextRule}`,
        `请精简以下内容：\n\n${prompt}`,
      ),
    )
    .with("expand", () =>
      createMessages(
        `你是企业文档写作助手。请在不编造事实的前提下适度扩写文本，让背景、原因和行动更清楚。${plainTextRule}`,
        `请扩写以下内容：\n\n${prompt}`,
      ),
    )
    .with("formal", () =>
      createMessages(
        `你是企业文档编辑专家。请把文本优化成正式、清晰、克制的企业内部文档表达。保留原意，不夸张，不增加未提供的事实。${plainTextRule}`,
        `请优化以下内容：\n\n${prompt}`,
      ),
    )
    .with("risks", () =>
      createMessages(
        `你是企业文档审核助手。请检查文档中的潜在风险点，包括表述不清、责任不明确、时间节点缺失、流程漏洞、合规风险和执行风险。逐条输出风险等级、问题描述、修改建议。${plainTextRule}`,
        `请审核以下文档的风险点：\n\n${prompt}`,
      ),
    )
    .with("translate", () =>
      createMessages(
        `你是专业企业文档翻译助手。请将内容翻译成自然、准确、商务化的英文。${plainTextRule}`,
        `请翻译以下内容：\n\n${prompt}`,
      ),
    )
    .with("continue", () =>
      createMessages(
        `你是企业文档写作助手。请基于已有上下文继续补全文档内容，保持中文、专业、简洁，输出可直接插入原文的后续段落。${plainTextRule}`,
        `请基于以下上下文续写：\n\n${prompt}`,
      ),
    )
    .with("zap", () =>
      createMessages(
        `你是企业知识库文档助手。请严格根据用户的自定义指令处理文本，默认使用中文，保持专业、清晰，适合企业内部文档。除非用户明确要求 Markdown，否则${plainTextRule}`,
        `待处理内容：\n${prompt}\n\n用户指令：${command}`,
      ),
    )
    .otherwise(() =>
      createMessages(`你是企业知识库文档助手。请用中文、专业、简洁的方式处理用户提供的文档内容。${plainTextRule}`, prompt),
    );

  // streamText 会返回流式结果，前端 useCompletion 可以边生成边展示，体验比等待完整响应更好。
  const result = await streamText({
    messages,
    maxTokens: 1600,
    temperature: 0.25,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    model: deepseek(process.env.DEEPSEEK_MODEL || "deepseek-v4-flash"),
  });

  return result.toDataStreamResponse();
}
