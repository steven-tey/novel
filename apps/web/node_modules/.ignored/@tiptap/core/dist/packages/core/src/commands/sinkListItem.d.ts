import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        sinkListItem: {
            /**
             * Sink the list item down into an inner list.
             */
            sinkListItem: (typeOrName: string | NodeType) => ReturnType;
        };
    }
}
export declare const sinkListItem: RawCommands['sinkListItem'];
