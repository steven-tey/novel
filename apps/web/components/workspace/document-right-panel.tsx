"use client";

import { DocumentOutline } from "@/components/workspace/document-outline";
import { DocumentPropertiesPanel } from "@/components/workspace/document-properties-panel";
import type { AuditLogItem } from "@/lib/audit-logs";
import type { DocumentItem, DocumentMetaUpdate } from "@/lib/documents";
import type { WorkspaceMember, WorkspaceMemberInput } from "@/lib/members";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, FileSliders, ListTree, PanelRightClose, PanelRightOpen } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

type RightPanelTab = "properties" | "outline";

interface DocumentRightPanelProps {
  document?: DocumentItem;
  contentJson: any;
  members: WorkspaceMember[];
  auditLogs: AuditLogItem[];
  wordCount: number;
  onMetaChange?: (updates: DocumentMetaUpdate) => void;
  canManageDocumentMembers?: boolean;
  onCreateMember?: (input: WorkspaceMemberInput) => WorkspaceMember;
  onSyncKnowledge?: () => void;
  onOpenSyncCenter?: () => void;
  onGenerateMetadata?: () => Promise<void>;
}

export function DocumentRightPanel({
  document,
  contentJson,
  members,
  auditLogs,
  wordCount,
  onMetaChange,
  canManageDocumentMembers = false,
  onCreateMember,
  onSyncKnowledge,
  onOpenSyncCenter,
  onGenerateMetadata,
}: DocumentRightPanelProps) {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("properties");
  const [contentCollapsed, setContentCollapsed] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(true);

  if (panelCollapsed) {
    return (
      <aside className="hidden h-screen w-12 shrink-0 flex-col items-center border-l bg-[#fbfbfa] py-4 xl:flex dark:bg-background">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setPanelCollapsed(false)}
          title="展开右侧栏"
        >
          <PanelRightOpen className="h-4 w-4" />
          <span className="sr-only">展开右侧栏</span>
        </button>
        <div className="mt-4 grid gap-2">
          <RailButton
            active={activeTab === "properties"}
            title="属性"
            onClick={() => {
              setActiveTab("properties");
              setPanelCollapsed(false);
              setContentCollapsed(false);
            }}
          >
            <FileSliders className="h-4 w-4" />
          </RailButton>
          <RailButton
            active={activeTab === "outline"}
            title="大纲"
            onClick={() => {
              setActiveTab("outline");
              setPanelCollapsed(false);
              setContentCollapsed(false);
            }}
          >
            <ListTree className="h-4 w-4" />
          </RailButton>
        </div>
      </aside>
    );
  }

  const activeLabel = activeTab === "properties" ? "属性" : "大纲";

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-l bg-[#fbfbfa] xl:flex dark:bg-background">
      <div className="border-b px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-1 rounded-md bg-muted/70 p-1">
            <PanelTabButton
              active={activeTab === "properties"}
              onClick={() => {
                setActiveTab("properties");
                setContentCollapsed(false);
              }}
            >
              <FileSliders className="h-3.5 w-3.5" />
              属性
            </PanelTabButton>
            <PanelTabButton
              active={activeTab === "outline"}
              onClick={() => {
                setActiveTab("outline");
                setContentCollapsed(false);
              }}
            >
              <ListTree className="h-3.5 w-3.5" />
              大纲
            </PanelTabButton>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => setPanelCollapsed(true)}
            title="收起右侧栏"
          >
            <PanelRightClose className="h-4 w-4" />
            <span className="sr-only">收起右侧栏</span>
          </button>
        </div>

        <button
          type="button"
          className="mt-3 flex h-7 w-full items-center justify-between rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setContentCollapsed((value) => !value)}
        >
          <span>{contentCollapsed ? `展开${activeLabel}` : `收起${activeLabel}`}</span>
          {contentCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        {contentCollapsed ? (
          <div className="rounded-md border border-dashed px-4 py-10 text-center">
            <div className="text-sm font-medium">{activeLabel}已收起</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">需要查看时可以在上方重新展开。</p>
          </div>
        ) : activeTab === "properties" ? (
          <DocumentPropertiesPanel
            document={document}
            members={members}
            auditLogs={auditLogs}
            wordCount={wordCount}
            onChange={onMetaChange}
            canManageDocumentMembers={canManageDocumentMembers}
            onCreateMember={onCreateMember}
            onSyncKnowledge={onSyncKnowledge}
            onOpenSyncCenter={onOpenSyncCenter}
            onGenerateMetadata={onGenerateMetadata}
          />
        ) : (
          <DocumentOutline contentJson={contentJson} />
        )}
      </div>
    </aside>
  );
}

function RailButton({
  active,
  title,
  onClick,
  children,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        active && "bg-accent text-foreground",
      )}
      onClick={onClick}
      title={title}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}

function PanelTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 items-center justify-center gap-1.5 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
        active && "bg-background text-foreground shadow-sm",
      )}
    >
      {children}
    </button>
  );
}
