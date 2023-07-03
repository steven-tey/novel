import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        toggleNode: {
            /**
             * Toggle a node with another node.
             */
            toggleNode: (typeOrName: string | NodeType, toggleTypeOrName: string | NodeType, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const toggleNode: RawCommands['toggleNode'];
