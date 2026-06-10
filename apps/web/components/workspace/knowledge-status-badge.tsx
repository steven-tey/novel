import type { KnowledgeStatus } from "@/lib/documents";
import { cn } from "@/lib/utils";

const knowledgeStatusConfig: Record<KnowledgeStatus, { label: string; className: string }> = {
  none: {
    label: "未同步",
    className: "bg-muted text-muted-foreground",
  },
  pending: {
    label: "同步中",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  indexed: {
    label: "已入库",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  failed: {
    label: "同步失败",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  outdated: {
    label: "已过期",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
};

interface KnowledgeStatusBadgeProps {
  status?: KnowledgeStatus;
  className?: string;
}

export function KnowledgeStatusBadge({ status = "none", className }: KnowledgeStatusBadgeProps) {
  const config = knowledgeStatusConfig[status];

  return (
    <span className={cn("inline-flex h-6 items-center rounded-full px-2 text-xs font-medium", config.className, className)}>
      {config.label}
    </span>
  );
}
