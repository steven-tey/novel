import { Button } from "@/components/tailwind/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface DocumentTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function DocumentTagInput({ tags, onChange, disabled = false }: DocumentTagInputProps) {
  const [draftTag, setDraftTag] = useState("");

  const addTag = () => {
    const nextTag = draftTag.trim();
    if (!nextTag || tags.includes(nextTag)) return;
    onChange([...tags, nextTag]);
    setDraftTag("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.length ? (
          tags.map((tag) => (
            <span key={tag} className="inline-flex h-7 max-w-full items-center gap-1 rounded-full bg-muted px-2 text-xs">
              <span className="truncate">{tag}</span>
              <button
                type="button"
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => removeTag(tag)}
                disabled={disabled}
                aria-label={`删除标签 ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <div className="text-xs text-muted-foreground">暂无标签</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={draftTag}
          disabled={disabled}
          onChange={(event) => setDraftTag(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="添加标签"
        />
        <Button variant="outline" size="sm" className="h-8 shrink-0 px-2" onClick={addTag} disabled={disabled || !draftTag.trim()}>
          添加
        </Button>
      </div>
    </div>
  );
}
