import { Editor } from '@tiptap/core';
import { MarkType } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
declare type PasteHandlerOptions = {
    editor: Editor;
    type: MarkType;
};
export declare function pasteHandler(options: PasteHandlerOptions): Plugin;
export {};
