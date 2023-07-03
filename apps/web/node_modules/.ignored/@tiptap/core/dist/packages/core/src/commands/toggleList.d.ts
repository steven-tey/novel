import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        toggleList: {
            /**
             * Toggle between different list types.
             */
            toggleList: (listTypeOrName: string | NodeType, itemTypeOrName: string | NodeType, keepMarks?: boolean, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const toggleList: RawCommands['toggleList'];
