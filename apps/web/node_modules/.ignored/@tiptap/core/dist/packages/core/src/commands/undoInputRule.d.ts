import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        undoInputRule: {
            /**
             * Undo an input rule.
             */
            undoInputRule: () => ReturnType;
        };
    }
}
export declare const undoInputRule: RawCommands['undoInputRule'];
