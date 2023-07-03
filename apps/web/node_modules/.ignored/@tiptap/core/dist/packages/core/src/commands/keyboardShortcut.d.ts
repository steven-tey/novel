import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        keyboardShortcut: {
            /**
             * Trigger a keyboard shortcut.
             */
            keyboardShortcut: (name: string) => ReturnType;
        };
    }
}
export declare const keyboardShortcut: RawCommands['keyboardShortcut'];
