import { isAdminSession, type AuthSession } from "@/lib/auth";
import type { DocumentItem } from "@/lib/documents";

export const canAccessDocument = (session: AuthSession | null, document: DocumentItem | null | undefined) => {
  if (!session || !document) return false;
  if (isAdminSession(session)) return true;

  return (
    document.ownerId === session.memberId ||
    (document.memberAccess ?? []).some((access) => access.memberId === session.memberId)
  );
};

export const getAccessibleDocuments = (documents: DocumentItem[], session: AuthSession | null) => {
  if (!session) return [];
  if (isAdminSession(session)) return documents;
  return documents.filter((document) => canAccessDocument(session, document));
};

export const getAccessibleDocumentIds = (documents: DocumentItem[], session: AuthSession | null) =>
  new Set(getAccessibleDocuments(documents, session).map((document) => document.id));

export const createDocumentTreeView = (documents: DocumentItem[]) => {
  const visibleIds = new Set(documents.map((document) => document.id));

  return documents.map((document) =>
    document.parentId && !visibleIds.has(document.parentId)
      ? {
          ...document,
          // If a visible child has a hidden parent, show it as a temporary root item in the sidebar.
          parentId: null,
        }
      : document,
  );
};
