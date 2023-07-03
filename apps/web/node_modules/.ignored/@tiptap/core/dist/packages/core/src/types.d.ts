import { Mark as ProseMirrorMark, Node as ProseMirrorNode, NodeType, ParseOptions } from '@tiptap/pm/model';
import { EditorState, Transaction } from '@tiptap/pm/state';
import { Decoration, EditorProps, EditorView, NodeView } from '@tiptap/pm/view';
import { Commands, ExtensionConfig, MarkConfig, NodeConfig } from '.';
import { Editor } from './Editor';
import { Extension } from './Extension';
import { Mark } from './Mark';
import { Node } from './Node';
export declare type AnyConfig = ExtensionConfig | NodeConfig | MarkConfig;
export declare type AnyExtension = Extension | Node | Mark;
export declare type Extensions = AnyExtension[];
export declare type ParentConfig<T> = Partial<{
    [P in keyof T]: Required<T>[P] extends (...args: any) => any ? (...args: Parameters<Required<T>[P]>) => ReturnType<Required<T>[P]> : T[P];
}>;
export declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
export declare type RemoveThis<T> = T extends (...args: any) => any ? (...args: Parameters<T>) => ReturnType<T> : T;
export declare type MaybeReturnType<T> = T extends (...args: any) => any ? ReturnType<T> : T;
export declare type MaybeThisParameterType<T> = Exclude<T, Primitive> extends (...args: any) => any ? ThisParameterType<Exclude<T, Primitive>> : any;
export interface EditorEvents {
    beforeCreate: {
        editor: Editor;
    };
    create: {
        editor: Editor;
    };
    update: {
        editor: Editor;
        transaction: Transaction;
    };
    selectionUpdate: {
        editor: Editor;
        transaction: Transaction;
    };
    transaction: {
        editor: Editor;
        transaction: Transaction;
    };
    focus: {
        editor: Editor;
        event: FocusEvent;
        transaction: Transaction;
    };
    blur: {
        editor: Editor;
        event: FocusEvent;
        transaction: Transaction;
    };
    destroy: void;
}
export declare type EnableRules = (AnyExtension | string)[] | boolean;
export interface EditorOptions {
    element: Element;
    content: Content;
    extensions: Extensions;
    injectCSS: boolean;
    injectNonce: string | undefined;
    autofocus: FocusPosition;
    editable: boolean;
    editorProps: EditorProps;
    parseOptions: ParseOptions;
    enableInputRules: EnableRules;
    enablePasteRules: EnableRules;
    enableCoreExtensions: boolean;
    onBeforeCreate: (props: EditorEvents['beforeCreate']) => void;
    onCreate: (props: EditorEvents['create']) => void;
    onUpdate: (props: EditorEvents['update']) => void;
    onSelectionUpdate: (props: EditorEvents['selectionUpdate']) => void;
    onTransaction: (props: EditorEvents['transaction']) => void;
    onFocus: (props: EditorEvents['focus']) => void;
    onBlur: (props: EditorEvents['blur']) => void;
    onDestroy: (props: EditorEvents['destroy']) => void;
}
export declare type HTMLContent = string;
export declare type JSONContent = {
    type?: string;
    attrs?: Record<string, any>;
    content?: JSONContent[];
    marks?: {
        type: string;
        attrs?: Record<string, any>;
        [key: string]: any;
    }[];
    text?: string;
    [key: string]: any;
};
export declare type Content = HTMLContent | JSONContent | JSONContent[] | null;
export declare type CommandProps = {
    editor: Editor;
    tr: Transaction;
    commands: SingleCommands;
    can: () => CanCommands;
    chain: () => ChainedCommands;
    state: EditorState;
    view: EditorView;
    dispatch: ((args?: any) => any) | undefined;
};
export declare type Command = (props: CommandProps) => boolean;
export declare type CommandSpec = (...args: any[]) => Command;
export declare type KeyboardShortcutCommand = (props: {
    editor: Editor;
}) => boolean;
export declare type Attribute = {
    default: any;
    rendered?: boolean;
    renderHTML?: ((attributes: Record<string, any>) => Record<string, any> | null) | null;
    parseHTML?: ((element: HTMLElement) => any | null) | null;
    keepOnSplit: boolean;
    isRequired?: boolean;
};
export declare type Attributes = {
    [key: string]: Attribute;
};
export declare type ExtensionAttribute = {
    type: string;
    name: string;
    attribute: Required<Attribute>;
};
export declare type GlobalAttributes = {
    types: string[];
    attributes: {
        [key: string]: Attribute;
    };
}[];
export declare type PickValue<T, K extends keyof T> = T[K];
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare type Diff<T extends keyof any, U extends keyof any> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;
export declare type ValuesOf<T> = T[keyof T];
export declare type KeysWithTypeOf<T, Type> = {
    [P in keyof T]: T[P] extends Type ? P : never;
}[keyof T];
export declare type DecorationWithType = Decoration & {
    type: NodeType;
};
export declare type NodeViewProps = {
    editor: Editor;
    node: ProseMirrorNode;
    decorations: DecorationWithType[];
    selected: boolean;
    extension: Node;
    getPos: () => number;
    updateAttributes: (attributes: Record<string, any>) => void;
    deleteNode: () => void;
};
export interface NodeViewRendererOptions {
    stopEvent: ((props: {
        event: Event;
    }) => boolean) | null;
    ignoreMutation: ((props: {
        mutation: MutationRecord | {
            type: 'selection';
            target: Element;
        };
    }) => boolean) | null;
}
export declare type NodeViewRendererProps = {
    editor: Editor;
    node: ProseMirrorNode;
    getPos: (() => number) | boolean;
    HTMLAttributes: Record<string, any>;
    decorations: Decoration[];
    extension: Node;
};
export declare type NodeViewRenderer = (props: NodeViewRendererProps) => NodeView | {};
export declare type AnyCommands = Record<string, (...args: any[]) => Command>;
export declare type UnionCommands<T = Command> = UnionToIntersection<ValuesOf<Pick<Commands<T>, KeysWithTypeOf<Commands<T>, {}>>>>;
export declare type RawCommands = {
    [Item in keyof UnionCommands]: UnionCommands<Command>[Item];
};
export declare type SingleCommands = {
    [Item in keyof UnionCommands]: UnionCommands<boolean>[Item];
};
export declare type ChainedCommands = {
    [Item in keyof UnionCommands]: UnionCommands<ChainedCommands>[Item];
} & {
    run: () => boolean;
};
export declare type CanCommands = SingleCommands & {
    chain: () => ChainedCommands;
};
export declare type FocusPosition = 'start' | 'end' | 'all' | number | boolean | null;
export declare type Range = {
    from: number;
    to: number;
};
export declare type NodeRange = {
    node: ProseMirrorNode;
    from: number;
    to: number;
};
export declare type MarkRange = {
    mark: ProseMirrorMark;
    from: number;
    to: number;
};
export declare type Predicate = (node: ProseMirrorNode) => boolean;
export declare type NodeWithPos = {
    node: ProseMirrorNode;
    pos: number;
};
export declare type TextSerializer = (props: {
    node: ProseMirrorNode;
    pos: number;
    parent: ProseMirrorNode;
    index: number;
    range: Range;
}) => string;
export declare type ExtendedRegExpMatchArray = RegExpMatchArray & {
    data?: Record<string, any>;
};
export declare type Dispatch = ((args?: any) => any) | undefined;
