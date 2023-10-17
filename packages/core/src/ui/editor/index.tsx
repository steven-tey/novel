"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import { defaultEditorProps } from "./props";
import { defaultExtensions } from "./extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { defaultEditorContent } from "./default-content";
import { EditorBubbleMenu } from "./bubble-menu";
import { getPrevText } from "@/lib/editor";
import { ImageResizer } from "./extensions/image-resizer";
import { EditorProps } from "@tiptap/pm/view";
import { Editor as EditorClass, Extensions } from "@tiptap/core";
import { NovelContext } from "./provider";

// import { useContext } from "react";
// import { PdfDataContext } from '../../../../../apps/web/ui/components/pdfdatacontext';


export default function Editor({
  completionApi = "/api/generate",
  className = "novel-relative novel-min-h-[500px] novel-w-full novel-max-w-screen-lg novel-border-stone-200 novel-bg-white sm:novel-mb-[calc(20vh)] sm:novel-rounded-lg sm:novel-border sm:novel-shadow-lg",
  defaultValue = defaultEditorContent,
  pdfValue={},
  extensions = [],
  editorProps = {},
  onUpdate = () => {},
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
  storageKey = "novel__content",
  disableLocalStorage = true,
}: {
  /**
   * The API route to use for the OpenAI completion API.
   * Defaults to "/api/generate".
   */
  completionApi?: string;
  /**
   * Additional classes to add to the editor container.
   * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg".
   */
  className?: string;
  /**
   * The default value to use for the editor.
   * Defaults to defaultEditorContent.
   */
  defaultValue?: JSONContent | string;
  pdfValue?: JSONContent | string;

  /**
   * A list of extensions to use for the editor, in addition to the default Novel extensions.
   * Defaults to [].
   */
  extensions?: Extensions;
  /**
   * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
   * Defaults to {}.
   */
  editorProps?: EditorProps;
  /**
   * A callback function that is called whenever the editor is updated.
   * Defaults to () => {}.
   */
  // eslint-disable-next-line no-unused-vars
  onUpdate?: (editor?: EditorClass) => void | Promise<void>;
  /**
   * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
   * Defaults to () => {}.
   */
  // eslint-disable-next-line no-unused-vars
  onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>;
  /**
   * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
   * Defaults to 750.
   */
  debounceDuration?: number;
  /**
   * The key to use for storing the editor's value in local storage.
   * Defaults to "novel__content".
   */
  storageKey?: string;
  /**
   * Disable local storage read/save.
   * Defaults to false.
   */
  disableLocalStorage?: boolean;
}) {
  // const [content, setContent] = useLocalStorage(storageKey, defaultValue);
  // const pdfValue = useContext(PdfDataContext);
  console.log(pdfValue, 'azaz')

  const [content, setContent] = useLocalStorage(storageKey, pdfValue);

  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    onDebouncedUpdate(editor);

    if (!disableLocalStorage) {
      setContent(json);
    }
  }, debounceDuration);

  const editor = useEditor({
    extensions: [...defaultExtensions, ...extensions],
    editorProps: {
      ...defaultEditorProps,
      ...editorProps,
    },
    content: pdfValue,
    onUpdate: (e) => {
      const selection = e.editor.state.selection;
      const lastTwo = getPrevText(e.editor, {
        chars: 2,
      });
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          getPrevText(e.editor, {
            chars: 5000,
          })
        );
        // complete(e.editor.storage.markdown.getMarkdown());
        va.track("Autocomplete Shortcut Used");
      } else {
        onUpdate(e.editor);
        debouncedUpdates(e);
      }
    },
    autofocus: "end",
  });
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const temp = async () => {
    // Update the editor content when the context variable changes
    if (editor){
    await sleep(2000);
    editor.commands.setContent(pdfValue);
    console.log('pdfvalue has changed so will change editor text', pdfValue)
  }}
  temp()
}, [pdfValue, editor]);

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: completionApi,
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
      if (err.message === "You have reached your request limit for the day.") {
        va.track("Rate Limit Reached");
      }
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
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

  // Default: Hydrate the editor with the content from localStorage.
  // If disableLocalStorage is true, hydrate the editor with the defaultValue.
  useEffect(() => {
    if (!editor || hydrated) return;

    // const value = disableLocalStorage ? defaultValue : content;
    const value = disableLocalStorage ? pdfValue : content;

    if (value) {
      editor.commands.setContent(value);
      setHydrated(true);
    }
  // }, [editor, defaultValue, content, hydrated, disableLocalStorage]);
}, [editor, pdfValue, content, hydrated, disableLocalStorage]);

  return (
    <NovelContext.Provider
      value={{
        completionApi,
      }}
    >
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className={className}
      >
        {editor && <EditorBubbleMenu editor={editor} />}
        {editor?.isActive("image") && <ImageResizer editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </NovelContext.Provider>
  );
}
