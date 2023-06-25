"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { useTiptapExtensions } from "./extensions";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";

import { EditorBubbleMenu } from "./components";
import { useInitialEditorState } from "./useInitialEditorState";

export default function Editor() {
  const tiptapExtensions = useTiptapExtensions();
  const editor = useEditor(
    {
      extensions: tiptapExtensions,
      editorProps: TiptapEditorProps,
      onUpdate: (e) => {
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
        }
      },
      autofocus: "end",
    },
    [tiptapExtensions],
  );

  useInitialEditorState(editor);

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
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff, {
      parseOptions: {
        preserveWhitespace: "full",
      },
    });
  }, [isLoading, editor, completion]);

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
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(editor?.getText() || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative flex w-full max-w-screen-lg flex-1 flex-col gap-2 border-stone-200 p-12 px-8 sm:flex-initial sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
    >
      <main className="min-h-[500px]">
        {editor && (
          <>
            <EditorContent editor={editor} />
            <EditorBubbleMenu editor={editor} />
          </>
        )}
      </main>
    </div>
  );
}
