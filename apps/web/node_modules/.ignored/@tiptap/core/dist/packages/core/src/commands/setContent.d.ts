import { ParseOptions } from '@tiptap/pm/model';
import { Content, RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setContent: {
            /**
             * Replace the whole document with new content.
             */
            setContent: (content: Content, emitUpdate?: boolean, parseOptions?: ParseOptions) => ReturnType;
        };
    }
}
export declare const setContent: RawCommands['setContent'];
