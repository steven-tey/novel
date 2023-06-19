import { Editor } from "@tiptap/core";
import cx from "classnames";
import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  TextIcon,
} from "lucide-react";
import { FC } from "react";

import { BubbleMenuItem } from "./EditorBubbleMenu";

interface NodeSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const NodeSelector: FC<NodeSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const items: BubbleMenuItem[] = [
    {
      name: "Text",
      icon: TextIcon,
      command: () =>
        editor.chain().focus().toggleNode("paragraph", "paragraph").run(),
      // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
      isActive: () =>
        editor.isActive("paragraph") &&
        !editor.isActive("bulletList") &&
        !editor.isActive("orderedList"),
    },
    {
      name: "Heading 1",
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      name: "Bullet List",
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      name: "Numbered List",
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
  ];

  const activeItem = items.find((item) => item.isActive());

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 p-2 text-sm font-medium text-gray-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{activeItem?.name}</span>

        <ChevronDown className="h-4 w-4" />
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
                <div className="rounded-sm border border-stone-200 p-1">
                  <item.icon className="h-3 w-3" />
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
