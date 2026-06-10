import { getDocumentOutline } from "@/lib/document-outline";
import { cn } from "@/lib/utils";

interface DocumentOutlineProps {
  contentJson: any;
  className?: string;
}

export function DocumentOutline({ contentJson, className }: DocumentOutlineProps) {
  const outline = getDocumentOutline(contentJson);

  return (
    <div className={className}>
      <div className="text-xs font-medium text-muted-foreground">文档大纲</div>
      {outline.length ? (
        <div className="mt-3 space-y-1">
          {outline.map((item) => (
            <div
              key={item.id}
              className={cn(
                "truncate rounded-sm py-1 text-xs text-muted-foreground",
                item.level === 1 && "pl-0 font-medium text-foreground",
                item.level === 2 && "pl-3",
                item.level === 3 && "pl-6",
              )}
              title={item.text}
            >
              {item.text}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 text-xs leading-5 text-muted-foreground">暂无大纲</div>
      )}
    </div>
  );
}
