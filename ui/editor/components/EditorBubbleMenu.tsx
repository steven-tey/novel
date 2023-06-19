import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import cx from "classnames";
import { FC, useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";

import { NodeSelector } from "./NodeSelector";

export interface BubbleMenuItem {
  name: string;
  canBeActive: boolean;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      canBeActive: true,
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      canBeActive: true,
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      canBeActive: true,
      isActive: () => props.editor.isActive("underline"),
      command: () => props.editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      canBeActive: true,
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      canBeActive: true,
      isActive: () => props.editor.isActive("code"),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    tippyOptions: {
      moveTransition: "transform 0.2s ease-out",
      onHidden: () => setIsNodeSelectorOpen(false),
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex overflow-hidden rounded border border-stone-200 bg-white shadow-xl"
    >
      <NodeSelector
        editor={props.editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={setIsNodeSelectorOpen}
      />

      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.command}
          className="p-2 text-gray-600 hover:bg-stone-100 active:bg-stone-200"
        >
          <item.icon
            className={cx("h-4 w-4", {
              "text-blue-500": item.canBeActive && item.isActive(),
            })}
          />
        </button>
      ))}
    </BubbleMenu>
  );
};
