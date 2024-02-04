import { BubbleMenu, BubbleMenuProps, isNodeSelection, useCurrentEditor } from "@tiptap/react";
import React, { ReactNode, useMemo } from "react";
export interface EditorBubbleProps extends Omit<BubbleMenuProps, "editor"> {
  children: ReactNode;
}

export const EditorBubble = ({ children, tippyOptions, ...rest }: EditorBubbleProps) => {
  const { editor } = useCurrentEditor();

  const bubbleMenuProps: Omit<BubbleMenuProps, "children"> = useMemo(() => {
    const shouldShow: BubbleMenuProps["shouldShow"] = ({ editor, state }) => {
      const { selection } = state;
      const { empty } = selection;

      // don't show bubble menu if:
      // - the selected node is an image
      // - the selection is empty
      // - the selection is a node selection (for drag handles)
      if (editor.isActive("image") || empty || isNodeSelection(selection)) {
        return false;
      }
      return true;
    };

    return {
      shouldShow,
      tippyOptions: {
        moveTransition: "transform 0.15s ease-out",
        ...tippyOptions,
      },
      ...rest,
    };
  }, [rest, tippyOptions]);

  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} {...bubbleMenuProps}>
      {children}
    </BubbleMenu>
  );
};

export default EditorBubble;
