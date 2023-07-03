import { PasteRule, PasteRuleFinder } from '../PasteRule';
/**
 * Build an paste rule that replaces text when the
 * matched text is pasted into it.
 */
export declare function textPasteRule(config: {
    find: PasteRuleFinder;
    replace: string;
}): PasteRule;
