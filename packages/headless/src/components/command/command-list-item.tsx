import { ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import useEditor from "../../hooks/useEditor";

export interface CommandListItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  active: boolean;
  isLoading: boolean;
  className: string;
  onSelect: () => void;
  asChild?: boolean;
  children?: ReactNode;
}

const CommandListItem = ({
  children,
  asChild = false,
  onSelect,
  ...props
}: CommandListItemProps) => {
  const { editor } = useEditor();
  const Comp = asChild ? Slot : "button";

  if (!editor) return null;

  return (
    <Comp {...props} onClick={onSelect} type='button'>
      {children}
    </Comp>
  );
};

export default CommandListItem;
