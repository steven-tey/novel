import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        splitBlock: {
            /**
             * Forks a new node from an existing node.
             */
            splitBlock: (options?: {
                keepMarks?: boolean;
            }) => ReturnType;
        };
    }
}
export declare const splitBlock: RawCommands['splitBlock'];
