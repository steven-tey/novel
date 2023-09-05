import StarterKit, { StarterKitOptions } from "@tiptap/starter-kit";
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
import { InputRule } from "@tiptap/core";
import UpdatedImage from "./updated-image";
import CustomKeymap from "./custom-keymap";
import DragAndDrop from "./drag-and-drop";
import UploadImagesPlugin from "../plugins/upload-images";

export type DefaultExtensionsStylingOptions = {
  starterKit: {
    bulletList: string;
    orderedList: string;
    listItem: string;
    blockquote: string;
    codeBlock: string;
    code: string;
    dropcursor: StarterKitOptions["dropcursor"];
    gapcursor: StarterKitOptions["gapcursor"];
  };
  horizontalRule: string;
  tipTapLink: string;
  tipTapImage: string;
  updatedImage: string;
  taskList: string;
  taskItem: string;
};

// export const stylingOptionsExtensions =

export const createDefaultExensions = ({
  starterKit: {
    bulletList,
    orderedList,
    listItem,
    blockquote,
    codeBlock,
    code,
    dropcursor,
    gapcursor,
  },
  horizontalRule,
  taskItem,
  taskList,
  tipTapImage,
  tipTapLink,
  updatedImage,
}: DefaultExtensionsStylingOptions) => [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: bulletList,
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: orderedList,
      },
    },
    listItem: {
      HTMLAttributes: {
        class: listItem,
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: blockquote,
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: codeBlock,
      },
    },
    code: {
      HTMLAttributes: {
        class: code,
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: dropcursor,
    gapcursor: gapcursor,
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
      class: horizontalRule,
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class: tipTapLink,
    },
  }),
  TiptapImage.extend({
    addProseMirrorPlugins() {
      return [UploadImagesPlugin()];
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: tipTapImage,
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: updatedImage,
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
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: taskList,
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: taskItem,
    },
    nested: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
  CustomKeymap,
  DragAndDrop,
];
