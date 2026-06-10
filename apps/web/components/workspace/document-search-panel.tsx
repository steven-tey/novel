"use client";

import { Button } from "@/components/tailwind/ui/button";
import { useDocumentSearch } from "@/hooks/use-document-search";
import { cn } from "@/lib/utils";
import type { SearchType } from "@/lib/document-search";
import type { DocumentItem } from "@/lib/documents";
import { Clock3, FileSearch, Search, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const searchTypeOptions: Array<{ value: SearchType; label: string }> = [
  { value: "all", label: "全部" },
  { value: "title", label: "标题" },
  { value: "content", label: "正文" },
  { value: "tag", label: "标签" },
];

export const highlightKeyword = (text: string, keyword: string): ReactNode[] => {
  const normalizedKeyword = keyword.trim();
  if (!text || !normalizedKeyword) return [text];

  const lowerText = text.toLowerCase();
  const lowerKeyword = normalizedKeyword.toLowerCase();
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let index = lowerText.indexOf(lowerKeyword);

  while (index >= 0) {
    if (index > cursor) nodes.push(text.slice(cursor, index));
    nodes.push(
      <mark key={`${index}-${lowerKeyword}`} className="rounded bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-500/30">
        {text.slice(index, index + normalizedKeyword.length)}
      </mark>,
    );
    cursor = index + normalizedKeyword.length;
    index = lowerText.indexOf(lowerKeyword, cursor);
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
};

const formatUpdatedAt = (value: string | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface DocumentSearchPanelProps {
  documents: DocumentItem[];
  activeDocumentId: string | null;
  onSelect: (documentId: string) => void;
}

export function DocumentSearchPanel({ documents, activeDocumentId, onSelect }: DocumentSearchPanelProps) {
  const [focused, setFocused] = useState(false);
  const { query, setQuery, keyword, searchType, setSearchType, results, history, applyHistoryKeyword } = useDocumentSearch(documents);
  const searching = Boolean(keyword);
  const showHistory = focused && !query.trim() && history.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex h-8 items-center gap-2 rounded-md bg-muted/70 px-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="搜索文档"
        />
      </div>

      <div className="grid grid-cols-4 gap-1 rounded-md bg-muted/60 p-1">
        {searchTypeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSearchType(option.value)}
            className={cn(
              "h-7 rounded px-1 text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
              searchType === option.value && "bg-background text-foreground shadow-sm",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {showHistory && (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            最近搜索
          </div>
          <div className="flex flex-wrap gap-1">
            {history.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded bg-muted px-2 py-1 text-xs hover:bg-accent"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyHistoryKeyword(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {searching && (
        <div className="pt-1">
          <div className="mb-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>搜索结果</span>
            <span>{results.length} 个</span>
          </div>

          {results.length ? (
            <div className="space-y-1.5">
              {results.map(({ document, snippet }) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => onSelect(document.id)}
                  className={cn(
                    "w-full rounded-md px-2 py-2 text-left transition-colors hover:bg-accent",
                    document.id === activeDocumentId && "bg-accent",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileSearch className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-medium">{highlightKeyword(document.title || "Untitled", keyword)}</span>
                  </div>
                  {snippet && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {highlightKeyword(snippet, keyword)}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>{formatUpdatedAt(document.updatedAt)}</span>
                    {document.tags?.length ? (
                      <span className="flex min-w-0 items-center gap-1">
                        <Tag className="h-3 w-3 shrink-0" />
                        <span className="truncate">{document.tags.slice(0, 2).join("、")}</span>
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed px-3 py-6 text-center">
              <div className="text-sm font-medium">没有找到相关文档</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">你可以尝试更换关键词，或切换搜索范围后重新搜索。</p>
            </div>
          )}

          <Button variant="ghost" className="mt-2 h-8 w-full text-xs text-muted-foreground" onClick={() => setQuery("")}>
            返回文档树
          </Button>
        </div>
      )}
    </div>
  );
}
