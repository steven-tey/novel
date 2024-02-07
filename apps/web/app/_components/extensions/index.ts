import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
} from "novel/extensions";
import { UploadImagesPlugin } from "novel/plugins";

import { Command, renderItems } from "novel/extensions";
import { querySuggestions } from "../command/suggestions";

export const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class:
      "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
  },
});

export const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin()];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-lg border border-stone-200",
  },
});

export const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: "rounded-lg border border-stone-200",
  },
});

export const taskList = TaskList.configure({
  HTMLAttributes: {
    class: "not-prose pl-2",
  },
});
export const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: "flex items-start my-4",
  },
  nested: true,
});

export const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: "mt-4 mb-6 border-t border-stone-300",
  },
});

export const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: "list-disc list-outside leading-3 -mt-2",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal list-outside leading-3 -mt-2",
    },
  },
  listItem: {
    HTMLAttributes: {
      class: "leading-normal -mb-2",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "border-l-4 border-stone-700",
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: "rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800",
    },
  },
  code: {
    HTMLAttributes: {
      class:
        "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900",
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

export const slashCommand = Command.configure({
  suggestion: {
    items: querySuggestions,
    render: renderItems,
  },
});
