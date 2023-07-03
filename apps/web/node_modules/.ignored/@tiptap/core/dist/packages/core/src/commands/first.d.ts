import { Command, CommandProps, RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        first: {
            /**
             * Runs one command after the other and stops at the first which returns true.
             */
            first: (commands: Command[] | ((props: CommandProps) => Command[])) => ReturnType;
        };
    }
}
export declare const first: RawCommands['first'];
