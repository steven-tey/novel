import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        wrapInList: {
            /**
             * Wrap a node in a list.
             */
            wrapInList: (typeOrName: string | NodeType, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const wrapInList: RawCommands['wrapInList'];
