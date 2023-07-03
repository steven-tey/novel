import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        newlineInCode: {
            /**
             * Add a newline character in code.
             */
            newlineInCode: () => ReturnType;
        };
    }
}
export declare const newlineInCode: RawCommands['newlineInCode'];
