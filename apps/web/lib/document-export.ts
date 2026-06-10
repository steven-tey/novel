import type { DocumentItem, DraftDocument } from "@/lib/documents";

export type DocumentExportFormat = "markdown" | "html" | "txt" | "pdf";

type ExportableDocument = Pick<DocumentItem | DraftDocument, "title" | "contentJson" | "contentText">;
type DownloadableDocumentExportFormat = Exclude<DocumentExportFormat, "pdf">;

type EditorContentNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: EditorContentNode[];
};

const exportConfig: Record<DownloadableDocumentExportFormat, { extension: string; mimeType: string }> = {
  markdown: {
    extension: "md",
    mimeType: "text/markdown;charset=utf-8",
  },
  html: {
    extension: "html",
    mimeType: "text/html;charset=utf-8",
  },
  txt: {
    extension: "txt",
    mimeType: "text/plain;charset=utf-8",
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object");

const toEditorContentNode = (value: unknown): EditorContentNode | null => {
  if (!isRecord(value)) return null;

  return {
    type: typeof value.type === "string" ? value.type : undefined,
    text: typeof value.text === "string" ? value.text : undefined,
    attrs: isRecord(value.attrs) ? value.attrs : undefined,
    marks: Array.isArray(value.marks)
      ? value.marks
          .filter((mark): mark is Record<string, unknown> => isRecord(mark))
          .map((mark) => ({
            type: typeof mark.type === "string" ? mark.type : undefined,
            attrs: isRecord(mark.attrs) ? mark.attrs : undefined,
          }))
      : undefined,
    content: Array.isArray(value.content)
      ? value.content.map((item) => toEditorContentNode(item)).filter((item): item is EditorContentNode => Boolean(item))
      : undefined,
  };
};

const sanitizeFileName = (value: string) =>
  (value.trim() || "无标题文档").replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").slice(0, 80);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getNodeText = (node: EditorContentNode): string => {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map((child) => getNodeText(child)).join(node.type === "paragraph" ? "" : " ");
};

const applyMarkdownMarks = (text: string, marks: EditorContentNode["marks"]) => {
  if (!marks?.length) return text;

  return marks.reduce((result, mark) => {
    if (mark.type === "bold") return `**${result}**`;
    if (mark.type === "italic") return `_${result}_`;
    if (mark.type === "strike") return `~~${result}~~`;
    if (mark.type === "code") return `\`${result}\``;
    if (mark.type === "link" && typeof mark.attrs?.href === "string") return `[${result}](${mark.attrs.href})`;
    return result;
  }, text);
};

const applyHtmlMarks = (text: string, marks: EditorContentNode["marks"]) => {
  if (!marks?.length) return escapeHtml(text);

  return marks.reduce((result, mark) => {
    if (mark.type === "bold") return `<strong>${result}</strong>`;
    if (mark.type === "italic") return `<em>${result}</em>`;
    if (mark.type === "strike") return `<s>${result}</s>`;
    if (mark.type === "code") return `<code>${result}</code>`;
    if (mark.type === "link" && typeof mark.attrs?.href === "string") {
      return `<a href="${escapeHtml(mark.attrs.href)}">${result}</a>`;
    }
    return result;
  }, escapeHtml(text));
};

const renderInlineMarkdown = (node: EditorContentNode): string => {
  if (node.type === "text") return applyMarkdownMarks(node.text ?? "", node.marks);
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(renderInlineMarkdown).join("");
};

const renderInlineHtml = (node: EditorContentNode): string => {
  if (node.type === "text") return applyHtmlMarks(node.text ?? "", node.marks);
  if (node.type === "hardBreak") return "<br />";
  return (node.content ?? []).map(renderInlineHtml).join("");
};

const renderMarkdownNode = (node: EditorContentNode, listIndex = 1): string => {
  const children = node.content ?? [];
  const inlineText = renderInlineMarkdown(node).trim();

  if (node.type === "paragraph") return inlineText;
  if (node.type === "heading") {
    const level = typeof node.attrs?.level === "number" ? Math.max(1, Math.min(node.attrs.level, 6)) : 1;
    return `${"#".repeat(level)} ${inlineText}`;
  }
  if (node.type === "blockquote") {
    return inlineText
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
  }
  if (node.type === "codeBlock") return `\`\`\`\n${getNodeText(node).trim()}\n\`\`\``;
  if (node.type === "horizontalRule") return "---";
  if (node.type === "bulletList") return children.map((child) => renderMarkdownNode(child)).join("\n");
  if (node.type === "orderedList") {
    return children
      .map((child, index) => `${index + 1}. ${(child.content ?? []).map(renderMarkdownNode).filter(Boolean).join("\n   ")}`)
      .join("\n");
  }
  if (node.type === "taskList") return children.map((child) => renderMarkdownNode(child)).join("\n");
  if (node.type === "listItem") return `- ${children.map(renderMarkdownNode).filter(Boolean).join("\n  ")}`;
  if (node.type === "taskItem") {
    const checked = node.attrs?.checked === true ? "x" : " ";
    return `- [${checked}] ${children.map(renderMarkdownNode).filter(Boolean).join("\n  ")}`;
  }
  if (node.type === "orderedListItem") return `${listIndex}. ${children.map(renderMarkdownNode).filter(Boolean).join("\n   ")}`;

  return children.map(renderMarkdownNode).filter(Boolean).join("\n\n");
};

const renderHtmlNode = (node: EditorContentNode): string => {
  const children = node.content ?? [];
  const inlineHtml = renderInlineHtml(node);

  if (node.type === "paragraph") return `<p>${inlineHtml}</p>`;
  if (node.type === "heading") {
    const level = typeof node.attrs?.level === "number" ? Math.max(1, Math.min(node.attrs.level, 6)) : 1;
    return `<h${level}>${inlineHtml}</h${level}>`;
  }
  if (node.type === "blockquote") return `<blockquote>${children.map(renderHtmlNode).join("") || inlineHtml}</blockquote>`;
  if (node.type === "codeBlock") return `<pre><code>${escapeHtml(getNodeText(node).trim())}</code></pre>`;
  if (node.type === "horizontalRule") return "<hr />";
  if (node.type === "bulletList") return `<ul>${children.map(renderHtmlNode).join("")}</ul>`;
  if (node.type === "orderedList") return `<ol>${children.map(renderHtmlNode).join("")}</ol>`;
  if (node.type === "taskList") return `<ul data-type="taskList">${children.map(renderHtmlNode).join("")}</ul>`;
  if (node.type === "listItem") return `<li>${children.map(renderHtmlNode).join("")}</li>`;
  if (node.type === "taskItem") {
    const checked = node.attrs?.checked === true ? " checked" : "";
    return `<li><input type="checkbox" disabled${checked} /> ${children.map(renderHtmlNode).join("")}</li>`;
  }
  return children.map(renderHtmlNode).join("");
};

const renderTextNode = (node: EditorContentNode): string => {
  if (node.type === "paragraph" || node.type === "heading" || node.type === "blockquote") return getNodeText(node).trim();
  if (node.type === "codeBlock") return getNodeText(node).trim();
  if (node.type === "bulletList" || node.type === "taskList") return (node.content ?? []).map(renderTextNode).join("\n");
  if (node.type === "orderedList") return (node.content ?? []).map((child, index) => `${index + 1}. ${renderTextNode(child)}`).join("\n");
  if (node.type === "listItem") return `- ${(node.content ?? []).map(renderTextNode).filter(Boolean).join(" ")}`;
  if (node.type === "taskItem") {
    const checked = node.attrs?.checked === true ? "x" : " ";
    return `- [${checked}] ${(node.content ?? []).map(renderTextNode).filter(Boolean).join(" ")}`;
  }
  return (node.content ?? []).map(renderTextNode).filter(Boolean).join("\n\n");
};

const getRootChildren = (contentJson: unknown) => toEditorContentNode(contentJson)?.content ?? [];

const getDocumentBodyHtml = (document: ExportableDocument) => {
  const body = getRootChildren(document.contentJson).map(renderHtmlNode).filter(Boolean).join("\n");
  const fallbackText = document.contentText?.trim();

  if (body) return body;
  if (!fallbackText) return "";

  return `<p>${escapeHtml(fallbackText).replace(/\n/g, "<br />")}</p>`;
};

export const serializeDocumentAsMarkdown = (document: ExportableDocument) => {
  const title = document.title.trim() || "无标题";
  const body = getRootChildren(document.contentJson).map(renderMarkdownNode).filter(Boolean).join("\n\n");
  return [`# ${title}`, body].filter(Boolean).join("\n\n").trim();
};

export const serializeDocumentAsHtml = (document: ExportableDocument) => {
  const title = document.title.trim() || "无标题";
  const body = getDocumentBodyHtml(document);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { max-width: 760px; margin: 48px auto; padding: 0 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.75; color: #111827; }
    h1, h2, h3 { line-height: 1.25; }
    blockquote { margin-left: 0; padding-left: 16px; border-left: 3px solid #e5e7eb; color: #4b5563; }
    code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
    pre { background: #111827; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</body>
</html>`;
};

const createPdfExportElement = (document: ExportableDocument) => {
  const title = document.title.trim() || "无标题";
  const body = getDocumentBodyHtml(document);
  const wrapper = window.document.createElement("section");

  wrapper.setAttribute("aria-hidden", "true");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.width = "794px";
  wrapper.style.padding = "64px 72px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.background = "#ffffff";
  wrapper.style.color = "#111827";
  wrapper.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
  wrapper.style.fontSize = "14px";
  wrapper.style.lineHeight = "1.75";
  wrapper.style.zIndex = "-1";

  wrapper.innerHTML = `
    <style>
      .docflow-pdf-export, .docflow-pdf-export * { box-sizing: border-box; }
      .docflow-pdf-export h1 { margin: 0 0 28px; font-size: 30px; line-height: 1.25; color: #111827; }
      .docflow-pdf-export h2 { margin: 28px 0 12px; font-size: 22px; line-height: 1.35; color: #111827; }
      .docflow-pdf-export h3 { margin: 22px 0 10px; font-size: 18px; line-height: 1.4; color: #111827; }
      .docflow-pdf-export p { margin: 0 0 12px; }
      .docflow-pdf-export ul, .docflow-pdf-export ol { margin: 0 0 12px; padding-left: 24px; }
      .docflow-pdf-export li { margin: 4px 0; }
      .docflow-pdf-export blockquote { margin: 0 0 14px; padding-left: 16px; border-left: 3px solid #e5e7eb; color: #4b5563; }
      .docflow-pdf-export code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: "SFMono-Regular", Consolas, monospace; }
      .docflow-pdf-export pre { margin: 0 0 14px; background: #111827; color: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap; word-break: break-word; }
      .docflow-pdf-export a { color: #2563eb; text-decoration: none; }
      .docflow-pdf-export hr { border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0; }
      .docflow-pdf-export input[type="checkbox"] { margin-right: 6px; }
    </style>
    <article class="docflow-pdf-export">
      <h1>${escapeHtml(title)}</h1>
      ${body}
    </article>
  `;

  return wrapper;
};

export const serializeDocumentAsText = (document: ExportableDocument) => {
  const title = document.title.trim() || "无标题";
  const body = getRootChildren(document.contentJson).map(renderTextNode).filter(Boolean).join("\n\n");
  return [title, body || document.contentText?.trim()].filter(Boolean).join("\n\n").trim();
};

export const serializeDocumentForExport = (document: ExportableDocument, format: DownloadableDocumentExportFormat) => {
  if (format === "markdown") return serializeDocumentAsMarkdown(document);
  if (format === "html") return serializeDocumentAsHtml(document);
  return serializeDocumentAsText(document);
};

const downloadDocumentAsPdf = async (document: ExportableDocument) => {
  if (typeof window === "undefined") return;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const exportElement = createPdfExportElement(document);

  window.document.body.appendChild(exportElement);

  try {
    const canvas = await html2canvas(exportElement, {
      backgroundColor: "#ffffff",
      scale: Math.min(window.devicePixelRatio || 2, 2),
      useCORS: true,
      windowWidth: exportElement.scrollWidth,
    });
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;
    const imageData = canvas.toDataURL("image/png");
    let remainingHeight = imageHeight;
    let imageTop = 0;

    pdf.addImage(imageData, "PNG", 0, imageTop, pageWidth, imageHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      imageTop = remainingHeight - imageHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, imageTop, pageWidth, imageHeight);
      remainingHeight -= pageHeight;
    }

    pdf.save(`${sanitizeFileName(document.title)}.pdf`);
  } finally {
    exportElement.remove();
  }
};

export const downloadDocumentExport = async (document: ExportableDocument, format: DocumentExportFormat) => {
  if (typeof window === "undefined") return;

  if (format === "pdf") {
    await downloadDocumentAsPdf(document);
    return;
  }

  const config = exportConfig[format];
  const content = serializeDocumentForExport(document, format);
  const blob = new Blob([content], { type: config.mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = `${sanitizeFileName(document.title)}.${config.extension}`;
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
