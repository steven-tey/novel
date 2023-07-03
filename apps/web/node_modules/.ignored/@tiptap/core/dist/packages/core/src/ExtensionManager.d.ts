import { Schema } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import { Editor } from './Editor';
import { Extensions, RawCommands } from './types';
export declare class ExtensionManager {
    editor: Editor;
    schema: Schema;
    extensions: Extensions;
    splittableMarks: string[];
    constructor(extensions: Extensions, editor: Editor);
    static resolve(extensions: Extensions): Extensions;
    static flatten(extensions: Extensions): Extensions;
    static sort(extensions: Extensions): Extensions;
    get commands(): RawCommands;
    get plugins(): Plugin[];
    get attributes(): import("@tiptap/core").ExtensionAttribute[];
    get nodeViews(): any;
}
