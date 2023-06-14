"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";

export default function Editor() {
  const [content, setContent] = useLocalStorage("content", []);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setSaveStatus("Saving...");
    setContent(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 500);
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      debouncedUpdates(e);
    },
  });

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-gray-200 p-12 sm:rounded-lg sm:border sm:shadow-lg">
      <div className="absolute right-5 top-5 mb-5 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-400">
        {saveStatus}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
