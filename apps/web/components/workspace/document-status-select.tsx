import type { DocumentStatus } from "@/lib/documents";
import { cn } from "@/lib/utils";

const statusOptions: Array<{ value: DocumentStatus; label: string }> = [
  { value: "draft", label: "草稿" },
  { value: "reviewing", label: "审核中" },
  { value: "published", label: "已发布" },
  { value: "archived", label: "已归档" },
];

interface DocumentStatusSelectProps {
  value?: DocumentStatus;
  onChange: (status: DocumentStatus) => void;
  disabled?: boolean;
  className?: string;
}

export function DocumentStatusSelect({ value = "draft", onChange, disabled = false, className }: DocumentStatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as DocumentStatus)}
      className={cn(
        "h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
