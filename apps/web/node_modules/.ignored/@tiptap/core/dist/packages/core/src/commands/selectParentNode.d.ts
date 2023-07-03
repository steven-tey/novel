import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        selectParentNode: {
            /**
             * Select the parent node.
             */
            selectParentNode: () => ReturnType;
        };
    }
}
export declare const selectParentNode: RawCommands['selectParentNode'];
