"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  defaultDocumentFilter,
  getDocumentFilterLabel,
  getDocumentFilterOptions,
  isDefaultDocumentFilter,
  type DocumentFilter,
  type DocumentFilterOption,
} from "@/lib/document-filters";
import type { DocumentItem, DocumentStatus, KnowledgeStatus } from "@/lib/documents";
import type { WorkspaceMember } from "@/lib/members";
import { cn } from "@/lib/utils";
import { BookOpenCheck, ChevronDown, CircleDot, Hash, SlidersHorizontal, Users, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

interface DocumentFilterPanelProps {
  documents: DocumentItem[];
  members: WorkspaceMember[];
  filter: DocumentFilter;
  filteredCount: number;
  onFilterChange: (filter: DocumentFilter) => void;
}

export function DocumentFilterPanel({ documents, members, filter, filteredCount, onFilterChange }: DocumentFilterPanelProps) {
  const { statusOptions, knowledgeOptions, tagOptions, memberOptions } = useMemo(
    () => getDocumentFilterOptions(documents, members),
    [documents, members],
  );
  const active = !isDefaultDocumentFilter(filter);
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <div className="rounded-md border bg-background">
      <button
        type="button"
        className="flex min-h-9 w-full items-center justify-between gap-2 px-2 text-left"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
          <span className="shrink-0">视图筛选</span>
          <span className="truncate font-normal">{active ? getDocumentFilterLabel(filter, members) : "全部文档"}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {active && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{filteredCount}</span>}
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="border-t">
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="text-xs text-muted-foreground">选择一个视图范围</div>
            {active && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-1.5 text-xs text-muted-foreground"
                onClick={() => onFilterChange(defaultDocumentFilter)}
              >
                <X className="h-3 w-3" />
                清除
              </Button>
            )}
          </div>

          <div className="max-h-[min(360px,42vh)] overflow-y-auto px-2 pb-2 pr-1">
            <button
              type="button"
              className={cn(
                "mb-2 flex h-7 w-full items-center justify-between rounded px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
                !active && "bg-accent text-foreground",
              )}
              onClick={() => onFilterChange(defaultDocumentFilter)}
            >
              <span>全部文档</span>
              <span>{documents.length}</span>
            </button>

            {active && (
              <div className="mb-2 rounded bg-muted/60 px-2 py-1.5 text-xs text-muted-foreground">
                当前：{getDocumentFilterLabel(filter, members)} · {filteredCount} 篇
              </div>
            )}

            <FilterSection icon={<Users className="h-3.5 w-3.5" />} title="按成员">
              {memberOptions.length ? (
                memberOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    option={option}
                    active={filter.type === "member" && filter.value === option.value}
                    onClick={() => onFilterChange({ type: "member", value: option.value })}
                  />
                ))
              ) : (
                <div className="px-2 py-1 text-xs text-muted-foreground">暂无成员分配</div>
              )}
            </FilterSection>

            <FilterSection icon={<CircleDot className="h-3.5 w-3.5" />} title="按状态">
              {statusOptions.map((option) => (
                <FilterButton
                  key={option.value}
                  option={option}
                  active={filter.type === "status" && filter.value === option.value}
                  onClick={() => onFilterChange({ type: "status", value: option.value as DocumentStatus })}
                />
              ))}
            </FilterSection>

            <FilterSection icon={<Hash className="h-3.5 w-3.5" />} title="按标签">
              {tagOptions.length ? (
                tagOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    option={{ ...option, label: `#${option.label}` }}
                    active={filter.type === "tag" && filter.value === option.value}
                    onClick={() => onFilterChange({ type: "tag", value: option.value })}
                  />
                ))
              ) : (
                <div className="px-2 py-1 text-xs text-muted-foreground">暂无标签</div>
              )}
            </FilterSection>

            <FilterSection icon={<BookOpenCheck className="h-3.5 w-3.5" />} title="知识库">
              {knowledgeOptions.map((option) => (
                <FilterButton
                  key={option.value}
                  option={option}
                  active={filter.type === "knowledge" && filter.value === option.value}
                  onClick={() => onFilterChange({ type: "knowledge", value: option.value as KnowledgeStatus })}
                />
              ))}
            </FilterSection>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="mt-2 border-t pt-2">
      <div className="mb-1 flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterButton({ option, active, onClick }: { option: DocumentFilterOption; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={option.count === 0}
      className={cn(
        "flex h-7 w-full items-center justify-between rounded px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-accent text-foreground",
      )}
      onClick={onClick}
      title={option.label}
    >
      <span className="truncate">{option.label}</span>
      <span className="ml-2 shrink-0">{option.count}</span>
    </button>
  );
}
