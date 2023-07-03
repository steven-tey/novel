import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        scrollIntoView: {
            /**
             * Scroll the selection into view.
             */
            scrollIntoView: () => ReturnType;
        };
    }
}
export declare const scrollIntoView: RawCommands['scrollIntoView'];
