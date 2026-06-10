import { DocumentTreeItem } from "@/components/workspace/document-tree-item";
import { getChildDocuments, type DocumentItem } from "@/lib/documents";
import type { WorkspaceMember } from "@/lib/members";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface DocumentTreeProps {
  documents: DocumentItem[];
  members: WorkspaceMember[];
  activeDocumentId: string | null;
  expandedDocumentIds: Set<string>;
  parentId?: string | null;
  depth?: number;
  onToggle: (documentId: string) => void;
  onSelect: (documentId: string) => void;
  onCreateChild: (parentId: string) => void;
  onRename: (documentId: string, title: string) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentTree({
  documents,
  members,
  activeDocumentId,
  expandedDocumentIds,
  parentId = null,
  depth = 0,
  onToggle,
  onSelect,
  onCreateChild,
  onRename,
  onDelete,
}: DocumentTreeProps) {
  const children = getChildDocuments(documents, parentId);

  return (
    <SortableContext items={children.map((document) => document.id)} strategy={verticalListSortingStrategy}>
      <div className={depth === 0 ? "space-y-0.5" : ""}>
        {children.map((document) => {
          const childDocuments = getChildDocuments(documents, document.id);
          const hasChildren = childDocuments.length > 0;
          const expanded = expandedDocumentIds.has(document.id);

          return (
            <div key={document.id}>
              <DocumentTreeItem
                document={document}
                members={members}
                depth={depth}
                activeDocumentId={activeDocumentId}
                hasChildren={hasChildren}
                expanded={expanded}
                onToggle={onToggle}
                onSelect={onSelect}
                onCreateChild={onCreateChild}
                onRename={onRename}
                onDelete={onDelete}
              />
              {hasChildren && expanded && (
                <DocumentTree
                  documents={documents}
                  members={members}
                  activeDocumentId={activeDocumentId}
                  expandedDocumentIds={expandedDocumentIds}
                  parentId={document.id}
                  depth={depth + 1}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  onCreateChild={onCreateChild}
                  onRename={onRename}
                  onDelete={onDelete}
                />
              )}
            </div>
          );
        })}
      </div>
    </SortableContext>
  );
}
