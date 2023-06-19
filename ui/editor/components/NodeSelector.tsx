import { Editor } from "@tiptap/core";
import cx from "classnames";
import { ChevronDown, Heading1Icon, Heading2Icon, TextIcon } from "lucide-react";
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
      icon: Heading1Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      canBeActive: true,
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: Heading2Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      canBeActive: true,
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
  ];

  const activeItem = items.find((item) => item.isActive());

  return (
    <div className="relative h-full">
      <button
        className={cx([
          "flex h-full items-center gap-1 px-2 py-1 text-gray-600",
          isOpen ? "bg-slate-200" : "bg-transparent hover:bg-slate-100",
        ])}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{activeItem?.name}</span>

        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen ? (
        <section
          className={cx([
            "fixed top-full z-[99999] mt-1 flex flex-col overflow-hidden rounded border border-slate-300 bg-white shadow",
          ])}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className={cx([
                item.canBeActive && item.isActive()
                  ? "bg-slate-200"
                  : "hover:bg-slate-100",
                "flex items-center gap-2 px-3 py-1 text-gray-600",
              ])}
            >
              <item.icon className='w-4 h-4' />

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
