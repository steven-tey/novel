import { MarkType } from '@tiptap/pm/model';
import { PasteRule, PasteRuleFinder } from '../PasteRule';
import { ExtendedRegExpMatchArray } from '../types';
/**
 * Build an paste rule that adds a mark when the
 * matched text is pasted into it.
 */
export declare function markPasteRule(config: {
    find: PasteRuleFinder;
    type: MarkType;
    getAttributes?: Record<string, any> | ((match: ExtendedRegExpMatchArray) => Record<string, any>) | false | null;
}): PasteRule;
