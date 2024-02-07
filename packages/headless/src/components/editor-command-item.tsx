import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from "react";
import { CommandItem } from "cmdk";
import { Editor } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import type { SuggestionItem } from "../extensions";

interface EditorCommandItemProps {
  children: ReactNode;
}

export const EditorCommandItem = forwardRef<
  HTMLDivElement,
  EditorCommandItemProps & Omit<(typeof CommandItem)["propTypes"], "ref">
>(({ children, ...rest }, ref) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <CommandItem ref={ref} {...rest}>
      {children}
    </CommandItem>
  );
});

EditorCommandItem.displayName = "EditorCommandItem";

export default EditorCommandItem;
