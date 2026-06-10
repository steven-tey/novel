export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "DocFlow AI 企业知识库示例文档" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "这是一份用于演示企业内部知识沉淀、协作编辑和 AI 辅助处理能力的文档。你可以选中文字使用 AI 助手，也可以不选中文本直接让 AI 分析整篇文档。",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "项目背景" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "随着团队文档数量增加，知识分散、版本不统一、查找成本高等问题会影响协作效率。DocFlow AI 旨在提供统一的文档编辑、知识管理和智能辅助能力。",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "核心能力" }],
    },
    {
      type: "bulletList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "富文本编辑：支持标题、列表、引用、代码块、图片和链接。" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "AI 助手：支持总结文档、提取待办、生成 FAQ、检查风险点和优化表达。" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "自动保存：编辑过程中自动保存内容，降低误操作丢失风险。" }],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "待办事项" }],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "完善文档空间、目录和多文档管理能力。" }],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "增加文档状态流转：草稿、审核中、已发布。" }],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "接入后端存储和权限体系。" }],
            },
          ],
        },
      ],
    },
  ],
};

export const emptyEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export const createEmptyEditorContent = () => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
});
