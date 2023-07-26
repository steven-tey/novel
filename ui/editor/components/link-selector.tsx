import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import {
  Check,
  Trash
} from "lucide-react";
import {
  FC,
  useEffect,
  useRef
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/ui/primitives/popover";

interface LinkSelectorProps {
  editor: Editor;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });
  
  return (
    <Popover>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
      >
        <p className="text-base">↗</p>
        <p
          className={cn("underline decoration-stone-400 underline-offset-4", {
            "text-blue-500": editor.isActive("link"),
          })}
        >
          Link
        </p>
      </PopoverTrigger>
      <PopoverContent className="w-60 flex-col">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target[0] as HTMLInputElement;
            editor.chain().focus().setLink({href: input.value}).run();
          }}
          className="flex p-1"
        >
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="flex-1 bg-white p-1 text-sm outline-none"
            defaultValue={editor.getAttributes("link").href || ""}
          />
          {editor.getAttributes("link").href ? (
            <button
              type="button"
              className="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetLink().run();
              }}
            >
              <Trash className="h-4 w-4"/>
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
            >
              <Check className="h-4 w-4"/>
            </button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};
