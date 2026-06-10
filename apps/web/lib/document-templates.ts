import { createEmptyEditorContent } from "@/lib/content";

export type DocumentTemplate = {
  id: string;
  name: string;
  description: string;
  contentJson: any;
  contentText: string;
};

const template = (id: string, name: string, description: string, contentJson: any, contentText: string): DocumentTemplate => ({
  id,
  name,
  description,
  contentJson,
  contentText,
});

export const documentTemplates: DocumentTemplate[] = [
  template("blank", "空白文档", "从一个完全空白的页面开始。", createEmptyEditorContent(), ""),
  template(
    "meeting",
    "会议纪要",
    "记录参会人、议题、结论和待办事项。",
    {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "会议纪要" }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "会议信息" }] },
        { type: "paragraph", content: [{ type: "text", text: "时间：" }] },
        { type: "paragraph", content: [{ type: "text", text: "参会人：" }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "会议结论" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "待办事项" }] },
        { type: "taskList", content: [{ type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph" }] }] },
      ],
    },
    "会议纪要 会议信息 时间： 参会人： 会议结论 待办事项",
  ),
  template(
    "prd",
    "PRD 产品需求",
    "描述背景、目标、用户故事、功能范围和验收标准。",
    {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "PRD 产品需求文档" }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "需求背景" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "目标用户" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "功能范围" }] },
        { type: "bulletList", attrs: { tight: true }, content: [{ type: "listItem", content: [{ type: "paragraph" }] }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "验收标准" }] },
        { type: "taskList", content: [{ type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph" }] }] },
      ],
    },
    "PRD 产品需求文档 需求背景 目标用户 功能范围 验收标准",
  ),
  template(
    "tech-plan",
    "技术方案",
    "沉淀架构设计、接口方案、风险和上线计划。",
    {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "技术方案" }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "背景与目标" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "整体设计" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "接口与数据结构" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "风险与应对" }] },
        { type: "paragraph" },
      ],
    },
    "技术方案 背景与目标 整体设计 接口与数据结构 风险与应对",
  ),
  template(
    "retro",
    "项目复盘",
    "复盘项目结果、经验、问题和后续改进。",
    {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "项目复盘" }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "项目目标" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "结果回顾" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "做得好的地方" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "需要改进的问题" }] },
        { type: "paragraph" },
      ],
    },
    "项目复盘 项目目标 结果回顾 做得好的地方 需要改进的问题",
  ),
];

export const cloneTemplateContent = (contentJson: any) => JSON.parse(JSON.stringify(contentJson));

const getNodeText = (node: any): string => {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (!Array.isArray(node.content)) return "";
  return node.content.map((child) => getNodeText(child)).join("");
};

export const getTemplateDraftTitle = (documentTemplate: DocumentTemplate) => {
  if (documentTemplate.id === "blank") return "";

  const firstNode = documentTemplate.contentJson?.content?.[0];
  if (firstNode?.type !== "heading") return documentTemplate.name;

  return getNodeText(firstNode).trim() || documentTemplate.name;
};

export const getTemplateBodyContent = (documentTemplate: DocumentTemplate) => {
  const nextContent = cloneTemplateContent(documentTemplate.contentJson);
  if (documentTemplate.id === "blank") return nextContent;

  if (nextContent?.content?.[0]?.type === "heading") {
    const bodyContent = nextContent.content.slice(1);
    return {
      ...nextContent,
      content: bodyContent.length ? bodyContent : [{ type: "paragraph" }],
    };
  }

  return nextContent;
};

export const getTemplateBodyText = (documentTemplate: DocumentTemplate) => {
  const title = getTemplateDraftTitle(documentTemplate);
  const contentText = documentTemplate.contentText.trim();
  if (!title || !contentText.startsWith(title)) return contentText;

  return contentText.slice(title.length).trim();
};

export const getDocumentTemplate = (templateId: string) =>
  documentTemplates.find((item) => item.id === templateId) ?? documentTemplates[0];
