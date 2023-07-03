import { EditorState, Plugin } from '@tiptap/pm/state';
import { Editor } from './Editor';
import { CanCommands, ChainedCommands, ExtendedRegExpMatchArray, Range, SingleCommands } from './types';
export declare type InputRuleMatch = {
    index: number;
    text: string;
    replaceWith?: string;
    match?: RegExpMatchArray;
    data?: Record<string, any>;
};
export declare type InputRuleFinder = RegExp | ((text: string) => InputRuleMatch | null);
export declare class InputRule {
    find: InputRuleFinder;
    handler: (props: {
        state: EditorState;
        range: Range;
        match: ExtendedRegExpMatchArray;
        commands: SingleCommands;
        chain: () => ChainedCommands;
        can: () => CanCommands;
    }) => void | null;
    constructor(config: {
        find: InputRuleFinder;
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
 * Create an input rules plugin. When enabled, it will cause text
 * input that matches any of the given rules to trigger the rule’s
 * action.
 */
export declare function inputRulesPlugin(props: {
    editor: Editor;
    rules: InputRule[];
}): Plugin;
