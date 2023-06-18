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
      animation: "shift-toward-subtle",
      onHidden: () => setIsNodeSelectorOpen(false),
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);

  return (
    <BubbleMenu {...bubbleMenuProps}>
      <div className="flex overflow-hidden bg-white border rounded shadow border-slate-300">
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
            <item.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </BubbleMenu>
  );
};
