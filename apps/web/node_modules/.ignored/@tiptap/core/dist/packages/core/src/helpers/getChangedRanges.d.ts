import { Transform } from '@tiptap/pm/transform';
import { Range } from '../types';
export declare type ChangedRange = {
    oldRange: Range;
    newRange: Range;
};
/**
 * Returns a list of changed ranges
 * based on the first and last state of all steps.
 */
export declare function getChangedRanges(transform: Transform): ChangedRange[];
