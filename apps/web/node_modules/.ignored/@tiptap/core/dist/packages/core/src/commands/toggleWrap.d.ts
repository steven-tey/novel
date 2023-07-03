import { NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        toggleWrap: {
            /**
             * Wraps nodes in another node, or removes an existing wrap.
             */
            toggleWrap: (typeOrName: string | NodeType, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const toggleWrap: RawCommands['toggleWrap'];
