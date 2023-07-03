import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeView as ProseMirrorNodeView } from '@tiptap/pm/view';
import { Editor as CoreEditor } from './Editor';
import { Node } from './Node';
import { DecorationWithType, NodeViewRendererOptions, NodeViewRendererProps } from './types';
export declare class NodeView<Component, NodeEditor extends CoreEditor = CoreEditor, Options extends NodeViewRendererOptions = NodeViewRendererOptions> implements ProseMirrorNodeView {
    component: Component;
    editor: NodeEditor;
    options: Options;
    extension: Node;
    node: ProseMirrorNode;
    decorations: DecorationWithType[];
    getPos: any;
    isDragging: boolean;
    constructor(component: Component, props: NodeViewRendererProps, options?: Partial<Options>);
    mount(): void;
    get dom(): HTMLElement;
    get contentDOM(): HTMLElement | null;
    onDragStart(event: DragEvent): void;
    stopEvent(event: Event): boolean;
    ignoreMutation(mutation: MutationRecord | {
        type: 'selection';
        target: Element;
    }): boolean;
    updateAttributes(attributes: {}): void;
    deleteNode(): void;
}
