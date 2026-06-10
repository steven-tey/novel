import type { DocumentItem } from "@/lib/documents";

export type KnowledgeBlockType = "title" | "heading" | "paragraph" | "list" | "code";

export type KnowledgeBlock = {
  type: KnowledgeBlockType;
  text: string;
  headingPath: string[];
};

export type KnowledgeChunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  text: string;
  headingPath: string[];
  contentHash: string;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeIndexedDocument = {
  documentId: string;
  title: string;
  contentHash: string;
  chunkCount: number;
  indexedAt: string;
};

export type KnowledgeIndexStore = {
  documents: KnowledgeIndexedDocument[];
  chunks: KnowledgeChunk[];
  updatedAt: string;
};

export type DocumentKnowledgeIndexPayload = {
  document: KnowledgeIndexedDocument;
  chunks: KnowledgeChunk[];
};

export type KnowledgeSearchResult = KnowledgeChunk & {
  score: number;
  snippet: string;
};

type EditorContentNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: EditorContentNode[];
};

type HeadingState = {
  headings: string[];
};

export const KNOWLEDGE_INDEX_STORAGE_KEY = "docflow-knowledge-index";
const KNOWLEDGE_INDEX_VERSION = "docflow-local-chunks-v2";

export const createEmptyKnowledgeIndex = (): KnowledgeIndexStore => ({
  documents: [],
  chunks: [],
  updatedAt: new Date().toISOString(),
});

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object");

const toEditorContentNode = (value: unknown): EditorContentNode | null => {
  if (!isRecord(value)) return null;

  return {
    type: typeof value.type === "string" ? value.type : undefined,
    text: typeof value.text === "string" ? value.text : undefined,
    attrs: isRecord(value.attrs) ? value.attrs : undefined,
    content: Array.isArray(value.content)
      ? value.content.map((item) => toEditorContentNode(item)).filter((item): item is EditorContentNode => Boolean(item))
      : undefined,
  };
};

const getNodeText = (node: EditorContentNode): string => {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  if (!node.content?.length) return "";

  return node.content.map((child) => getNodeText(child)).join(node.type === "paragraph" ? "" : " ");
};

const getHeadingLevel = (node: EditorContentNode) => {
  const level = node.attrs?.level;
  return typeof level === "number" && Number.isFinite(level) ? Math.max(1, Math.min(level, 6)) : 1;
};

const collectKnowledgeBlocks = (
  node: EditorContentNode,
  result: KnowledgeBlock[],
  state: HeadingState,
) => {
  const text = getNodeText(node).replace(/\s+/g, " ").trim();

  if (node.type === "heading") {
    if (!text) return;

    const level = getHeadingLevel(node);
    state.headings = state.headings.slice(0, level - 1);
    state.headings[level - 1] = text;
    result.push({
      type: "heading",
      text,
      headingPath: state.headings.filter(Boolean),
    });
    return;
  }

  if (node.type === "paragraph" || node.type === "blockquote") {
    if (text) {
      result.push({
        type: "paragraph",
        text,
        headingPath: state.headings.filter(Boolean),
      });
    }
    return;
  }

  if (node.type === "codeBlock") {
    if (text) {
      result.push({
        type: "code",
        text,
        headingPath: state.headings.filter(Boolean),
      });
    }
    return;
  }

  if (node.type === "listItem" || node.type === "taskItem") {
    if (text) {
      result.push({
        type: "list",
        text,
        headingPath: state.headings.filter(Boolean),
      });
    }
    return;
  }

  for (const child of node.content ?? []) {
    collectKnowledgeBlocks(child, result, state);
  }
};

export const extractKnowledgeBlocks = (document: DocumentItem): KnowledgeBlock[] => {
  const blocks: KnowledgeBlock[] = [];
  const title = document.title.trim();

  if (title) {
    blocks.push({
      type: "title",
      text: title,
      headingPath: [title],
    });
  }

  const root = toEditorContentNode(document.contentJson);
  if (root) {
    const state: HeadingState = { headings: [] };
    for (const child of root.content ?? []) {
      collectKnowledgeBlocks(child, blocks, state);
    }
  }

  if (blocks.length <= (title ? 1 : 0) && document.contentText?.trim()) {
    blocks.push({
      type: "paragraph",
      text: document.contentText.trim(),
      headingPath: title ? [title] : [],
    });
  }

  return blocks.filter((block, index) => {
    if (!block.text.trim()) return false;
    return !(index > 0 && title && block.type === "heading" && block.text === title);
  });
};

export const createDocumentContentHash = (document: DocumentItem) => {
  const source = JSON.stringify({
    version: KNOWLEDGE_INDEX_VERSION,
    title: document.title,
    contentText: document.contentText ?? "",
    summary: document.summary ?? "",
    tags: document.tags ?? [],
    contentJson: document.contentJson,
  });

  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
};

const splitTextByLength = (text: string, maxLength: number) => {
  const pieces: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxLength) {
    const splitAt = Math.max(
      remaining.lastIndexOf("。", maxLength),
      remaining.lastIndexOf("；", maxLength),
      remaining.lastIndexOf(".", maxLength),
      remaining.lastIndexOf("\n", maxLength),
      Math.floor(maxLength * 0.75),
    );

    pieces.push(remaining.slice(0, splitAt + 1).trim());
    remaining = remaining.slice(splitAt + 1).trim();
  }

  if (remaining) pieces.push(remaining);
  return pieces;
};

export const buildDocumentKnowledgeIndex = (document: DocumentItem, maxChunkLength = 800): DocumentKnowledgeIndexPayload => {
  const now = new Date().toISOString();
  const contentHash = createDocumentContentHash(document);
  const blocks = extractKnowledgeBlocks(document);
  const chunks: KnowledgeChunk[] = [];
  let currentText = "";
  let currentHeadingPath: string[] = [];

  const flushChunk = () => {
    const text = currentText.trim();
    if (!text) return;

    chunks.push({
      id: `${document.id}:${contentHash}:${chunks.length}`,
      documentId: document.id,
      documentTitle: document.title.trim() || "无标题",
      chunkIndex: chunks.length,
      text,
      headingPath: currentHeadingPath,
      contentHash,
      createdAt: now,
      updatedAt: now,
    });
    currentText = "";
    currentHeadingPath = [];
  };

  for (const block of blocks) {
    const blockText = block.text.trim();
    const pieces = splitTextByLength(blockText, maxChunkLength);

    for (const piece of pieces) {
      if (currentText && currentText.length + piece.length + 2 > maxChunkLength) {
        flushChunk();
      }

      if (!currentText) currentHeadingPath = block.headingPath;
      currentText = [currentText, piece].filter(Boolean).join("\n\n");
    }
  }

  flushChunk();

  return {
    document: {
      documentId: document.id,
      title: document.title.trim() || "无标题",
      contentHash,
      chunkCount: chunks.length,
      indexedAt: now,
    },
    chunks,
  };
};

export const upsertDocumentKnowledgeIndex = (
  index: KnowledgeIndexStore,
  payload: DocumentKnowledgeIndexPayload,
): KnowledgeIndexStore => {
  const nextDocuments = [
    payload.document,
    ...index.documents.filter((document) => document.documentId !== payload.document.documentId),
  ];
  const nextChunks = [
    ...index.chunks.filter((chunk) => chunk.documentId !== payload.document.documentId),
    ...payload.chunks,
  ];

  return {
    documents: nextDocuments,
    chunks: nextChunks,
    updatedAt: new Date().toISOString(),
  };
};

export const removeDocumentsFromKnowledgeIndex = (index: KnowledgeIndexStore, documentIds: Set<string>): KnowledgeIndexStore => ({
  documents: index.documents.filter((document) => !documentIds.has(document.documentId)),
  chunks: index.chunks.filter((chunk) => !documentIds.has(chunk.documentId)),
  updatedAt: new Date().toISOString(),
});

export const filterKnowledgeIndexByDocumentIds = (
  index: KnowledgeIndexStore,
  documentIds: Set<string>,
): KnowledgeIndexStore => ({
  documents: index.documents.filter((document) => documentIds.has(document.documentId)),
  chunks: index.chunks.filter((chunk) => documentIds.has(chunk.documentId)),
  updatedAt: index.updatedAt,
});

export const isDocumentKnowledgeIndexStale = (document: DocumentItem, index: KnowledgeIndexStore) => {
  const indexedDocument = index.documents.find((item) => item.documentId === document.id);
  if (!indexedDocument) return true;
  return indexedDocument.contentHash !== createDocumentContentHash(document);
};

const normalizeKnowledgeIndexedDocument = (
  value: Partial<KnowledgeIndexedDocument> & Record<string, unknown>,
): KnowledgeIndexedDocument | null => {
  if (typeof value.documentId !== "string") return null;

  return {
    documentId: value.documentId,
    title: typeof value.title === "string" ? value.title : "无标题",
    contentHash: typeof value.contentHash === "string" ? value.contentHash : "",
    chunkCount: typeof value.chunkCount === "number" ? value.chunkCount : 0,
    indexedAt: typeof value.indexedAt === "string" ? value.indexedAt : new Date().toISOString(),
  };
};

const normalizeKnowledgeChunk = (value: Partial<KnowledgeChunk> & Record<string, unknown>): KnowledgeChunk | null => {
  if (typeof value.documentId !== "string" || typeof value.text !== "string") return null;

  return {
    id: typeof value.id === "string" ? value.id : `${value.documentId}:${Date.now()}`,
    documentId: value.documentId,
    documentTitle: typeof value.documentTitle === "string" ? value.documentTitle : "无标题",
    chunkIndex: typeof value.chunkIndex === "number" ? value.chunkIndex : 0,
    text: value.text,
    headingPath: Array.isArray(value.headingPath)
      ? value.headingPath.filter((item): item is string => typeof item === "string")
      : [],
    contentHash: typeof value.contentHash === "string" ? value.contentHash : "",
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
  };
};

export const loadKnowledgeIndex = (): KnowledgeIndexStore => {
  if (typeof window === "undefined") return createEmptyKnowledgeIndex();

  try {
    const raw = window.localStorage.getItem(KNOWLEDGE_INDEX_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!isRecord(parsed)) return createEmptyKnowledgeIndex();

    return {
      documents: Array.isArray(parsed.documents)
        ? parsed.documents
            .map((item) => normalizeKnowledgeIndexedDocument(item))
            .filter((item): item is KnowledgeIndexedDocument => Boolean(item))
        : [],
      chunks: Array.isArray(parsed.chunks)
        ? parsed.chunks.map((item) => normalizeKnowledgeChunk(item)).filter((item): item is KnowledgeChunk => Boolean(item))
        : [],
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return createEmptyKnowledgeIndex();
  }
};

// 第一版用 localStorage 承载本地索引；后续可替换为 PostgreSQL、Elasticsearch、Meilisearch 或向量库。
export const saveKnowledgeIndex = (index: KnowledgeIndexStore) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KNOWLEDGE_INDEX_STORAGE_KEY, JSON.stringify(index));
};

export const searchKnowledgeChunks = (chunks: KnowledgeChunk[], keyword: string): KnowledgeSearchResult[] => {
  const nextKeyword = keyword.trim().toLowerCase();
  if (!nextKeyword) return [];
  const searchTerms = createSearchTerms(nextKeyword);

  return chunks
    .map((chunk) => {
      const title = chunk.documentTitle.toLowerCase();
      const path = chunk.headingPath.join(" / ").toLowerCase();
      const text = chunk.text.toLowerCase();
      let score = 0;

      if (title === nextKeyword) score += 20;
      if (title.includes(nextKeyword)) score += 10;
      if (path.includes(nextKeyword)) score += 6;
      if (text.includes(nextKeyword)) score += 1;

      for (const term of searchTerms) {
        if (title.includes(term)) score += 5;
        if (path.includes(term)) score += 3;
        if (text.includes(term)) score += 1;
      }

      return {
        ...chunk,
        score,
        snippet: getKnowledgeSearchSnippet(chunk.text, nextKeyword, searchTerms),
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 20);
};

export const getRelevantKnowledgeChunks = (chunks: KnowledgeChunk[], keyword: string, limit = 5): KnowledgeSearchResult[] => {
  const matchedChunks = searchKnowledgeChunks(chunks, keyword).slice(0, limit);
  if (matchedChunks.length) return matchedChunks;
  return getFallbackKnowledgeChunks(chunks, limit);
};

export const getFallbackKnowledgeChunks = (chunks: KnowledgeChunk[], limit = 5): KnowledgeSearchResult[] =>
  [...chunks]
    .sort((a, b) => {
      const updatedDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (updatedDiff !== 0) return updatedDiff;
      if (a.documentTitle !== b.documentTitle) return a.documentTitle.localeCompare(b.documentTitle, "zh-CN");
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, limit)
    .map((chunk) => ({
      ...chunk,
      score: 0,
      snippet: chunk.text.slice(0, 120),
    }));

const createSearchTerms = (keyword: string) => {
  const normalizedKeyword = keyword.toLowerCase();
  const terms = new Set<string>();

  for (const term of normalizedKeyword.match(/[a-z0-9_]+/gi) ?? []) {
    if (term.length >= 2) terms.add(term);
  }

  for (const term of normalizedKeyword.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
    if (term.length === 2) {
      terms.add(term);
      continue;
    }

    for (let index = 0; index < term.length - 1; index += 1) {
      terms.add(term.slice(index, index + 2));
    }
  }

  return [...terms].filter((term) => !ignoredSearchTerms.has(term));
};

const ignoredSearchTerms = new Set([
  "什么",
  "哪些",
  "如何",
  "怎么",
  "这个",
  "那个",
  "一下",
  "相关",
  "内容",
]);

const getKnowledgeSearchSnippet = (text: string, keyword: string, terms: string[] = []) => {
  const normalizedText = text.toLowerCase();
  const hitKeyword = normalizedText.includes(keyword) ? keyword : terms.find((term) => normalizedText.includes(term)) ?? keyword;
  const hitIndex = normalizedText.indexOf(hitKeyword);
  if (hitIndex < 0) return text.slice(0, 120);

  const start = Math.max(0, hitIndex - 30);
  const end = Math.min(text.length, hitIndex + hitKeyword.length + 90);
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`;
};
