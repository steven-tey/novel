import { NodeViewRenderer, NodeViewRendererOptions } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Decoration } from '@tiptap/pm/view';
export interface ReactNodeViewRendererOptions extends NodeViewRendererOptions {
    update: ((props: {
        oldNode: ProseMirrorNode;
        oldDecorations: Decoration[];
        newNode: ProseMirrorNode;
        newDecorations: Decoration[];
        updateProps: () => void;
    }) => boolean) | null;
    as?: string;
    className?: string;
    attrs?: Record<string, string>;
}
export declare function ReactNodeViewRenderer(component: any, options?: Partial<ReactNodeViewRendererOptions>): NodeViewRenderer;
