import { JSONContent } from '@tiptap/react';
import { EditorProps } from '@tiptap/pm/view';
import { Extensions, Editor as Editor$1 } from '@tiptap/core';

declare function Editor({ completionApi, className, defaultValue, extensions, editorProps, onInit, onUpdate, onDebouncedUpdate, debounceDuration, storageKey, disableLocalStorage, chatWithSelectionCallback, }: {
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
   * A callback function that is called whenever the editor is initialized.
   * Defaults to () => {}.
   */
    onInit?: (editor?: Editor$1) => void | Promise<void>;
    /**
     * A callback function that is called whenever the editor is updated.
     * Defaults to () => {}.
     */
    onUpdate?: (editor?: Editor$1) => void | Promise<void>;
    /**
     * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
     * Defaults to () => {}.
     */
    onDebouncedUpdate?: (editor?: Editor$1) => void | Promise<void>;
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
    /**
     * Callback to open chat with the selected text
     */
    chatWithSelectionCallback?: (selection: string) => void;
}): JSX.Element;

export { Editor };
