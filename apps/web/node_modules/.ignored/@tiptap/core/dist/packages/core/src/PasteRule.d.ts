import { EditorState, Plugin } from '@tiptap/pm/state';
import { Editor } from './Editor';
import { CanCommands, ChainedCommands, ExtendedRegExpMatchArray, Range, SingleCommands } from './types';
export declare type PasteRuleMatch = {
    index: number;
    text: string;
    replaceWith?: string;
    match?: RegExpMatchArray;
    data?: Record<string, any>;
};
export declare type PasteRuleFinder = RegExp | ((text: string) => PasteRuleMatch[] | null | undefined);
export declare class PasteRule {
    find: PasteRuleFinder;
    handler: (props: {
        state: EditorState;
        range: Range;
        match: ExtendedRegExpMatchArray;
        commands: SingleCommands;
        chain: () => ChainedCommands;
        can: () => CanCommands;
    }) => void | null;
    constructor(config: {
        find: PasteRuleFinder;
        handler: (props: {
            state: EditorState;
            range: Range;
            match: ExtendedRegExpMatchArray;
            commands: SingleCommands;
            chain: () => ChainedCommands;
            can: () => CanCommands;
        }) => void | null;
    });
}
/**
 * Create an paste rules plugin. When enabled, it will cause pasted
 * text that matches any of the given rules to trigger the rule’s
 * action.
 */
export declare function pasteRulesPlugin(props: {
    editor: Editor;
    rules: PasteRule[];
}): Plugin[];
