import { Editor } from "@tiptap/core";
import {
  Check,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

import { BubbleMenuItem } from "./bubble-menu";

interface TextAlignSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const TextAlignSelector: FC<TextAlignSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const items: BubbleMenuItem[] = [
    {
      name: "Align Left",
      icon: AlignLeft,
      command: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
    },
    {
      name: "Align Center",
      icon: AlignCenter,
      command: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
    },
    {
      name: "Align Right",
      icon: AlignRight,
      command: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
    },
    {
      name: "Align Justify",
      icon: AlignJustify,
      command: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
    },
  ];

  const activeItem = items.filter((item) => item.isActive()).pop();

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          <activeItem.icon className="h-3 w-3" />
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <section className="fixed top-full z-[99999] mt-1 flex w-20 flex-col overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.command();
                setIsOpen(false);
              }}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  <item.icon className="h-3 w-3" />
                </div>
              </div>
              {activeItem && activeItem.name === item.name && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </section>
      )}
    </div>
  );
};
