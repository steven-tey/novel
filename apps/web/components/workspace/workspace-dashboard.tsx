"use client";

import { Button } from "@/components/tailwind/ui/button";
import { knowledgeStatusLabels, type DocumentFilter } from "@/lib/document-filters";
import type { DocumentItem } from "@/lib/documents";
import {
  Archive,
  BookOpenCheck,
  Clock3,
  DatabaseZap,
  FilePlus2,
  FileText,
  ListChecks,
  PenLine,
  RadioTower,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";

interface WorkspaceDashboardProps {
  documents: DocumentItem[];
  onCreateDocument: () => void;
  onOpenDocument: (documentId: string) => void;
  onApplyFilter: (filter: DocumentFilter) => void;
  onOpenSyncCenter: () => void;
  onSyncAllKnowledge: () => void;
}

export function WorkspaceDashboard({
  documents,
  onCreateDocument,
  onOpenDocument,
  onApplyFilter,
  onOpenSyncCenter,
  onSyncAllKnowledge,
}: WorkspaceDashboardProps) {
  const stats = useMemo(() => getDashboardStats(documents), [documents]);
  const recentDocuments = useMemo(
    () =>
      [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [documents],
  );
  const knowledgeTasks = useMemo(
    () =>
      documents
        .filter((document) => ["none", "outdated", "failed"].includes(document.knowledgeStatus ?? "none"))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [documents],
  );

  return (
    <main className="h-screen min-w-0 flex-1 overflow-y-auto bg-background">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">DocFlow AI 工作台</h1>
            <p className="mt-1 text-sm text-muted-foreground">查看文档运营状态，快速进入知识库处理流程。</p>
          </div>
          <Button className="gap-2" onClick={onCreateDocument}>
            <FilePlus2 className="h-4 w-4" />
            新建文档
          </Button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={<FileText className="h-4 w-4" />} label="全部文档" value={stats.total} />
          <StatCard icon={<PenLine className="h-4 w-4" />} label="草稿" value={stats.draft} />
          <StatCard icon={<BookOpenCheck className="h-4 w-4" />} label="已发布" value={stats.published} />
          <StatCard icon={<RadioTower className="h-4 w-4" />} label="已入库" value={stats.indexed} />
          <StatCard icon={<TriangleAlert className="h-4 w-4" />} label="已过期" value={stats.outdated} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <SectionHeader title="最近更新" description="快速回到最近编辑过的文档。" />
            {recentDocuments.length ? (
              <div className="mt-3 divide-y rounded-md border bg-background">
                {recentDocuments.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-accent"
                    onClick={() => onOpenDocument(document.id)}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{document.title || "无标题"}</div>
                      <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {document.summary || document.contentText || "暂无摘要"}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(document.updatedAt)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyBlock title="暂无文档" description="创建第一篇文档后，最近更新会显示在这里。" />
            )}
          </section>

          <aside className="space-y-6">
            <section>
              <SectionHeader title="快捷视图" description="按文档状态快速进入筛选视图。" />
              <div className="mt-3 grid gap-2">
                <QuickAction
                  label="查看草稿"
                  description={`${stats.draft} 篇待完善`}
                  icon={<PenLine className="h-4 w-4" />}
                  onClick={() => onApplyFilter({ type: "status", value: "draft" })}
                />
                <QuickAction
                  label="查看已入库"
                  description={`${stats.indexed} 篇可用于知识检索`}
                  icon={<BookOpenCheck className="h-4 w-4" />}
                  onClick={() => onApplyFilter({ type: "knowledge", value: "indexed" })}
                />
                <QuickAction
                  label="查看已过期"
                  description={`${stats.outdated} 篇需要重新同步`}
                  icon={<TriangleAlert className="h-4 w-4" />}
                  onClick={() => onApplyFilter({ type: "knowledge", value: "outdated" })}
                />
              </div>
            </section>

            <section>
              <div className="flex items-start justify-between gap-3">
                <SectionHeader title="知识库待处理" description="优先处理未同步、失败或过期的文档。" />
                <Button variant="outline" size="sm" className="h-8 shrink-0 gap-1.5" onClick={onOpenSyncCenter}>
                  <ListChecks className="h-3.5 w-3.5" />
                  任务中心
                </Button>
              </div>
              {knowledgeTasks.length ? (
                <div className="mt-3 space-y-2">
                  {knowledgeTasks.map((document) => (
                    <button
                      key={document.id}
                      type="button"
                      className="w-full rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-accent"
                      onClick={() => onOpenDocument(document.id)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-medium">{document.title || "无标题"}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {knowledgeStatusLabels[document.knowledgeStatus ?? "none"]}
                        </span>
                      </div>
                    </button>
                  ))}
                  <Button variant="outline" size="sm" className="h-8 w-full gap-2" onClick={onSyncAllKnowledge}>
                    <DatabaseZap className="h-3.5 w-3.5" />
                    同步全部待处理
                  </Button>
                </div>
              ) : (
                <EmptyBlock title="暂无待处理" description="当前知识库状态看起来很干净。" compact />
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function getDashboardStats(documents: DocumentItem[]) {
  return {
    total: documents.length,
    draft: documents.filter((document) => (document.status ?? "draft") === "draft").length,
    published: documents.filter((document) => document.status === "published").length,
    indexed: documents.filter((document) => document.knowledgeStatus === "indexed").length,
    outdated: documents.filter((document) => document.knowledgeStatus === "outdated").length,
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function QuickAction({
  label,
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-accent"
      onClick={onClick}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{description}</div>
      </div>
    </button>
  );
}

function EmptyBlock({ title, description, compact = false }: { title: string; description: string; compact?: boolean }) {
  return (
    <div className={`mt-3 rounded-md border border-dashed px-4 text-center ${compact ? "py-5" : "py-12"}`}>
      <Archive className="mx-auto h-5 w-5 text-muted-foreground" />
      <div className="mt-2 text-sm font-medium">{title}</div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
