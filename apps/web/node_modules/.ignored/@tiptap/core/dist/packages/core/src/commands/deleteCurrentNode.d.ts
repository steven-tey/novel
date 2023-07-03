import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        deleteCurrentNode: {
            /**
             * Delete the node that currently has the selection anchor.
             */
            deleteCurrentNode: () => ReturnType;
        };
    }
}
export declare const deleteCurrentNode: RawCommands['deleteCurrentNode'];
