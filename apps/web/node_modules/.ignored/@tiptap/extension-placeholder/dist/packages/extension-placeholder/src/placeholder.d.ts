import { Editor, Extension } from '@tiptap/core';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
export interface PlaceholderOptions {
    emptyEditorClass: string;
    emptyNodeClass: string;
    placeholder: ((PlaceholderProps: {
        editor: Editor;
        node: ProsemirrorNode;
        pos: number;
        hasAnchor: boolean;
    }) => string) | string;
    showOnlyWhenEditable: boolean;
    showOnlyCurrent: boolean;
    includeChildren: boolean;
}
export declare const Placeholder: Extension<PlaceholderOptions, any>;
