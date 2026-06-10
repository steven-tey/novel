"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/tailwind/ui/dialog";
import type { DocumentItem } from "@/lib/documents";
import { FileText, RotateCcw, Trash2 } from "lucide-react";
import { useMemo } from "react";

const formatDeletedAt = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface DocumentTrashDialogProps {
  open: boolean;
  documents: DocumentItem[];
  onOpenChange: (open: boolean) => void;
  onRestore: (documentId: string) => void;
  onPermanentlyDelete: (documentId: string) => void;
}

export function DocumentTrashDialog({
  open,
  documents,
  onOpenChange,
  onRestore,
  onPermanentlyDelete,
}: DocumentTrashDialogProps) {
  const sortedDocuments = useMemo(
    () =>
      [...documents].sort(
        (a, b) => new Date(b.deletedAt ?? b.updatedAt).getTime() - new Date(a.deletedAt ?? a.updatedAt).getTime(),
      ),
    [documents],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>垃圾桶</DialogTitle>
          <DialogDescription>这里保存被删除的文档，你可以恢复，也可以彻底删除。</DialogDescription>
        </DialogHeader>

        {sortedDocuments.length ? (
          <div className="max-h-[460px] space-y-2 overflow-y-auto pr-1">
            {sortedDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{document.title || "无标题"}</div>
                    <div className="mt-1 text-xs text-muted-foreground">删除于 {formatDeletedAt(document.deletedAt)}</div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => onRestore(document.id)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    恢复
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    onClick={() => onPermanentlyDelete(document.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    彻底删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed px-4 py-10 text-center">
            <div className="text-sm font-medium">垃圾桶为空</div>
            <p className="mt-1 text-xs text-muted-foreground">删除后的文档会先出现在这里。</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
