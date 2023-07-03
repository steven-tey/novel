import { NodeType } from '@tiptap/pm/model';
import { InputRule, InputRuleFinder } from '../InputRule';
import { ExtendedRegExpMatchArray } from '../types';
/**
 * Build an input rule that adds a node when the
 * matched text is typed into it.
 */
export declare function nodeInputRule(config: {
    find: InputRuleFinder;
    type: NodeType;
    getAttributes?: Record<string, any> | ((match: ExtendedRegExpMatchArray) => Record<string, any>) | false | null;
}): InputRule;
