import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        selectAll: {
            /**
             * Select the whole document.
             */
            selectAll: () => ReturnType;
        };
    }
}
export declare const selectAll: RawCommands['selectAll'];
