import { BubbleMenuItem, EditorBubbleItem, useEditor } from "@novel/headless";
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon } from "lucide-react";
import { cn } from "../../utils";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];
  return (
    <div className='flex'>
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          command={item.command}
          className='p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200'
          type='button'>
          <item.icon
            className={cn("h-4 w-4", {
              "text-blue-500": item.isActive(editor),
            })}
          />
        </EditorBubbleItem>
      ))}
    </div>
  );
};

export default TextButtons;
