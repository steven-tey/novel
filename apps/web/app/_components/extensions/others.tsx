import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
} from "novel/extensions";
import { UploadImagesPlugin } from "novel/plugins";
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
