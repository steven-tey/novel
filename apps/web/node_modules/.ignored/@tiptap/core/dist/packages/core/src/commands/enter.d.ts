import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        enter: {
            /**
             * Trigger enter.
             */
            enter: () => ReturnType;
        };
    }
}
export declare const enter: RawCommands['enter'];
