import { Range, RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        deleteRange: {
            /**
             * Delete a given range.
             */
            deleteRange: (range: Range) => ReturnType;
        };
    }
}
export declare const deleteRange: RawCommands['deleteRange'];
