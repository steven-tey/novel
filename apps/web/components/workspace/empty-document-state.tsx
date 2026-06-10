import { Button } from "@/components/tailwind/ui/button";
import { FilePlus2 } from "lucide-react";

interface EmptyDocumentStateProps {
  onCreateDocument: () => void;
}

export function EmptyDocumentState({ onCreateDocument }: EmptyDocumentStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
        <FilePlus2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="mt-4 text-base font-medium">请选择或新建一个文档</div>
      <div className="mt-1 text-sm text-muted-foreground">从左侧文档树选择已有文档，或创建新的知识库文档。</div>
      <Button className="mt-5 gap-2" onClick={onCreateDocument}>
        <FilePlus2 className="h-4 w-4" />
        新建文档
      </Button>
    </div>
  );
}
