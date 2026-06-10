import type { DocumentItem } from "@/lib/documents";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface DocumentMetaInfoProps {
  document: DocumentItem;
  wordCount: number;
}

export function DocumentMetaInfo({ document, wordCount }: DocumentMetaInfoProps) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">创建时间</span>
        <span className="truncate text-right">{formatDateTime(document.createdAt)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">更新时间</span>
        <span className="truncate text-right">{formatDateTime(document.updatedAt)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">正文字符</span>
        <span>{wordCount}</span>
      </div>
    </div>
  );
}
