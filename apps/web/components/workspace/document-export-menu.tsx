"use client";

import { Button } from "@/components/tailwind/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { downloadDocumentExport, type DocumentExportFormat } from "@/lib/document-export";
import type { DocumentItem, DraftDocument } from "@/lib/documents";
import { Code2, Download, FileText, Printer, ScrollText } from "lucide-react";
import { useState } from "react";

interface DocumentExportMenuProps {
  document: DocumentItem | DraftDocument;
}

const exportOptions: Array<{
  format: DocumentExportFormat;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  {
    format: "markdown",
    label: "Markdown",
    description: "适合导入其他知识库或代码仓库",
    icon: ScrollText,
  },
  {
    format: "html",
    label: "HTML",
    description: "适合网页预览或归档",
    icon: Code2,
  },
  {
    format: "txt",
    label: "纯文本",
    description: "适合快速分享和复制",
    icon: FileText,
  },
  {
    format: "pdf",
    label: "PDF",
    description: "直接生成并下载 PDF 文件",
    icon: Printer,
  },
];

export function DocumentExportMenu({ document }: DocumentExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<DocumentExportFormat | null>(null);

  const exportDocument = async (format: DocumentExportFormat) => {
    setExportingFormat(format);

    try {
      await downloadDocumentExport(document, format);
      setOpen(false);
    } catch (error) {
      console.error("导出文档失败", error);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <Download className="h-3.5 w-3.5" />
          导出
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="px-2 pb-2 pt-1">
          <div className="text-sm font-medium">导出文档</div>
          <p className="mt-1 text-xs text-muted-foreground">选择一种格式保存到本地。</p>
        </div>
        <div className="space-y-1">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              type="button"
              disabled={Boolean(exportingFormat)}
              className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60"
              onClick={() => exportDocument(option.format)}
            >
              <option.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-sm font-medium">
                  {exportingFormat === option.format ? "正在导出..." : option.label}
                </span>
                <span className="block text-xs leading-5 text-muted-foreground">{option.description}</span>
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
