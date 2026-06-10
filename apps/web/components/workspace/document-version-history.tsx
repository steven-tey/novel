"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import type { DocumentVersion } from "@/lib/document-versions";
import { History, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const formatVersionTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getVersionSnippet = (version: DocumentVersion) => {
  const text = version.contentText.trim();
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
};

interface DocumentVersionHistoryProps {
  documentTitle: string;
  versions: DocumentVersion[];
  onRestore: (versionId: string) => void;
}

export function DocumentVersionHistory({ documentTitle, versions, onRestore }: DocumentVersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const sortedVersions = useMemo(
    () => [...versions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [versions],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs text-muted-foreground">
          <History className="h-3.5 w-3.5" />
          历史版本
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>历史版本</DialogTitle>
          <DialogDescription>{documentTitle || "无标题"} 的本地版本记录</DialogDescription>
        </DialogHeader>

        {sortedVersions.length ? (
          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {sortedVersions.map((version) => (
              <div key={version.id} className="rounded-md border bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{version.title || "无标题"}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{formatVersionTime(version.createdAt)}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 gap-1.5"
                    onClick={() => {
                      onRestore(version.id);
                      setOpen(false);
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    恢复
                  </Button>
                </div>
                {getVersionSnippet(version) && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{getVersionSnippet(version)}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed px-4 py-10 text-center">
            <div className="text-sm font-medium">暂无历史版本</div>
            <p className="mt-1 text-xs text-muted-foreground">编辑并保存后，这里会记录可恢复的版本快照。</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
