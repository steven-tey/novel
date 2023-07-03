import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        createParagraphNear: {
            /**
             * Create a paragraph nearby.
             */
            createParagraphNear: () => ReturnType;
        };
    }
}
export declare const createParagraphNear: RawCommands['createParagraphNear'];
