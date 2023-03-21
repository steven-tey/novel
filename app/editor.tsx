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
    [content, contentDraft],
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
  };

  const handleUpdateSideEffects = useDebouncedCallback(async ({ editor }) => {
    const [json, text] = [editor.getJSON(), editor.getText()];
    if (text.length > 10) await predict(text); // only predict if the text is long enough
    setSaveStatus("Saving...");
    setContentDraft(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 200);
  }, 1000);

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
    onUpdate: (e) => {
      setAutocomplete("");
      setSaveStatus("Unsaved");
      handleUpdateSideEffects(e);
    },
  });

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && contentDraft && !hydrated) {
      editor.commands.setContent(contentDraft);
      setHydrated(true);
    }
  }, [editor, contentDraft, hydrated]);

  // dispatch a transaction to update the placeholder extension when the autocomplete text changes
  useEffect(() => {
    if (editor) {
      editor.extensionManager.extensions.filter(
        (extension) => extension.name === "placeholder",
      )[0].options["autocomplete"] = autocomplete;
      editor.view.dispatch(editor.state.tr);
    }
  }, [editor, autocomplete]);

  return (
    <>
      <div className="relative min-h-[500px] w-full max-w-screen-lg border border-gray-200 p-10 shadow-lg sm:rounded-lg">
        <div className="absolute top-5 right-5 mb-5 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-400">
          {saveStatus}
        </div>
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
