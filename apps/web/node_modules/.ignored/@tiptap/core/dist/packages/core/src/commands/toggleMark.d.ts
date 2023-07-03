import { MarkType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        toggleMark: {
            /**
             * Toggle a mark on and off.
             */
            toggleMark: (typeOrName: string | MarkType, attributes?: Record<string, any>, options?: {
                /**
                 * Removes the mark even across the current selection. Defaults to `false`.
                 */
                extendEmptyMarkRange?: boolean;
            }) => ReturnType;
        };
    }
}
export declare const toggleMark: RawCommands['toggleMark'];
