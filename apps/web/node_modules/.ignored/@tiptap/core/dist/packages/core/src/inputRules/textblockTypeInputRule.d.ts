import { NodeType } from '@tiptap/pm/model';
import { InputRule, InputRuleFinder } from '../InputRule';
import { ExtendedRegExpMatchArray } from '../types';
/**
 * Build an input rule that changes the type of a textblock when the
 * matched text is typed into it. When using a regular expresion you’ll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 */
export declare function textblockTypeInputRule(config: {
    find: InputRuleFinder;
    type: NodeType;
    getAttributes?: Record<string, any> | ((match: ExtendedRegExpMatchArray) => Record<string, any>) | false | null;
}): InputRule;
