import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        liftListItem: {
            /**
             * Lift the list item into a wrapping list.
             */
            liftListItem: (typeOrName: string | NodeType) => ReturnType;
        };
    }
}
export declare const liftListItem: RawCommands['liftListItem'];
