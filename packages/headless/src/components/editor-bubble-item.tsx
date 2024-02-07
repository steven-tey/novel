import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Editor } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";

interface EditorBubbleItemProps {
  children: ReactNode;
  asChild?: boolean;
  onSelect?: (editor: Editor) => void;
}

export const EditorBubbleItem = forwardRef<
  HTMLButtonElement,
  EditorBubbleItemProps & ComponentPropsWithoutRef<"button">
>(({ children, asChild, onSelect, ...rest }, ref) => {
  const { editor } = useCurrentEditor();
  const Comp = asChild ? Slot : "button";

  if (!editor) return null;

  return (
    <Comp ref={ref} type='button' {...rest} onClick={() => onSelect?.(editor)}>
      {children}
    </Comp>
  );
});

EditorBubbleItem.displayName = "EditorBubbleItem";

export default EditorBubbleItem;
