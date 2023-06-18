import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import cx from "classnames";
import { FC, useState } from "react";

import {
  RiBold,
  RiCodeSSlashFill,
  RiItalic,
  RiStrikethrough,
  RiUnderline,
} from "../icons";

import { NodeSelector } from "./NodeSelector";

export interface BubbleMenuItem {
  name: string;
  canBeActive: boolean;
  isActive: () => boolean;
  command: () => void;
  icon: typeof RiBold;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      canBeActive: true,
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: RiBold,
    },
    {
      name: "italic",
      canBeActive: true,
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: RiItalic,
    },
    {
      name: "underline",
      canBeActive: true,
      isActive: () => props.editor.isActive("underline"),
      command: () => props.editor.chain().focus().toggleUnderline().run(),
      icon: RiUnderline,
    },
    {
      name: "strike",
      canBeActive: true,
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: RiStrikethrough,
    },
    {
      name: "code",
      canBeActive: true,
      isActive: () => props.editor.isActive("code"),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: RiCodeSSlashFill,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    tippyOptions: {
      moveTransition: "transform 0.2s ease-out",
      animation: "shift-toward-subtle",
      onHidden: () => setIsNodeSelectorOpen(false),
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);

  return (
    <BubbleMenu {...bubbleMenuProps}>
      <div className="flex overflow-hidden rounded border border-slate-300 bg-white shadow">
        <NodeSelector
          editor={props.editor}
          isOpen={isNodeSelectorOpen}
          setIsOpen={setIsNodeSelectorOpen}
        />

        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.command}
            className={cx([
              item.canBeActive && item.isActive()
                ? "bg-slate-200"
                : "hover:bg-slate-100",
              "p-1 text-gray-600",
            ])}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </BubbleMenu>
  );
};
