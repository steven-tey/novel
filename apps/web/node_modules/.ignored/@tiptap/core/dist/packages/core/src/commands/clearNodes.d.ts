import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        clearNodes: {
            /**
             * Normalize nodes to a simple paragraph.
             */
            clearNodes: () => ReturnType;
        };
    }
}
export declare const clearNodes: RawCommands['clearNodes'];
