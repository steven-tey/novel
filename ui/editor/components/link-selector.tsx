import { Editor } from "@tiptap/core";
import { Link, Trash } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current && inputRef.current?.focus()
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      editor.chain().focus().setLink({ href: e.target.value }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
  }

  return (
    <div className="relative">
      <button
        className="flex h-full items-center gap-1 p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <Link className="h-4 w-4" />
      </button>
      {isOpen && (
        <section className="fixed top-full z-[99999] mt-1 flex max-w-[12rem] overflow-hidden rounded border border-stone-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="URL"
            className="outline-none overflow-hidden"
            value={editor.getAttributes("link").href || ""}
            onChange={handleInputChange}
          />
          {editor.getAttributes("link").href && (
            <button
              className="flex items-center ml-2 text-red-600 transition-all hover:text-red-500"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </section>
      )}
    </div>
  );
};
