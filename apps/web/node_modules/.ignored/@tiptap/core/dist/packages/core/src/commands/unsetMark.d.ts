import { MarkType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        unsetMark: {
            /**
             * Remove all marks in the current selection.
             */
            unsetMark: (typeOrName: string | MarkType, options?: {
                /**
                 * Removes the mark even across the current selection. Defaults to `false`.
                 */
                extendEmptyMarkRange?: boolean;
            }) => ReturnType;
        };
    }
}
export declare const unsetMark: RawCommands['unsetMark'];
