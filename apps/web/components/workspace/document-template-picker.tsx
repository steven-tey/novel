import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/tailwind/ui/dialog";
import { documentTemplates } from "@/lib/document-templates";
import { FileText, LayoutTemplate } from "lucide-react";

interface DocumentTemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (templateId: string) => void;
}

export function DocumentTemplatePicker({ open, onOpenChange, onSelect }: DocumentTemplatePickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            选择文档模板
          </DialogTitle>
          <DialogDescription>选择一个适合当前场景的模板，或从空白文档开始。</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:grid-cols-2">
          {documentTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className="rounded-md border bg-background p-4 text-left transition-colors hover:bg-accent"
              onClick={() => onSelect(template.id)}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {template.name}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
