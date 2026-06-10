import type { DocumentItem } from "@/lib/documents";
import { isDocumentKnowledgeIndexStale, type KnowledgeIndexStore } from "@/lib/knowledge-base";

export type KnowledgeSyncLogStatus = "pending" | "success" | "failed";

export type KnowledgeSyncLog = {
  id: string;
  documentId: string;
  documentTitle: string;
  status: KnowledgeSyncLogStatus;
  message: string;
  createdAt: string;
};

export const KNOWLEDGE_SYNC_LOGS_STORAGE_KEY = "docflow-knowledge-sync-logs";

export const knowledgeSyncLogStatusLabels: Record<KnowledgeSyncLogStatus, string> = {
  pending: "同步中",
  success: "同步成功",
  failed: "同步失败",
};

const createLogId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sync-log-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const normalizeKnowledgeSyncLog = (value: Partial<KnowledgeSyncLog> & Record<string, unknown>): KnowledgeSyncLog => ({
  id: typeof value.id === "string" ? value.id : createLogId(),
  documentId: typeof value.documentId === "string" ? value.documentId : "",
  documentTitle: typeof value.documentTitle === "string" ? value.documentTitle : "无标题",
  status: value.status === "success" || value.status === "failed" ? value.status : "pending",
  message: typeof value.message === "string" ? value.message : "",
  createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
});

export const loadKnowledgeSyncLogs = (): KnowledgeSyncLog[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KNOWLEDGE_SYNC_LOGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => normalizeKnowledgeSyncLog(item)).filter((item) => item.documentId);
  } catch {
    return [];
  }
};

export const saveKnowledgeSyncLogs = (logs: KnowledgeSyncLog[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KNOWLEDGE_SYNC_LOGS_STORAGE_KEY, JSON.stringify(logs));
};

export const createKnowledgeSyncLog = (
  document: Pick<DocumentItem, "id" | "title">,
  status: KnowledgeSyncLogStatus,
  message: string,
): KnowledgeSyncLog => ({
  id: createLogId(),
  documentId: document.id,
  documentTitle: document.title.trim() || "无标题",
  status,
  message,
  createdAt: new Date().toISOString(),
});

export const appendKnowledgeSyncLog = (logs: KnowledgeSyncLog[], log: KnowledgeSyncLog, limit = 50) =>
  [log, ...logs].slice(0, limit);

export const getKnowledgeSyncCandidates = (documents: DocumentItem[], knowledgeIndex?: KnowledgeIndexStore) =>
  documents
    .filter((document) => {
      const knowledgeStatus = document.knowledgeStatus ?? "none";
      if (["none", "failed", "outdated"].includes(knowledgeStatus)) return true;
      return knowledgeStatus === "indexed" && knowledgeIndex ? isDocumentKnowledgeIndexStale(document, knowledgeIndex) : false;
    })
    .sort((a, b) => {
      const priority: Record<string, number> = {
        failed: 0,
        outdated: 1,
        none: 2,
      };
      const statusDiff = priority[a.knowledgeStatus ?? "none"] - priority[b.knowledgeStatus ?? "none"];
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
