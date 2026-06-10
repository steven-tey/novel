import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type CoreMessage } from "ai";

export const runtime = "edge";

type MetadataResponse = {
  summary: string;
  tags: string[];
};

const clampText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const normalizeTags = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean))]
    .slice(0, 6);
};

const parseMetadataResponse = (text: string): MetadataResponse => {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch?.[0] ?? cleaned) as Partial<MetadataResponse>;

  return {
    summary: clampText(parsed.summary, 120),
    tags: normalizeTags(parsed.tags),
  };
};

export async function POST(req: Request): Promise<Response> {
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === "") {
    return Response.json({ error: "缺少 DEEPSEEK_API_KEY，请在 .env 文件中配置。" }, { status: 400 });
  }

  const body = await req.json();
  const title = clampText(body.title, 120);
  const contentText = clampText(body.contentText, 12000);

  if (!title && !contentText) {
    return Response.json({ error: "文档标题和正文都为空，无法生成摘要与标签。" }, { status: 400 });
  }

  const deepseek = createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    compatibility: "compatible",
  });

  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        "你是 DocFlow AI 的企业知识库元数据助手。请根据企业文档内容生成结构化元数据。只输出合法 JSON，不要输出 Markdown、解释或多余文本。",
    },
    {
      role: "user",
      content: [
        "请为下面的企业知识库文档生成摘要和标签。",
        "要求：",
        "1. summary 使用中文，80-120 字，专业、简洁，不编造正文没有的信息。",
        "2. tags 使用中文，3-6 个，偏企业知识库分类，例如：产品、技术、会议、需求、复盘、架构、流程、风险。",
        "3. 只返回 JSON，格式严格为：{\"summary\":\"...\",\"tags\":[\"...\"]}",
        "",
        `标题：${title || "无标题"}`,
        "",
        `正文：${contentText || "正文为空，请仅根据标题生成。"}`
      ].join("\n"),
    },
  ];

  const result = await generateText({
    messages,
    maxTokens: 800,
    temperature: 0.2,
    model: deepseek(process.env.DEEPSEEK_MODEL || "deepseek-v4-flash"),
  });

  try {
    const metadata = parseMetadataResponse(result.text);
    if (!metadata.summary && metadata.tags.length === 0) {
      throw new Error("empty metadata");
    }
    return Response.json(metadata);
  } catch {
    return Response.json({ error: "AI 返回内容解析失败，请稍后重试。" }, { status: 502 });
  }
}
