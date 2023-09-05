import { ComponentPropsWithoutRef, ReactNode } from "react";
import { Editor, useCurrentEditor } from "@tiptap/react";
import { Slot } from "@radix-ui/react-slot";

interface EditorBubbleItemProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  asChild?: boolean;
  command: (editor: Editor) => void;
}

export interface BubbleMenuItem {
  name: string;
  isActive: (editor: Editor) => boolean;
  command: (editor: Editor) => void;
  icon: any;
}

const EditorBubbleItem = ({
  children,
  asChild = false,
  command,
  ...props
}: EditorBubbleItemProps) => {
  const { editor } = useCurrentEditor();
  const Comp = asChild ? Slot : "button";

  if (!editor) return null;

  return (
    <Comp {...props} onClick={() => command(editor)} type='button'>
      {children}
    </Comp>
  );
};

export default EditorBubbleItem;
