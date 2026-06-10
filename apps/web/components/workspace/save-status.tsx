import type { SaveStatusValue } from "@/lib/documents";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

const statusConfig: Record<SaveStatusValue, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  saving: {
    label: "保存中",
    className: "text-amber-600",
    icon: Loader2,
  },
  saved: {
    label: "已保存",
    className: "text-emerald-600",
    icon: CheckCircle2,
  },
  error: {
    label: "保存失败",
    className: "text-red-600",
    icon: TriangleAlert,
  },
};

interface SaveStatusProps {
  status: SaveStatusValue;
}

export function SaveStatus({ status }: SaveStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 text-xs ${config.className}`}>
      <Icon className={`h-3.5 w-3.5 ${status === "saving" ? "animate-spin" : ""}`} />
      {config.label}
    </div>
  );
}
