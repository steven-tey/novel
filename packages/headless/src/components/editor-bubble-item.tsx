import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useCurrentEditor, type Editor } from "@tiptap/react";

interface EditorBubbleItemProps {
  children: ReactNode;
  asChild?: boolean;
  onSelect?: (editor: Editor) => void;
}

export const EditorBubbleItem = forwardRef<
  HTMLDivElement,
  EditorBubbleItemProps & Omit<ComponentPropsWithoutRef<"div">, "onSelect">
>(({ children, asChild, onSelect, ...rest }, ref) => {
  const { editor } = useCurrentEditor();
  const Comp = asChild ? Slot : "div";

  if (!editor) return null;

  return (
    <Comp ref={ref} {...rest} onClick={() => onSelect?.(editor)}>
      {children}
    </Comp>
  );
});

EditorBubbleItem.displayName = "EditorBubbleItem";

export default EditorBubbleItem;
