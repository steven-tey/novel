import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        lift: {
            /**
             * Removes an existing wrap.
             */
            lift: (typeOrName: string | NodeType, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const lift: RawCommands['lift'];
