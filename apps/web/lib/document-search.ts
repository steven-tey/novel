import type { DocumentItem } from "@/lib/documents";

export type SearchType = "all" | "title" | "content" | "tag";

export type DocumentSearchResult = {
  document: DocumentItem;
  score: number;
  snippet: string;
};

export const SEARCH_HISTORY_KEY = "document_search_history";

const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase();

const includesKeyword = (value: string | undefined, keyword: string) => value?.toLowerCase().includes(keyword) ?? false;

export const calculateSearchScore = (document: DocumentItem, keyword: string, searchType: SearchType) => {
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedKeyword) return 0;

  const title = document.title ?? "";
  const contentText = document.contentText ?? "";
  const summary = document.summary ?? "";
  const tags = document.tags ?? [];
  let score = 0;

  if ((searchType === "all" || searchType === "title") && includesKeyword(title, normalizedKeyword)) {
    score += 10;
    if (title.trim().toLowerCase() === normalizedKeyword) score += 20;
  }

  if ((searchType === "all" || searchType === "tag") && tags.some((tag) => includesKeyword(tag, normalizedKeyword))) {
    score += 6;
  }

  if (searchType === "all" && includesKeyword(summary, normalizedKeyword)) {
    score += 3;
  }

  if ((searchType === "all" || searchType === "content") && includesKeyword(contentText, normalizedKeyword)) {
    score += 1;
  }

  return score;
};

export const getSearchSnippet = (document: DocumentItem, keyword: string) => {
  const normalizedKeyword = normalizeKeyword(keyword);
  const contentText = document.contentText ?? "";
  const summary = document.summary ?? "";

  if (normalizedKeyword && contentText) {
    const index = contentText.toLowerCase().indexOf(normalizedKeyword);
    if (index >= 0) {
      const start = Math.max(0, index - 30);
      const end = Math.min(contentText.length, index + normalizedKeyword.length + 80);
      const prefix = start > 0 ? "..." : "";
      const suffix = end < contentText.length ? "..." : "";
      return `${prefix}${contentText.slice(start, end)}${suffix}`;
    }
  }

  if (summary) return summary;
  if (contentText) return contentText.slice(0, 100);
  return "";
};

export const searchDocuments = (documents: DocumentItem[], keyword: string, searchType: SearchType): DocumentSearchResult[] => {
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedKeyword) {
    return documents.map((document) => ({
      document,
      score: 0,
      snippet: getSearchSnippet(document, ""),
    }));
  }

  // 后续可在这里替换为后端全文检索，例如 PostgreSQL tsvector、MySQL FULLTEXT、
  // Elasticsearch / Meilisearch，或接入向量检索与 RAG 知识库问答。
  return documents
    .map((document) => ({
      document,
      score: calculateSearchScore(document, normalizedKeyword, searchType),
      snippet: getSearchSnippet(document, normalizedKeyword),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.document.updatedAt).getTime() - new Date(a.document.updatedAt).getTime();
    });
};

export const getSearchHistory = () => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 10) : [];
  } catch {
    return [];
  }
};

export const saveSearchHistory = (keyword: string) => {
  if (typeof window === "undefined") return [];

  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) return getSearchHistory();

  const nextHistory = [normalizedKeyword, ...getSearchHistory().filter((item) => item !== normalizedKeyword)].slice(0, 10);
  window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));
  return nextHistory;
};
