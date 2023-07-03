import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        blur: {
            /**
             * Removes focus from the editor.
             */
            blur: () => ReturnType;
        };
    }
}
export declare const blur: RawCommands['blur'];
