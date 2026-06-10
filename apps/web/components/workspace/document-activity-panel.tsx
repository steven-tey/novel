import { formatAuditActor, type AuditLogItem } from "@/lib/audit-logs";
import { Clock3 } from "lucide-react";

interface DocumentActivityPanelProps {
  logs: AuditLogItem[];
}

export function DocumentActivityPanel({ logs }: DocumentActivityPanelProps) {
  if (!logs.length) {
    return (
      <div className="rounded-md border border-dashed px-3 py-6 text-center">
        <Clock3 className="mx-auto h-4 w-4 text-muted-foreground" />
        <div className="mt-2 text-xs font-medium">暂无文档动态</div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">编辑、同步或权限调整后会记录在这里。</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="rounded-md border bg-background px-3 py-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium">{log.actionLabel}</div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{formatAuditActor(log)}</div>
            </div>
            <time className="shrink-0 text-[11px] text-muted-foreground" dateTime={log.createdAt}>
              {formatActivityTime(log.createdAt)}
            </time>
          </div>
          {log.detail && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{log.detail}</p>}
        </div>
      ))}
    </div>
  );
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
