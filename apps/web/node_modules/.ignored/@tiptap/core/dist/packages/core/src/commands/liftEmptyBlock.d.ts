import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        liftEmptyBlock: {
            /**
             * Lift block if empty.
             */
            liftEmptyBlock: () => ReturnType;
        };
    }
}
export declare const liftEmptyBlock: RawCommands['liftEmptyBlock'];
