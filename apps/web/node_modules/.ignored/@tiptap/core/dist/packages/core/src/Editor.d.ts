import { MarkType, NodeType, Schema } from '@tiptap/pm/model';
import { EditorState, Plugin, PluginKey, Transaction } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import { EventEmitter } from './EventEmitter';
import { ExtensionManager } from './ExtensionManager';
import * as extensions from './extensions';
import { CanCommands, ChainedCommands, EditorEvents, EditorOptions, JSONContent, SingleCommands, TextSerializer } from './types';
export { extensions };
export interface HTMLElement {
    editor?: Editor;
}
export declare class Editor extends EventEmitter<EditorEvents> {
    private commandManager;
    extensionManager: ExtensionManager;
    private css;
    schema: Schema;
    view: EditorView;
    isFocused: boolean;
    extensionStorage: Record<string, any>;
    options: EditorOptions;
    constructor(options?: Partial<EditorOptions>);
    /**
     * Returns the editor storage.
     */
    get storage(): Record<string, any>;
    /**
     * An object of all registered commands.
     */
    get commands(): SingleCommands;
    /**
     * Create a command chain to call multiple commands at once.
     */
    chain(): ChainedCommands;
    /**
     * Check if a command or a command chain can be executed. Without executing it.
     */
    can(): CanCommands;
    /**
     * Inject CSS styles.
     */
    private injectCSS;
    /**
     * Update editor options.
     *
     * @param options A list of options
     */
    setOptions(options?: Partial<EditorOptions>): void;
    /**
     * Update editable state of the editor.
     */
    setEditable(editable: boolean, emitUpdate?: boolean): void;
    /**
     * Returns whether the editor is editable.
     */
    get isEditable(): boolean;
    /**
     * Returns the editor state.
     */
    get state(): EditorState;
    /**
     * Register a ProseMirror plugin.
     *
     * @param plugin A ProseMirror plugin
     * @param handlePlugins Control how to merge the plugin into the existing plugins.
     */
    registerPlugin(plugin: Plugin, handlePlugins?: (newPlugin: Plugin, plugins: Plugin[]) => Plugin[]): void;
    /**
     * Unregister a ProseMirror plugin.
     *
     * @param nameOrPluginKey The plugins name
     */
    unregisterPlugin(nameOrPluginKey: string | PluginKey): void;
    /**
     * Creates an extension manager.
     */
    private createExtensionManager;
    /**
     * Creates an command manager.
     */
    private createCommandManager;
    /**
     * Creates a ProseMirror schema.
     */
    private createSchema;
    /**
     * Creates a ProseMirror view.
     */
    private createView;
    /**
     * Creates all node views.
     */
    createNodeViews(): void;
    isCapturingTransaction: boolean;
    private capturedTransaction;
    captureTransaction(fn: Function): Transaction | null;
    /**
     * The callback over which to send transactions (state updates) produced by the view.
     *
     * @param transaction An editor state transaction
     */
    private dispatchTransaction;
    /**
     * Get attributes of the currently selected node or mark.
     */
    getAttributes(nameOrType: string | NodeType | MarkType): Record<string, any>;
    /**
     * Returns if the currently selected node or mark is active.
     *
     * @param name Name of the node or mark
     * @param attributes Attributes of the node or mark
     */
    isActive(name: string, attributes?: {}): boolean;
    isActive(attributes: {}): boolean;
    /**
     * Get the document as JSON.
     */
    getJSON(): JSONContent;
    /**
     * Get the document as HTML.
     */
    getHTML(): string;
    /**
     * Get the document as text.
     */
    getText(options?: {
        blockSeparator?: string;
        textSerializers?: Record<string, TextSerializer>;
    }): string;
    /**
     * Check if there is no content.
     */
    get isEmpty(): boolean;
    /**
     * Get the number of characters for the current document.
     *
     * @deprecated
     */
    getCharacterCount(): number;
    /**
     * Destroy the editor.
     */
    destroy(): void;
    /**
     * Check if the editor is already destroyed.
     */
    get isDestroyed(): boolean;
}
