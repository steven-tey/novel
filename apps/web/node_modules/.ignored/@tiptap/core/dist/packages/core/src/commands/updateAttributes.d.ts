import { MarkType, NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        updateAttributes: {
            /**
             * Update attributes of a node or mark.
             */
            updateAttributes: (typeOrName: string | NodeType | MarkType, attributes: Record<string, any>) => ReturnType;
        };
    }
}
export declare const updateAttributes: RawCommands['updateAttributes'];
