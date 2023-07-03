import { Editor, Range } from '@tiptap/core';
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
export interface SuggestionOptions<I = any> {
    pluginKey?: PluginKey;
    editor: Editor;
    char?: string;
    allowSpaces?: boolean;
    allowedPrefixes?: string[] | null;
    startOfLine?: boolean;
    decorationTag?: string;
    decorationClass?: string;
    command?: (props: {
        editor: Editor;
        range: Range;
        props: I;
    }) => void;
    items?: (props: {
        query: string;
        editor: Editor;
    }) => I[] | Promise<I[]>;
    render?: () => {
        onBeforeStart?: (props: SuggestionProps<I>) => void;
        onStart?: (props: SuggestionProps<I>) => void;
        onBeforeUpdate?: (props: SuggestionProps<I>) => void;
        onUpdate?: (props: SuggestionProps<I>) => void;
        onExit?: (props: SuggestionProps<I>) => void;
        onKeyDown?: (props: SuggestionKeyDownProps) => boolean;
    };
    allow?: (props: {
        editor: Editor;
        state: EditorState;
        range: Range;
    }) => boolean;
}
export interface SuggestionProps<I = any> {
    editor: Editor;
    range: Range;
    query: string;
    text: string;
    items: I[];
    command: (props: I) => void;
    decorationNode: Element | null;
    clientRect?: (() => DOMRect | null) | null;
}
export interface SuggestionKeyDownProps {
    view: EditorView;
    event: KeyboardEvent;
    range: Range;
}
export declare const SuggestionPluginKey: PluginKey<any>;
export declare function Suggestion<I = any>({ pluginKey, editor, char, allowSpaces, allowedPrefixes, startOfLine, decorationTag, decorationClass, command, items, render, allow, }: SuggestionOptions<I>): Plugin<any>;
