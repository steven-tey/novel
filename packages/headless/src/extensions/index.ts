import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { InputRule } from "@tiptap/core";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import UpdatedImage from "./updated-image";
import CustomKeymap from "./custom-keymap";
import { ImageResizer } from "./image-resizer";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner";

const PlaceholderExtension = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`;
    }
    return "Press '/' for commands";
  },
  includeChildren: true,
});

const simpleExtensions = [
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),

  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
  CustomKeymap,
  GlobalDragHandle.configure({
    scrollTreshold: 0,
  }),
  AutoJoiner,
] as const;

const Horizontal = HorizontalRule.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/u,
        handler: ({ state, range }) => {
          const attributes = {};

          const { tr } = state;
          const start = range.from;
          let end = range.to;

          tr.insert(start - 1, this.type.create(attributes)).delete(
            tr.mapping.map(start),
            tr.mapping.map(end),
          );
        },
      }),
    ];
  },
});

export {
  PlaceholderExtension as Placeholder,
  simpleExtensions,
  StarterKit,
  Horizontal as HorizontalRule,
  TiptapLink,
  TiptapImage,
  UpdatedImage,
  TaskItem,
  TaskList,
  InputRule,
  ImageResizer,
};
export * from "./ai-highlight";
export * from "./slash-command";

// Todo: Maybe I should create an utils entry
export { getPrevText } from "../utils/utils";
