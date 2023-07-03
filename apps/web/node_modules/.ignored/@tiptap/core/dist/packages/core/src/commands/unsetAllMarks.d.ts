import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        unsetAllMarks: {
            /**
             * Remove all marks in the current selection.
             */
            unsetAllMarks: () => ReturnType;
        };
    }
}
export declare const unsetAllMarks: RawCommands['unsetAllMarks'];
