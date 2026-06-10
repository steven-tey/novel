import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type CoreMessage } from "ai";
import { retrieveFromLangChainRag } from "@/lib/rag/langchain-engine";
import type { RagProvider } from "@/lib/rag/types";

export const runtime = "nodejs";

type AskContextChunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  text: string;
  score?: number;
  snippet?: string;
};

type AskCitation = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  quote: string;
};

type AskContextSource = "local" | Exclude<RagProvider, "local">;

type AskRetrievedChunk = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  text: string;
  score: number | null;
  provider: AskContextSource;
};

const clampText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const normalizeContextChunks = (value: unknown): AskContextChunk[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const id = clampText(record.id, 120);
      const documentId = clampText(record.documentId, 120);
      const documentTitle = clampText(record.documentTitle, 120) || "无标题";
      const text = clampText(record.text, 1200);

      if (!id || !documentId || !text) return null;

      const chunk: AskContextChunk = {
        id,
        documentId,
        documentTitle,
        headingPath: Array.isArray(record.headingPath)
          ? record.headingPath.filter((heading): heading is string => typeof heading === "string").slice(0, 6)
          : [],
        text,
        score: typeof record.score === "number" && Number.isFinite(record.score) ? record.score : undefined,
        snippet: clampText(record.snippet, 300),
      };

      return chunk;
    })
    .filter((item): item is AskContextChunk => Boolean(item))
    .slice(0, 6);
};

const normalizeDocumentIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean))].slice(0, 500);
};

const createCitations = (chunks: AskContextChunk[]): AskCitation[] =>
  chunks.map((chunk) => ({
    chunkId: chunk.id,
    documentId: chunk.documentId,
    documentTitle: chunk.documentTitle,
    headingPath: chunk.headingPath ?? [],
    quote: chunk.text.slice(0, 180),
  }));

const createRetrievedChunks = (chunks: AskContextChunk[], provider: AskContextSource): AskRetrievedChunk[] =>
  chunks.map((chunk) => ({
    chunkId: chunk.id,
    documentId: chunk.documentId,
    documentTitle: chunk.documentTitle,
    headingPath: chunk.headingPath ?? [],
    text: (chunk.snippet || chunk.text).slice(0, 900),
    score: typeof chunk.score === "number" ? chunk.score : null,
    provider,
  }));

const retrieveBackendChunks = async (
  question: string,
  allowedDocumentIds: string[],
): Promise<{ chunks: AskContextChunk[]; source: AskContextSource }> => {
  if (!allowedDocumentIds.length) return { chunks: [], source: "local" };

  try {
    const chunks = await retrieveFromLangChainRag(question, undefined, allowedDocumentIds);
    if (!chunks.length) return { chunks: [], source: "local" };

    return {
      source: chunks[0]?.provider ?? "local",
      chunks: chunks.map((chunk) => ({
        id: chunk.id,
        documentId: chunk.documentId,
        documentTitle: chunk.documentTitle,
        headingPath: chunk.headingPath,
        text: chunk.text,
        score: chunk.score,
        snippet: chunk.text.slice(0, 300),
      })),
    };
  } catch (error) {
    console.error("LangChain RAG 检索失败，降级使用前端传入片段。", error);
    return { chunks: [], source: "local" };
  }
};

export async function POST(req: Request): Promise<Response> {
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === "") {
    return Response.json({ error: "缺少 DEEPSEEK_API_KEY，请在 .env 文件中配置。" }, { status: 400 });
  }

  const body = await req.json();
  const question = clampText(body.question, 500);
  const allowedDocumentIds = normalizeDocumentIds(body.allowedDocumentIds);
  const allowedDocumentIdSet = new Set(allowedDocumentIds);
  const fallbackChunks = normalizeContextChunks(body.chunks).filter((chunk) => allowedDocumentIdSet.has(chunk.documentId));

  if (!question) {
    return Response.json({ error: "请输入问题。" }, { status: 400 });
  }

  const backendResult = await retrieveBackendChunks(question, allowedDocumentIds);
  const chunks = backendResult.chunks.length ? backendResult.chunks : fallbackChunks;
  const contextSource = backendResult.chunks.length ? backendResult.source : "local";

  if (!chunks.length) {
    return Response.json({ error: "没有可用于回答的知识片段，请先同步知识库。" }, { status: 400 });
  }

  const deepseek = createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    compatibility: "compatible",
  });

  const contextText = chunks
    .map((chunk, index) =>
      [
        `资料 [${index + 1}]`,
        `文档：${chunk.documentTitle}`,
        chunk.headingPath?.length ? `位置：${chunk.headingPath.join(" / ")}` : "",
        `内容：${chunk.text}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n---\n\n");

  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        "你是 DocFlow AI 的企业知识库问答助手。你必须只依据用户提供的资料回答，不要编造资料外的信息。回答使用中文，专业、简洁。若资料不足，请明确说明“当前知识库资料不足以回答”。回答中尽量使用 [1]、[2] 这样的编号标注信息来源。",
    },
    {
      role: "user",
      content: [
        "请基于下面的知识库资料回答问题。",
        "",
        `问题：${question}`,
        "",
        "知识库资料：",
        contextText,
      ].join("\n"),
    },
  ];

  const result = await generateText({
    messages,
    maxTokens: 1200,
    temperature: 0.2,
    model: deepseek(process.env.DEEPSEEK_MODEL || "deepseek-v4-flash"),
  });

  return Response.json({
    answer: result.text.trim(),
    citations: createCitations(chunks),
    provider: contextSource,
    retrievedChunks: createRetrievedChunks(chunks, contextSource),
  });
}
