import "./styles/prosemirror.css";

export { default as EditorProvider } from "./components/editor/editor-provider";
export { default as EditorBubbleItem } from "./components/bubble/editor-bubble-item";
export type { BubbleMenuItem } from "./components/bubble/editor-bubble-item";
export { default as EditorBubble } from "./components/bubble/editor-bubble";

export { default as EditorCommandList } from "./components/command/command-list";
export { createEditorSlashCommand } from "./extensions/slash-command";
export { useCurrentEditor as useEditor } from "@tiptap/react";
export type { Editor as Editor } from "@tiptap/react";
export type { DefaultExtensionsStylingOptions } from "./extensions";
