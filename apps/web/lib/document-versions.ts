import type { DocumentItem } from "@/lib/documents";

export type DocumentVersion = {
  id: string;
  documentId: string;
  title: string;
  contentJson: any;
  contentText: string;
  createdAt: string;
};

export const DOCUMENT_VERSIONS_STORAGE_KEY = "docflow-document-versions";

export const cloneDocumentContent = <T,>(value: T): T =>
  value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);

const createVersionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `version-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const normalizeVersion = (value: Partial<DocumentVersion> & Record<string, unknown>): DocumentVersion | null => {
  if (typeof value.documentId !== "string" || !value.documentId) return null;

  return {
    id: typeof value.id === "string" ? value.id : createVersionId(),
    documentId: value.documentId,
    title: typeof value.title === "string" ? value.title : "",
    contentJson: value.contentJson ?? { type: "doc", content: [{ type: "paragraph" }] },
    contentText: typeof value.contentText === "string" ? value.contentText : "",
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
  };
};

export const loadDocumentVersions = (): DocumentVersion[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DOCUMENT_VERSIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizeVersion(item)).filter((item): item is DocumentVersion => Boolean(item));
  } catch {
    return [];
  }
};

export const saveDocumentVersions = (versions: DocumentVersion[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DOCUMENT_VERSIONS_STORAGE_KEY, JSON.stringify(versions));
};

export const getDocumentVersions = (versions: DocumentVersion[], documentId: string) =>
  versions
    .filter((version) => version.documentId === documentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const addDocumentVersion = (
  versions: DocumentVersion[],
  document: DocumentItem,
  options: { force?: boolean; maxVersionsPerDocument?: number; minIntervalMs?: number } = {},
) => {
  if (document.deletedAt) return versions;

  const title = document.title.trim();
  const contentText = document.contentText?.trim() ?? "";
  if (!title && !contentText) return versions;

  const maxVersionsPerDocument = options.maxVersionsPerDocument ?? 20;
  const minIntervalMs = options.minIntervalMs ?? 30000;
  const existingVersions = getDocumentVersions(versions, document.id);
  const latestVersion = existingVersions[0];
  const nextContentJson = cloneDocumentContent(document.contentJson);

  if (latestVersion) {
    const sameContent =
      latestVersion.title === document.title &&
      latestVersion.contentText === (document.contentText ?? "") &&
      JSON.stringify(latestVersion.contentJson) === JSON.stringify(document.contentJson);

    if (sameContent) return versions;

    const latestTime = new Date(latestVersion.createdAt).getTime();
    if (!options.force && Date.now() - latestTime < minIntervalMs) return versions;
  }

  const nextVersion: DocumentVersion = {
    id: createVersionId(),
    documentId: document.id,
    title: document.title,
    contentJson: nextContentJson,
    contentText: document.contentText ?? "",
    createdAt: new Date().toISOString(),
  };

  const nextVersionsForDocument = [nextVersion, ...existingVersions].slice(0, maxVersionsPerDocument);
  const otherVersions = versions.filter((version) => version.documentId !== document.id);
  return [...otherVersions, ...nextVersionsForDocument];
};

export const removeDocumentVersions = (versions: DocumentVersion[], documentIds: Set<string>) =>
  versions.filter((version) => !documentIds.has(version.documentId));
