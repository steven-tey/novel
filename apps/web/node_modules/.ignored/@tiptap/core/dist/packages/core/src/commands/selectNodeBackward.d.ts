import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        selectNodeBackward: {
            /**
             * Select a node backward.
             */
            selectNodeBackward: () => ReturnType;
        };
    }
}
export declare const selectNodeBackward: RawCommands['selectNodeBackward'];
