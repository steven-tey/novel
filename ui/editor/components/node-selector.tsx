import { Editor } from "@tiptap/core";
import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  TextIcon,
  TextQuote,
} from "lucide-react";
import {
  Dispatch,
  FC,
  SetStateAction
} from "react";

import { BubbleMenuItem } from "./EditorBubbleMenu";
import { Button } from "@/components/ui/button";

interface NodeSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
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
      // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
      isActive: () =>
        editor.isActive("paragraph") &&
        !editor.isActive("bulletList") &&
        !editor.isActive("orderedList"),
    },
    {
      name: "Heading 1",
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({level: 1}).run(),
      isActive: () => editor.isActive("heading", {level: 1}),
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({level: 2}).run(),
      isActive: () => editor.isActive("heading", {level: 2}),
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({level: 3}).run(),
      isActive: () => editor.isActive("heading", {level: 3}),
    },
    {
      name: "To-do List",
      icon: CheckSquare,
      command: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskItem"),
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
    {
      name: "Quote",
      icon: TextQuote,
      command: () =>
        editor
          .chain()
          .focus()
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      name: "Code",
      icon: Code,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
  ];
  
  const activeItem = items.filter((item) => item.isActive()).pop() ?? {
    name: "Multiple",
  };
  
  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium  hover:bg-muted active:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{activeItem?.name}</span>
        <ChevronDown className="h-4 w-4"/>
      </button>
      
      {isOpen && (
        <section className="fixed top-full z-[99999] mt-1 flex w-48 flex-col overflow-hidden rounded border gap-1 bg-background p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          {items.map((item, index) => (
            <Button
              variant="ghost"
              size="sm"
              key={index}
              onClick={() => {
                item.command();
                setIsOpen(false);
              }}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-muted"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border p-1">
                  <item.icon className="h-3 w-3"/>
                </div>
                <span>{item.name}</span>
              </div>
              {activeItem.name === item.name && <Check className="h-4 w-4"/>}
            </Button>
          ))}
        </section>
      )}
    </div>
  );
};
