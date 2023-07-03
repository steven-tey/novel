import { MarkType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        extendMarkRange: {
            /**
             * Extends the text selection to the current mark.
             */
            extendMarkRange: (typeOrName: string | MarkType, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const extendMarkRange: RawCommands['extendMarkRange'];
