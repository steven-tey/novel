import { MarkType } from '@tiptap/pm/model';
import { InputRule, InputRuleFinder } from '../InputRule';
import { ExtendedRegExpMatchArray } from '../types';
/**
 * Build an input rule that adds a mark when the
 * matched text is typed into it.
 */
export declare function markInputRule(config: {
    find: InputRuleFinder;
    type: MarkType;
    getAttributes?: Record<string, any> | ((match: ExtendedRegExpMatchArray) => Record<string, any>) | false | null;
}): InputRule;
