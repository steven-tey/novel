import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        splitListItem: {
            /**
             * Splits one list item into two list items.
             */
            splitListItem: (typeOrName: string | NodeType) => ReturnType;
        };
    }
}
export declare const splitListItem: RawCommands['splitListItem'];
