import { BubbleMenuProps, BubbleMenu as Menu } from "@tiptap/react";
import useEditor from "../../hooks/useEditor";

type Props = {
  onHidden: () => void;
} & BubbleMenuProps;

const BubbleMenu = ({ children, onHidden, ...props }: Props) => {
  const { editor } = useEditor();

  if (!editor) return null;

  const bubbleMenuProps: Omit<BubbleMenuProps, "children"> = {
    editor,
    shouldShow: ({ editor }) => {
      // don't show if image is selected
      if (editor.isActive("image")) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
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
