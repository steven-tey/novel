import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface DocumentTitleInputProps {
  title: string;
  onChange: (title: string) => void;
  autoFocus?: boolean;
  commitEmptyTitle?: boolean;
  onDraftChange?: (title: string) => void;
  className?: string;
  placeholder?: string;
}

export function DocumentTitleInput({
  title,
  onChange,
  autoFocus = false,
  commitEmptyTitle = true,
  onDraftChange,
  className,
  placeholder = "Untitled",
}: DocumentTitleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftTitle, setDraftTitle] = useState(title);

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const commitTitle = () => {
    const nextTitle = draftTitle.trim();
    if (!nextTitle && !commitEmptyTitle) return;
    onChange(nextTitle || "Untitled");
  };

  return (
    <input
      ref={inputRef}
      value={draftTitle}
      onChange={(event) => {
        setDraftTitle(event.target.value);
        onDraftChange?.(event.target.value);
      }}
      onBlur={commitTitle}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
      }}
      className={cn(
        "w-full bg-transparent text-3xl font-semibold outline-none placeholder:text-muted-foreground",
        className,
      )}
      placeholder={placeholder}
    />
  );
}
