import { MarkType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setMark: {
            /**
             * Add a mark with new attributes.
             */
            setMark: (typeOrName: string | MarkType, attributes?: Record<string, any>) => ReturnType;
        };
    }
}
export declare const setMark: RawCommands['setMark'];
