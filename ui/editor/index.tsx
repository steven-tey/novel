"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";

export default function Editor() {
  const [content, setContent] = useLocalStorage("content", {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Introducing Novel" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with ",
          },
          {
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "https://tiptap.dev/",
                  target: "_blank",
                  class:
                    "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                },
              },
            ],
            text: "Tiptap",
          },
          { type: "text", text: ", " },
          {
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "https://openai.com/",
                  target: "_blank",
                  class:
                    "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                },
              },
            ],
            text: "OpenAI",
          },
          { type: "text", text: ", and the " },
          {
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "https://sdk.vercel.ai/docs",
                  target: "_blank",
                  class:
                    "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                },
              },
            ],
            text: "Vercel AI SDK",
          },
          { type: "text", text: " → " },
          { type: "text", marks: [{ type: "code" }], text: "npm i ai" },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Learn more" }],
      },
      {
        type: "orderedList",
        attrs: { start: 1 },
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Check out the " },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "link",
                        attrs: {
                          href: "https://twitter.com/steventey/status/1669762868416512000",
                          target: "_blank",
                          class:
                            "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                        },
                      },
                    ],
                    text: "launch video",
                  },
                  { type: "text", text: "." },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Star us on " },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "link",
                        attrs: {
                          href: "https://github.com/steven-tey/novel",
                          target: "_blank",
                          class:
                            "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                        },
                      },
                    ],
                    text: "GitHub",
                  },
                  { type: "text", text: "." },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [
                      {
                        type: "link",
                        attrs: {
                          href: "https://vercel.com/templates/next.js/novel",
                          target: "_blank",
                          class:
                            "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                        },
                      },
                    ],
                    text: "Deploy",
                  },
                  { type: "text", text: " your own." },
                ],
              },
            ],
          },
        ],
      },
      { type: "paragraph" },
    ],
  });
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

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        va.track("Rate Limit Reached");
        return;
      }
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      const selection = e.editor.state.selection;
      const lastTwo = e.editor.state.doc.textBetween(
        selection.from - 2,
        selection.from,
        "\n",
      );
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(e.editor.getText());
        va.track("Autocomplete Shortcut Used");
      } else {
        debouncedUpdates(e);
      }
    },
    autofocus: "end",
  });

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [stop, isLoading, editor, completion.length]);

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
    >
      <div className="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
