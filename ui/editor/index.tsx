"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";

import {
  useConnectionStatus,
  useUser,
  useConnection,
} from "./extensions/collaboration";
import { useInitialEditorState } from "./useInitialEditorState";

export default function Editor() {
  useConnection();
  const user = useUser();
  const connectionStatus = useConnectionStatus();

  const editor = useEditor({
    extensions: TiptapExtensions,
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
        e.editor.commands.insertContent("↺");
        complete(e.editor.getText());
        va.track("Autocomplete Shortcut Used");
      }
    },
    autofocus: "end",
  });

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
    // remove ↺ and insert the generated text
    if (
      completion.length > 0 &&
      editor?.state.doc.textBetween(
        editor.state.selection.from - 1,
        editor.state.selection.from,
        "\n",
      ) === "↺"
    ) {
      editor?.commands.deleteRange({
        from: editor.state.selection.from - 1,
        to: editor.state.selection.from,
      });
    }
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
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [stop, isLoading, editor, completion.length]);

  useInitialEditorState(editor);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative flex w-full max-w-screen-lg flex-col gap-2 border-stone-200 p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
    >
      <main className="min-h-[500px]">
        <EditorContent editor={editor} />
      </main>
      <footer className="bottom-8 flex flex-row items-center text-sm">
        <>
          <div
            className={
              "before:content-[' '] flex items-center gap-1.5 before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500"
            }
            data-status={connectionStatus}
          >
            {editor && connectionStatus === "connected"
              ? `${editor.storage.collaborationCursor.users.length} user${
                  editor.storage.collaborationCursor.users.length === 1
                    ? ""
                    : "s"
                } online`
              : "offline"}
          </div>
        </>
        <button
          className="ml-auto rounded-lg border border-stone-100 px-2 py-1 transition-colors hover:border-stone-400"
          onClick={user.setName}
          style={{
            opacity: user.name ? 1 : 0,
          }}
        >
          {user.name || "&nbsp;"}
        </button>
      </footer>
    </div>
  );
}
