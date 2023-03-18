"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@/lib/tiptap/placeholder";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";

export default function Editor() {
  const [content, setContent] = useLocalStorage("content", []);
  const [contentDraft, setContentDraft] = useLocalStorage("content-draft", []);
  const draftStatus = useMemo(
    () => (content && contentDraft === content ? "Published" : "Draft"),
    [content, contentDraft]
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [hydrated, setHydrated] = useState(false);

  const [autocomplete, setAutocomplete] = useState("");

  const predict = async (content: string) => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAutocomplete((prev) => prev + chunkValue);
    }
    console.log(autocomplete);
  };

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    setAutocomplete("");
    const [json, text] = [editor.getJSON(), editor.getText()];
    await predict(text);
    setSaveStatus("Saving...");
    setContentDraft(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 200);
  }, 500);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside leading-relaxed",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside leading-3",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 pl-4",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "rounded-md bg-gray-200 p-5 font-mono font-medium text-gray-800",
          },
        },
        code: {
          HTMLAttributes: {
            class:
              "rounded-md bg-gray-200 px-1.5 py-1 font-mono font-medium text-rose-500",
          },
        },
      }),
      TiptapLink.configure({
        HTMLAttributes: {
          class:
            "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
        },
      }),
      Placeholder.configure({
        autocomplete,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose-lg prose-headings:font-vercel font-default focus:outline-none",
      },
    },
    onUpdate: debouncedUpdates,
  });

  useEffect(() => {
    if (editor && contentDraft && !hydrated) {
      editor.commands.setContent(contentDraft);
      setHydrated(true);
    }
  }, [editor, contentDraft, hydrated]);

  return (
    <>
      <div className="rounded-lg bg-gray-100 px-2 py-1 text-gray-400 text-sm mb-5">
        {saveStatus}
      </div>
      <div className="max-w-screen-lg w-full border-2 border-gray-600 rounded-lg min-h-[500px] p-10">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
