export { default as EditorProvider } from "./components/editor/editor-provider";
export { default as EditorBubbleItem } from "./components/bubble/editor-bubble-item";
export type { BubbleMenuItem } from "./components/bubble/editor-bubble-item";
export { default as EditorBubble } from "./components/bubble/editor-bubble";

export { default as EditorCommandList } from "./components/command/command-list";
export type { CommandListProps } from "./components/command/command-list";

export { default as EditorCommandItem } from "./components/command/command-list-item";
export type { CommandListItemProps } from "./components/command/command-list-item";

export { createEditorSlashCommand } from "./extensions/slash-command";

export type { Editor as Editor } from "@tiptap/core";
export { default as useEditor } from "./hooks/useEditor";
export type { DefaultExtensionsStylingOptions } from "./extensions";
