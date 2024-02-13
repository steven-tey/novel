import { BubbleMenu, type BubbleMenuProps, isNodeSelection, useCurrentEditor } from "@tiptap/react";
import { type ReactNode, useMemo, useRef, useEffect, forwardRef } from "react";
import type { Instance, Props } from "tippy.js";

export interface EditorBubbleProps extends Omit<BubbleMenuProps, "editor"> {
  children: ReactNode;
}

export const EditorBubble = forwardRef<HTMLDivElement, EditorBubbleProps>(
  ({ children, tippyOptions, ...rest }, ref) => {
    const { editor } = useCurrentEditor();
    const instanceRef = useRef<Instance<Props> | null>(null);

    useEffect(() => {
      if (!instanceRef.current || !tippyOptions?.placement) return;

      instanceRef.current.setProps({ placement: tippyOptions.placement });
      instanceRef.current.popperInstance?.update();
    }, [tippyOptions?.placement]);

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
          onCreate: (val) => {
            instanceRef.current = val;
          },
          moveTransition: "transform 0.15s ease-out",
          ...tippyOptions,
        },
        ...rest,
      };
    }, [rest, tippyOptions]);

    if (!editor) return null;

    return (
      //We need to add this because of https://github.com/ueberdosis/tiptap/issues/2658
      <div ref={ref}>
        <BubbleMenu editor={editor} {...bubbleMenuProps}>
          {children}
        </BubbleMenu>
      </div>
    );
  }
);

export default EditorBubble;
