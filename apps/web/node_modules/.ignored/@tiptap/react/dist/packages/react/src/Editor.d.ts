import { Editor as CoreEditor } from '@tiptap/core';
import React from 'react';
import { EditorContentProps, EditorContentState } from './EditorContent';
import { ReactRenderer } from './ReactRenderer';
declare type ContentComponent = React.Component<EditorContentProps, EditorContentState> & {
    setRenderer(id: string, renderer: ReactRenderer): void;
    removeRenderer(id: string): void;
};
export declare class Editor extends CoreEditor {
    contentComponent: ContentComponent | null;
}
export {};
