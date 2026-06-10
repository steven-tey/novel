"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/tailwind/ui/dialog";
import { KnowledgeStatusBadge } from "@/components/workspace/knowledge-status-badge";
import type { DocumentItem, KnowledgeStatus } from "@/lib/documents";
import {
  isDocumentKnowledgeIndexStale,
  searchKnowledgeChunks,
  type KnowledgeIndexStore,
} from "@/lib/knowledge-base";
import {
  getKnowledgeSyncCandidates,
  knowledgeSyncLogStatusLabels,
  type KnowledgeSyncLog,
  type KnowledgeSyncLogStatus,
} from "@/lib/knowledge-sync";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock3, DatabaseZap, FileText, History, Loader2, RadioTower, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

interface KnowledgeSyncCenterProps {
  open: boolean;
  documents: DocumentItem[];
  knowledgeIndex: KnowledgeIndexStore;
  logs: KnowledgeSyncLog[];
  onOpenChange: (open: boolean) => void;
  onOpenDocument: (documentId: string) => void;
  onSyncDocument: (documentId: string) => void;
  onSyncAll: () => void;
}

export function KnowledgeSyncCenter({
  open,
  documents,
  knowledgeIndex,
  logs,
  onOpenChange,
  onOpenDocument,
  onSyncDocument,
  onSyncAll,
}: KnowledgeSyncCenterProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const syncCandidates = useMemo(() => getKnowledgeSyncCandidates(documents, knowledgeIndex), [documents, knowledgeIndex]);
  const searchResults = useMemo(
    () => searchKnowledgeChunks(knowledgeIndex.chunks, searchKeyword),
    [knowledgeIndex.chunks, searchKeyword],
  );
  const queueDocuments = useMemo(
    () =>
      documents
        .filter((document) => {
          const knowledgeStatus = getEffectiveKnowledgeStatus(document, knowledgeIndex);
          if (["pending", "none", "outdated", "failed"].includes(knowledgeStatus)) return true;
          return false;
        })
        .sort((a, b) => {
          const priority: Record<KnowledgeStatus, number> = {
            pending: 0,
            failed: 1,
            outdated: 2,
            none: 3,
            indexed: 4,
          };
          const statusDiff =
            priority[getEffectiveKnowledgeStatus(a, knowledgeIndex)] - priority[getEffectiveKnowledgeStatus(b, knowledgeIndex)];
          if (statusDiff !== 0) return statusDiff;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }),
    [documents, knowledgeIndex],
  );

  const pendingCount = documents.filter((document) => getEffectiveKnowledgeStatus(document, knowledgeIndex) === "pending").length;
  const indexedCount = documents.filter((document) => getEffectiveKnowledgeStatus(document, knowledgeIndex) === "indexed").length;
  const failedCount = documents.filter((document) => getEffectiveKnowledgeStatus(document, knowledgeIndex) === "failed").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0">
        <div className="border-b px-5 py-4 pr-12">
          <DialogHeader>
            <DialogTitle>知识库同步任务中心</DialogTitle>
            <DialogDescription>统一查看待入库文档、同步状态和最近任务记录。</DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 space-y-4 overflow-y-auto px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <SyncStatCard icon={<RadioTower className="h-4 w-4" />} label="已入库" value={indexedCount} />
            <SyncStatCard icon={<FileText className="h-4 w-4" />} label="知识片段" value={knowledgeIndex.chunks.length} />
            <SyncStatCard icon={<Loader2 className="h-4 w-4" />} label="同步中" value={pendingCount} />
            <SyncStatCard icon={<TriangleAlert className="h-4 w-4" />} label="失败待重试" value={failedCount} />
          </div>

          <section className="rounded-md border bg-background p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">本地知识库检索</h3>
                <p className="mt-1 text-xs text-muted-foreground">搜索已入库的知识片段，点击结果可回到原文档。</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:border-foreground"
                  placeholder="搜索知识库片段"
                />
              </div>
            </div>

            {searchKeyword.trim() ? (
              searchResults.length ? (
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {searchResults.slice(0, 4).map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      className="rounded-md border px-3 py-2 text-left transition-colors hover:bg-accent"
                      onClick={() => onOpenDocument(result.documentId)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-medium">{result.documentTitle}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">score {result.score}</span>
                      </div>
                      {result.headingPath.length > 0 && (
                        <div className="mt-1 truncate text-xs text-muted-foreground">{result.headingPath.join(" / ")}</div>
                      )}
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{result.snippet}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-md border border-dashed px-3 py-5 text-center text-sm text-muted-foreground">
                  没有找到匹配的知识片段。
                </div>
              )
            ) : (
              <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                当前已索引 {knowledgeIndex.documents.length} 篇文档，共 {knowledgeIndex.chunks.length} 个知识片段。
              </div>
            )}
          </section>

          <div className="grid min-h-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">待处理队列</h3>
                  <p className="mt-1 text-xs text-muted-foreground">未同步、失败、过期和正在同步的文档会出现在这里。</p>
                </div>
                <Button size="sm" className="h-8 gap-2" disabled={!syncCandidates.length} onClick={onSyncAll}>
                  <DatabaseZap className="h-3.5 w-3.5" />
                  同步全部待处理
                </Button>
              </div>

              {queueDocuments.length ? (
                <div className="max-h-[min(420px,45vh)] overflow-y-auto rounded-md border bg-background">
                  {queueDocuments.map((document) => {
                    const knowledgeStatus = getEffectiveKnowledgeStatus(document, knowledgeIndex);
                    const syncing = knowledgeStatus === "pending";
                    const canSync = knowledgeStatus === "none" || knowledgeStatus === "failed" || knowledgeStatus === "outdated";

                    return (
                      <div key={document.id} className="flex items-center justify-between gap-3 border-b p-3 last:border-b-0">
                        <button
                          type="button"
                          className="flex min-w-0 flex-1 items-start gap-2 text-left"
                          onClick={() => onOpenDocument(document.id)}
                        >
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{document.title || "无标题"}</div>
                            <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                              {document.summary || document.contentText || "暂无摘要"}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <KnowledgeStatusBadge status={knowledgeStatus} />
                              <span>{formatDateTime(document.updatedAt)}</span>
                            </div>
                          </div>
                        </button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 shrink-0 gap-1.5"
                          disabled={!canSync}
                          onClick={() => onSyncDocument(document.id)}
                        >
                          {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DatabaseZap className="h-3.5 w-3.5" />}
                          {syncing ? "同步中" : "同步"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-md border border-dashed px-4 py-12 text-center">
                  <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" />
                  <div className="mt-2 text-sm font-medium">暂无待同步文档</div>
                  <p className="mt-1 text-xs text-muted-foreground">所有文档都已经完成知识库入库。</p>
                </div>
              )}
            </section>

            <aside className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">最近同步记录</h3>
              </div>

              {logs.length ? (
                <div className="max-h-[min(420px,45vh)] space-y-2 overflow-y-auto pr-1">
                  {logs.slice(0, 12).map((log) => (
                    <button
                      key={log.id}
                      type="button"
                      className="w-full rounded-md border bg-background p-3 text-left transition-colors hover:bg-accent"
                      onClick={() => onOpenDocument(log.documentId)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate text-sm font-medium">{log.documentTitle}</span>
                        <LogStatusBadge status={log.status} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{log.message}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDateTime(log.createdAt)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed px-4 py-10 text-center">
                  <History className="mx-auto h-5 w-5 text-muted-foreground" />
                  <div className="mt-2 text-sm font-medium">暂无同步记录</div>
                  <p className="mt-1 text-xs text-muted-foreground">发起同步后，这里会记录任务结果。</p>
                </div>
              )}
            </aside>
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            当前已在浏览器本地完成分块与索引持久化，后续可以替换为向量化、RAG 入库任务和后端任务队列。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SyncStatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function LogStatusBadge({ status }: { status: KnowledgeSyncLogStatus }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        status === "pending" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        status === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        status === "failed" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      )}
    >
      {knowledgeSyncLogStatusLabels[status]}
    </span>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEffectiveKnowledgeStatus(document: DocumentItem, knowledgeIndex: KnowledgeIndexStore): KnowledgeStatus {
  const knowledgeStatus = document.knowledgeStatus ?? "none";

  if (knowledgeStatus === "indexed") {
    return isDocumentKnowledgeIndexStale(document, knowledgeIndex) ? "outdated" : "indexed";
  }

  if (knowledgeStatus !== "pending") return knowledgeStatus;

  if (!isDocumentKnowledgeIndexStale(document, knowledgeIndex)) return "indexed";

  const pendingSince = new Date(document.updatedAt).getTime();
  const pendingStillFresh = Number.isFinite(pendingSince) && Date.now() - pendingSince < 30_000;
  return pendingStillFresh ? "pending" : "outdated";
}
