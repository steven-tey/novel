import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        joinUp: {
            /**
             * Join two nodes Up.
             */
            joinUp: () => ReturnType;
        };
        joinDown: {
            /**
             * Join two nodes Down.
             */
            joinDown: () => ReturnType;
        };
        joinBackward: {
            /**
             * Join two nodes Backwards.
             */
            joinBackward: () => ReturnType;
        };
        joinForward: {
            /**
             * Join two nodes Forwards.
             */
            joinForward: () => ReturnType;
        };
    }
}
export declare const joinUp: RawCommands['joinUp'];
export declare const joinDown: RawCommands['joinDown'];
export declare const joinBackward: RawCommands['joinBackward'];
export declare const joinForward: RawCommands['joinForward'];
