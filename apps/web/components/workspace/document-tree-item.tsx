import { Button } from "@/components/tailwind/ui/button";
import { MemberAvatar } from "@/components/workspace/member-avatar";
import type { DocumentItem } from "@/lib/documents";
import { getMemberById, type WorkspaceMember } from "@/lib/members";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, FileText, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface DocumentTreeItemProps {
  document: DocumentItem;
  members: WorkspaceMember[];
  depth: number;
  activeDocumentId: string | null;
  hasChildren: boolean;
  expanded: boolean;
  onToggle: (documentId: string) => void;
  onSelect: (documentId: string) => void;
  onCreateChild: (parentId: string) => void;
  onRename: (documentId: string, title: string) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentTreeItem({
  document,
  members,
  depth,
  activeDocumentId,
  hasChildren,
  expanded,
  onToggle,
  onSelect,
  onCreateChild,
  onRename,
  onDelete,
}: DocumentTreeItemProps) {
  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(document.title);
  const [actionsOpen, setActionsOpen] = useState(false);
  const isActive = document.id === activeDocumentId;
  const owner = getMemberById(members, document.ownerId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: document.id,
    disabled: renaming,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const commitRename = () => {
    onRename(document.id, draftTitle.trim() || "无标题");
    setRenaming(false);
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("group relative", isDragging && "z-30 opacity-50")}>
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "flex h-8 cursor-grab items-center rounded-md pr-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing",
          isActive && "bg-accent text-foreground",
          isDragging && "bg-accent shadow-sm",
        )}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        <button
          type="button"
          className="flex h-6 w-5 items-center justify-center"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) onToggle(document.id);
          }}
        >
          {hasChildren ? (
            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")} />
          ) : (
            <span className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => onSelect(document.id)}
          onDoubleClick={() => setRenaming(true)}
        >
          <FileText className="h-4 w-4 shrink-0" />
          {renaming ? (
            <input
              value={draftTitle}
              autoFocus
              onChange={(event) => setDraftTitle(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitRename();
                if (event.key === "Escape") {
                  setDraftTitle(document.title);
                  setRenaming(false);
                }
              }}
              className="h-6 min-w-0 flex-1 rounded-sm border bg-background px-1 text-sm outline-none"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <>
              <span className="truncate">{document.title || "无标题"}</span>
              <MemberAvatar member={owner} className="ml-auto opacity-85" />
            </>
          )}
        </button>

        <div className="ml-1 hidden items-center gap-0.5 group-hover:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(event) => {
              event.stopPropagation();
              onCreateChild(document.id);
            }}
            title="新建子文档"
            aria-label="新建子文档"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(event) => {
              event.stopPropagation();
              setActionsOpen((open) => !open);
            }}
            title="更多操作"
            aria-label="更多操作"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {actionsOpen && (
        <div className="absolute right-1 top-7 z-20 w-32 rounded-md border bg-popover p-1 text-sm shadow-md">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent"
            onClick={() => {
              setActionsOpen(false);
              setRenaming(true);
            }}
          >
            重命名
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => {
              setActionsOpen(false);
              onDelete(document.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </button>
        </div>
      )}
    </div>
  );
}
