"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import { defaultEditorProps } from "./props";
import { defaultExtensions } from "./extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";
import { defaultEditorContent } from "./default-content";
import { EditorBubbleMenu } from "./bubble-menu";
import { TableMenu } from "./table";
import { ImageResizer } from "./extensions/image-resizer";
import { EditorProps } from "@tiptap/pm/view";
import { Editor as EditorClass, Extensions } from "@tiptap/core";
import { NovelContext } from "./provider";

export default function Editor({
  completionApi = "/api/generate",
  className = "novel-relative novel-min-h-[500px] novel-w-full novel-max-w-screen-lg novel-border-stone-200 novel-bg-white sm:novel-mb-[calc(20vh)] sm:novel-rounded-lg sm:novel-border sm:novel-shadow-lg",
  defaultValue = defaultEditorContent,
  extensions = [],
  editorProps = {},
  onUpdate = () => {},
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
  storageKey = "novel__content",
  disableLocalStorage = false,
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
  const [content, setContent] = useLocalStorage(storageKey, defaultValue);

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
    onUpdate: (e) => {
      onUpdate(e.editor);
      debouncedUpdates(e);
    },
    autofocus: "end",
  });

  // Default: Hydrate the editor with the content from localStorage.
  // If disableLocalStorage is true, hydrate the editor with the defaultValue.
  useEffect(() => {
    if (!editor || hydrated) return;

    const value = disableLocalStorage ? defaultValue : content;

    if (value) {
      editor.commands.setContent(value);
      setHydrated(true);
    }
  }, [editor, defaultValue, content, hydrated, disableLocalStorage]);

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
        {editor?.isActive("table") && <TableMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </NovelContext.Provider>
  );
}
