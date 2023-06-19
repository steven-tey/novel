import { Editor } from "@tiptap/core";
import cx from "classnames";
import {
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
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
      canBeActive: true,
      isActive: () => editor.isActive("paragraph"),
    },
    {
      name: "Heading 1",
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      canBeActive: true,
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      canBeActive: true,
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      canBeActive: true,
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
  ];

  const activeItem = items.find((item) => item.isActive());

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 px-2 py-1 text-sm font-medium text-gray-600 hover:bg-stone-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{activeItem?.name}</span>

        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen ? (
        <section
          className={cx([
            "fixed top-full z-[99999] mt-1 flex flex-col overflow-hidden rounded border border-stone-300 bg-white shadow",
          ])}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className={cx(
                "flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-stone-100",
                {
                  "text-blue-600": item.canBeActive && item.isActive(),
                },
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};
