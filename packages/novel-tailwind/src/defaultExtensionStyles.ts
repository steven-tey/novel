import { DefaultExtensionsStylingOptions } from "@novel/headless";

export const defaultExtensionsStylingOptions: DefaultExtensionsStylingOptions = {
  starterKit: {
    bulletList: "list-disc list-outside leading-3 -mt-2",
    orderedList: "list-decimal list-outside leading-3 -mt-2",
    listItem: "leading-normal -mb-2",
    blockquote: "border-l-4 border-stone-700",
    codeBlock: "rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800",
    code: "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900",
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  },
  horizontalRule: "mt-4 mb-6 border-t border-stone-300",
  tipTapLink:
    "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
  tipTapImage: "rounded-lg border border-stone-200",
  updatedImage: "rounded-lg border border-stone-200",
  taskList: "not-prose pl-2",
  taskItem: "flex items-start my-4",
};
