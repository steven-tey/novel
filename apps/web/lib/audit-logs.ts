import { authRoleLabels, type AuthSession } from "@/lib/auth";
import type { DocumentItem, DocumentMemberAccess } from "@/lib/documents";

export type AuditAction =
  | "login"
  | "logout"
  | "document.create"
  | "document.rename"
  | "document.content.update"
  | "document.delete"
  | "document.restore"
  | "document.permanent_delete"
  | "document.status.update"
  | "document.tags.update"
  | "document.summary.update"
  | "document.owner.update"
  | "document.members.update"
  | "document.metadata.generate"
  | "document.version.restore"
  | "knowledge.sync"
  | "member.create"
  | "member.update"
  | "member.delete";

export type AuditLogItem = {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: AuthSession["role"];
  action: AuditAction;
  actionLabel: string;
  documentId?: string | null;
  documentTitle?: string;
  detail?: string;
  createdAt: string;
};

export type AuditLogInput = {
  action: AuditAction;
  document?: Pick<DocumentItem, "id" | "title"> | null;
  detail?: string;
};

export const AUDIT_LOGS_STORAGE_KEY = "docflow-audit-logs";
const MAX_AUDIT_LOGS = 300;

export const auditActionLabels: Record<AuditAction, string> = {
  login: "登录系统",
  logout: "退出登录",
  "document.create": "创建文档",
  "document.rename": "重命名文档",
  "document.content.update": "编辑正文",
  "document.delete": "删除文档",
  "document.restore": "恢复文档",
  "document.permanent_delete": "永久删除文档",
  "document.status.update": "修改状态",
  "document.tags.update": "修改标签",
  "document.summary.update": "修改摘要",
  "document.owner.update": "修改负责人",
  "document.members.update": "修改协作者",
  "document.metadata.generate": "AI 生成元数据",
  "document.version.restore": "恢复历史版本",
  "knowledge.sync": "同步知识库",
  "member.create": "新增成员",
  "member.update": "修改成员",
  "member.delete": "删除成员",
};

export const createAuditLogId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createAuditLog = (session: AuthSession, input: AuditLogInput): AuditLogItem => ({
  id: createAuditLogId(),
  actorId: session.memberId,
  actorName: session.name,
  actorRole: session.role,
  action: input.action,
  actionLabel: auditActionLabels[input.action],
  documentId: input.document?.id ?? null,
  documentTitle: input.document?.title?.trim() || undefined,
  detail: input.detail,
  createdAt: new Date().toISOString(),
});

export const loadAuditLogs = (): AuditLogItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeAuditLog).filter((item): item is AuditLogItem => Boolean(item));
  } catch {
    return [];
  }
};

export const saveAuditLogs = (logs: AuditLogItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_AUDIT_LOGS)));
};

export const appendAuditLog = (logs: AuditLogItem[], log: AuditLogItem) => [log, ...logs].slice(0, MAX_AUDIT_LOGS);

export const getDocumentAuditLogs = (logs: AuditLogItem[], documentId?: string | null, limit = 12) => {
  if (!documentId) return [];
  return logs.filter((log) => log.documentId === documentId).slice(0, limit);
};

export const describeMemberAccessChange = (
  previousAccess: DocumentMemberAccess[] = [],
  nextAccess: DocumentMemberAccess[] = [],
) => {
  const previous = new Map(previousAccess.map((access) => [access.memberId, access.role]));
  const next = new Map(nextAccess.map((access) => [access.memberId, access.role]));
  const added = [...next.keys()].filter((memberId) => !previous.has(memberId)).length;
  const removed = [...previous.keys()].filter((memberId) => !next.has(memberId)).length;
  const changed = [...next.entries()].filter(([memberId, role]) => previous.has(memberId) && previous.get(memberId) !== role).length;

  return [
    added ? `新增 ${added} 位协作者` : "",
    removed ? `移除 ${removed} 位协作者` : "",
    changed ? `调整 ${changed} 位权限` : "",
  ]
    .filter(Boolean)
    .join("，");
};

export const formatAuditActor = (log: AuditLogItem) => `${log.actorName}（${authRoleLabels[log.actorRole]}）`;

function normalizeAuditLog(value: Partial<AuditLogItem> & Record<string, unknown>): AuditLogItem | null {
  if (typeof value.id !== "string" || !value.id) return null;
  if (typeof value.action !== "string" || !(value.action in auditActionLabels)) return null;
  const role = value.actorRole === "admin" || value.actorRole === "user" ? value.actorRole : "user";

  return {
    id: value.id,
    actorId: typeof value.actorId === "string" ? value.actorId : "",
    actorName: typeof value.actorName === "string" && value.actorName ? value.actorName : "未知用户",
    actorRole: role,
    action: value.action as AuditAction,
    actionLabel: typeof value.actionLabel === "string" && value.actionLabel ? value.actionLabel : auditActionLabels[value.action as AuditAction],
    documentId: typeof value.documentId === "string" ? value.documentId : null,
    documentTitle: typeof value.documentTitle === "string" ? value.documentTitle : undefined,
    detail: typeof value.detail === "string" ? value.detail : undefined,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
  };
}
