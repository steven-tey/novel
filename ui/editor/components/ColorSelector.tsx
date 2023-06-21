import { Editor } from "@tiptap/core";
import cx from "classnames";
import { Check, ChevronDown } from "lucide-react";
import { FC } from "react";

export interface BubbleColorMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  color: string;
}

interface ColorSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const items: BubbleColorMenuItem[] = [
    {
      name: "Black",

      command: () => editor.chain().focus().setColor("#000000").run(),
      isActive: () => editor.isActive("textStyle", { color: "#000000" }),
      color: "#000000",
    },
    {
      name: "Purple",

      command: () => editor.chain().focus().setColor("#8F64AF").run(),
      isActive: () => editor.isActive("textStyle", { color: "#8F64AF" }),
      color: "#8F64AF",
    },
    {
      name: "Red",

      command: () => editor.chain().focus().setColor("#E00000").run(),
      isActive: () => editor.isActive("textStyle", { color: "#E00000" }),
      color: "#E00000",
    },
    {
      name: "Blue",

      command: () => editor.chain().focus().setColor("#5757FF").run(),
      isActive: () => editor.isActive("textStyle", { color: "#5757FF" }),
      color: "#5757FF",
    },
    {
      name: "Green",

      command: () => editor.chain().focus().setColor("#008A00").run(),
      isActive: () => editor.isActive("textStyle", { color: "#008A00" }),
      color: "#008A00",
    },
    {
      name: "Orange",
      command: () => editor.chain().focus().setColor("#FFA500").run(),
      isActive: () => editor.isActive("textStyle", { color: "#FFA500" }),
      color: "#FFA500",
    },
    {
      name: "Pink",

      command: () => editor.chain().focus().setColor("#BA4081").run(),
      isActive: () => editor.isActive("textStyle", { color: "#BA4081" }),
      color: "#BA4081",
    },
    {
      name: "Gray",
      command: () => editor.chain().focus().setColor("#6E6E6E").run(),
      isActive: () => editor.isActive("textStyle", { color: "#6E6E6E" }),
      color: "#6E6E6E",
    },
  ];

  const activeItem = items.find((item) => item.isActive());

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 p-2 text-sm font-medium text-gray-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: activeItem?.color || "#000000" }}>A</span>

        <ChevronDown className="h-4 w-4 " />
      </button>

      {isOpen && (
        <section className="fixed top-full z-[99999] mt-1 flex w-48 flex-col overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.command();
                setIsOpen(false);
              }}
              className={cx(
                "flex items-center justify-between rounded-sm px-2 py-1 text-sm text-gray-600 hover:bg-stone-100",
                {
                  "text-blue-600": item.isActive(),
                },
              )}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="rounded-sm border border-stone-200 p-1 "
                  style={{ color: item.color }}
                >
                  A
                </div>
                <span>{item.name}</span>
              </div>
              {item.isActive() && <Check className="h-4 w-4" />}
            </button>
          ))}
        </section>
      )}
    </div>
  );
};
