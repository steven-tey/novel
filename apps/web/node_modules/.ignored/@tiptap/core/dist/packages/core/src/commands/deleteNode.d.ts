import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        deleteNode: {
            /**
             * Delete a node.
             */
            deleteNode: (typeOrName: string | NodeType) => ReturnType;
        };
    }
}
export declare const deleteNode: RawCommands['deleteNode'];
