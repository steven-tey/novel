import { BubbleMenuProps, BubbleMenu as Menu, isNodeSelection } from "@tiptap/react";
import useEditor from "../../hooks/useEditor";

type Props = {
  onHidden: () => void;
} & BubbleMenuProps;

const BubbleMenu = ({ children, onHidden, ...props }: Props) => {
  const { editor } = useEditor();

  if (!editor) return null;

  const bubbleMenuProps: Omit<BubbleMenuProps, "children"> = {
    editor,
    shouldShow: ({ editor, state }) => {
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
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden,
    },
  };

  return (
    <Menu {...props} {...bubbleMenuProps}>
      {children}
    </Menu>
  );
};

export default BubbleMenu;
