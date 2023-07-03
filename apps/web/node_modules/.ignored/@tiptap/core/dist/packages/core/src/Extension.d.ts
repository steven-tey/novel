import { Plugin, Transaction } from '@tiptap/pm/state';
import { ExtensionConfig } from '.';
import { Editor } from './Editor';
import { InputRule } from './InputRule';
import { Mark } from './Mark';
import { Node } from './Node';
import { PasteRule } from './PasteRule';
import { Extensions, GlobalAttributes, KeyboardShortcutCommand, ParentConfig, RawCommands } from './types';
declare module '@tiptap/core' {
    interface ExtensionConfig<Options = any, Storage = any> {
        [key: string]: any;
        /**
         * Name
         */
        name: string;
        /**
         * Priority
         */
        priority?: number;
        /**
         * Default options
         */
        defaultOptions?: Options;
        /**
         * Default Options
         */
        addOptions?: (this: {
            name: string;
            parent: Exclude<ParentConfig<ExtensionConfig<Options, Storage>>['addOptions'], undefined>;
        }) => Options;
        /**
         * Default Storage
         */
        addStorage?: (this: {
            name: string;
            options: Options;
            parent: Exclude<ParentConfig<ExtensionConfig<Options, Storage>>['addStorage'], undefined>;
        }) => Storage;
        /**
         * Global attributes
         */
        addGlobalAttributes?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addGlobalAttributes'];
        }) => GlobalAttributes | {};
        /**
         * Raw
         */
        addCommands?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addCommands'];
        }) => Partial<RawCommands>;
        /**
         * Keyboard shortcuts
         */
        addKeyboardShortcuts?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addKeyboardShortcuts'];
        }) => {
            [key: string]: KeyboardShortcutCommand;
        };
        /**
         * Input rules
         */
        addInputRules?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addInputRules'];
        }) => InputRule[];
        /**
         * Paste rules
         */
        addPasteRules?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addPasteRules'];
        }) => PasteRule[];
        /**
         * ProseMirror plugins
         */
        addProseMirrorPlugins?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addProseMirrorPlugins'];
        }) => Plugin[];
        /**
         * Extensions
         */
        addExtensions?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['addExtensions'];
        }) => Extensions;
        /**
         * Extend Node Schema
         */
        extendNodeSchema?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['extendNodeSchema'];
        }, extension: Node) => Record<string, any>) | null;
        /**
         * Extend Mark Schema
         */
        extendMarkSchema?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['extendMarkSchema'];
        }, extension: Mark) => Record<string, any>) | null;
        /**
         * The editor is not ready yet.
         */
        onBeforeCreate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onBeforeCreate'];
        }) => void) | null;
        /**
         * The editor is ready.
         */
        onCreate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onCreate'];
        }) => void) | null;
        /**
         * The content has changed.
         */
        onUpdate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onUpdate'];
        }) => void) | null;
        /**
         * The selection has changed.
         */
        onSelectionUpdate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onSelectionUpdate'];
        }) => void) | null;
        /**
         * The editor state has changed.
         */
        onTransaction?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onTransaction'];
        }, props: {
            transaction: Transaction;
        }) => void) | null;
        /**
         * The editor is focused.
         */
        onFocus?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onFocus'];
        }, props: {
            event: FocusEvent;
        }) => void) | null;
        /**
         * The editor isn’t focused anymore.
         */
        onBlur?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onBlur'];
        }, props: {
            event: FocusEvent;
        }) => void) | null;
        /**
         * The editor is destroyed.
         */
        onDestroy?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onDestroy'];
        }) => void) | null;
    }
}
export declare class Extension<Options = any, Storage = any> {
    type: string;
    name: string;
    parent: Extension | null;
    child: Extension | null;
    options: Options;
    storage: Storage;
    config: ExtensionConfig;
    constructor(config?: Partial<ExtensionConfig<Options, Storage>>);
    static create<O = any, S = any>(config?: Partial<ExtensionConfig<O, S>>): Extension<O, S>;
    configure(options?: Partial<Options>): Extension<Options, Storage>;
    extend<ExtendedOptions = Options, ExtendedStorage = Storage>(extendedConfig?: Partial<ExtensionConfig<ExtendedOptions, ExtendedStorage>>): Extension<ExtendedOptions, ExtendedStorage>;
}
