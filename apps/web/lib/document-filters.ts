import type { DocumentItem, DocumentStatus, KnowledgeStatus } from "@/lib/documents";
import { getMemberById, type WorkspaceMember } from "@/lib/members";

export type DocumentFilter =
  | { type: "all" }
  | { type: "status"; value: DocumentStatus }
  | { type: "tag"; value: string }
  | { type: "knowledge"; value: KnowledgeStatus }
  | { type: "member"; value: string };

export type DocumentFilterOption = {
  value: string;
  label: string;
  count: number;
};

export const defaultDocumentFilter: DocumentFilter = { type: "all" };

export const documentStatusLabels: Record<DocumentStatus, string> = {
  draft: "草稿",
  reviewing: "审核中",
  published: "已发布",
  archived: "已归档",
};

export const knowledgeStatusLabels: Record<KnowledgeStatus, string> = {
  none: "未同步",
  pending: "同步中",
  indexed: "已入库",
  failed: "同步失败",
  outdated: "已过期",
};

export const isDefaultDocumentFilter = (filter: DocumentFilter) => filter.type === "all";

export const getDocumentFilterLabel = (filter: DocumentFilter, members: WorkspaceMember[] = []) => {
  if (filter.type === "status") return documentStatusLabels[filter.value];
  if (filter.type === "knowledge") return knowledgeStatusLabels[filter.value];
  if (filter.type === "tag") return `#${filter.value}`;
  if (filter.type === "member") return getMemberById(members, filter.value)?.name ?? "未知成员";
  return "全部文档";
};

export const documentMatchesFilter = (document: DocumentItem, filter: DocumentFilter) => {
  if (filter.type === "all") return true;
  if (filter.type === "status") return (document.status ?? "draft") === filter.value;
  if (filter.type === "knowledge") return (document.knowledgeStatus ?? "none") === filter.value;
  if (filter.type === "member") {
    return document.ownerId === filter.value || (document.memberAccess ?? []).some((access) => access.memberId === filter.value);
  }
  return (document.tags ?? []).includes(filter.value);
};

export const filterDocumentsForTree = (documents: DocumentItem[], filter: DocumentFilter) => {
  if (filter.type === "all") return documents;

  const documentById = new Map(documents.map((document) => [document.id, document]));
  const includedIds = new Set<string>();

  const includeAncestors = (document: DocumentItem) => {
    includedIds.add(document.id);
    let parentId = document.parentId;

    while (parentId) {
      const parent = documentById.get(parentId);
      if (!parent) break;
      includedIds.add(parent.id);
      parentId = parent.parentId;
    }
  };

  documents.filter((document) => documentMatchesFilter(document, filter)).forEach(includeAncestors);
  return documents.filter((document) => includedIds.has(document.id));
};

export const getDirectFilteredDocuments = (documents: DocumentItem[], filter: DocumentFilter) =>
  documents.filter((document) => documentMatchesFilter(document, filter));

export const getDocumentFilterOptions = (documents: DocumentItem[], members: WorkspaceMember[] = []) => {
  const statusOptions: DocumentFilterOption[] = (Object.keys(documentStatusLabels) as DocumentStatus[]).map((status) => ({
    value: status,
    label: documentStatusLabels[status],
    count: documents.filter((document) => (document.status ?? "draft") === status).length,
  }));

  const knowledgeOptions: DocumentFilterOption[] = (Object.keys(knowledgeStatusLabels) as KnowledgeStatus[]).map((status) => ({
    value: status,
    label: knowledgeStatusLabels[status],
    count: documents.filter((document) => (document.knowledgeStatus ?? "none") === status).length,
  }));

  const tagCountByName = documents.reduce((result, document) => {
    for (const tag of document.tags ?? []) {
      const nextTag = tag.trim();
      if (!nextTag) continue;
      result.set(nextTag, (result.get(nextTag) ?? 0) + 1);
    }
    return result;
  }, new Map<string, number>());

  const memberCountById = documents.reduce((result, document) => {
    const participantIds = new Set<string>();
    if (document.ownerId) participantIds.add(document.ownerId);
    for (const access of document.memberAccess ?? []) participantIds.add(access.memberId);

    for (const memberId of participantIds) {
      result.set(memberId, (result.get(memberId) ?? 0) + 1);
    }

    return result;
  }, new Map<string, number>());

  const tagOptions = [...tagCountByName.entries()]
    .map(([tag, count]) => ({ value: tag, label: tag, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label, "zh-CN");
    });

  const memberOptions = [...memberCountById.entries()]
    .map(([memberId, count]) => ({
      value: memberId,
      label: getMemberById(members, memberId)?.name ?? "未知成员",
      count,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label, "zh-CN");
    });

  return {
    statusOptions,
    knowledgeOptions,
    tagOptions,
    memberOptions,
  };
};
