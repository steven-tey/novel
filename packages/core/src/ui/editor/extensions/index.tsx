import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import SlashCommand from "./slash-command";
import { InputRule } from "@tiptap/core";
import UploadImagesPlugin from "@/ui/editor/plugins/upload-images";
import UpdatedImage from "./updated-image";
import CustomKeymap from "./custom-keymap";
import DragAndDrop from "./drag-and-drop";

export const defaultExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "novel-list-disc novel-list-outside novel-leading-3 novel--mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class:
          "novel-list-decimal novel-list-outside novel-leading-3 novel--mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "novel-leading-normal novel--mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "novel-border-l-4 novel-border-stone-700",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          "novel-rounded-sm novel-bg-stone-100 novel-p-5 novel-font-mono novel-font-medium novel-text-stone-800",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "novel-rounded-md novel-bg-stone-200 novel-px-1.5 novel-py-1 novel-font-mono novel-font-medium novel-text-stone-900",
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            let end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end)
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "novel-mt-4 novel-mb-6 novel-border-t novel-border-stone-300",
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        "novel-text-stone-400 novel-underline novel-underline-offset-[3px] hover:novel-text-stone-600 novel-transition-colors novel-cursor-pointer",
    },
  }),
  TiptapImage.extend({
    addProseMirrorPlugins() {
      return [UploadImagesPlugin()];
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "novel-rounded-lg novel-border novel-border-stone-200",
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: "novel-rounded-lg novel-border novel-border-stone-200",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands, or '++' for AI autocomplete...";
    },
    includeChildren: true,
  }),
  SlashCommand,
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "novel-not-prose novel-pl-2",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "novel-flex novel-items-start novel-my-4",
    },
    nested: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
    transformPastedText: true,
  }),
  CustomKeymap,
  DragAndDrop,
];
