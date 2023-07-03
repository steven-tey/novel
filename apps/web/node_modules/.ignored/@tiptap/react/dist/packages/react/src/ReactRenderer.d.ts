import { Editor } from '@tiptap/core';
import React from 'react';
import { Editor as ExtendedEditor } from './Editor';
export interface ReactRendererOptions {
    editor: Editor;
    props?: Record<string, any>;
    as?: string;
    className?: string;
    attrs?: Record<string, string>;
}
declare type ComponentType<R, P> = React.ComponentClass<P> | React.FunctionComponent<P> | React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>>;
export declare class ReactRenderer<R = unknown, P = unknown> {
    id: string;
    editor: ExtendedEditor;
    component: any;
    element: Element;
    props: Record<string, any>;
    reactElement: React.ReactNode;
    ref: R | null;
    constructor(component: ComponentType<R, P>, { editor, props, as, className, attrs, }: ReactRendererOptions);
    render(): void;
    updateProps(props?: Record<string, any>): void;
    destroy(): void;
}
export {};
