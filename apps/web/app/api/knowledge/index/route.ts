import {
  deleteDocumentsFromLangChainRag,
  getLangChainRagStatus,
  upsertDocumentsToLangChainRag,
} from "@/lib/rag/langchain-engine";
import type { RagIndexableDocument } from "@/lib/rag/types";
import { createEmptyEditorContent } from "@/lib/content";

export const runtime = "nodejs";

const clampText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const normalizeDocument = (value: unknown): RagIndexableDocument | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = clampText(record.id, 120);
  if (!id) return null;

  return {
    id,
    title: clampText(record.title, 200),
    contentJson: record.contentJson ?? createEmptyEditorContent(),
    contentText: clampText(record.contentText, 100_000),
    tags: Array.isArray(record.tags)
      ? record.tags.map((tag) => clampText(tag, 40)).filter(Boolean).slice(0, 20)
      : [],
    summary: clampText(record.summary, 1000),
    parentId: typeof record.parentId === "string" ? record.parentId : null,
    updatedAt: clampText(record.updatedAt, 40) || new Date().toISOString(),
  };
};

const normalizeDocuments = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map((item) => normalizeDocument(item))
    .filter((item): item is RagIndexableDocument => Boolean(item))
    .slice(0, 20);

const normalizeDocumentIds = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map((item) => clampText(item, 120))
    .filter(Boolean)
    .slice(0, 100);

export async function GET() {
  return Response.json(getLangChainRagStatus());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null);
  const documents = normalizeDocuments((body as Record<string, unknown> | null)?.documents);

  if (!documents.length) {
    return Response.json({ error: "没有收到可入库的文档。" }, { status: 400 });
  }

  try {
    return Response.json(await upsertDocumentsToLangChainRag(documents));
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "后端 RAG 入库失败。",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null);
  const documentIds = normalizeDocumentIds((body as Record<string, unknown> | null)?.documentIds);

  if (!documentIds.length) {
    return Response.json({ error: "没有收到需要删除的文档 ID。" }, { status: 400 });
  }

  try {
    return Response.json(await deleteDocumentsFromLangChainRag(documentIds));
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "后端 RAG 删除失败。",
      },
      { status: 500 },
    );
  }
}
