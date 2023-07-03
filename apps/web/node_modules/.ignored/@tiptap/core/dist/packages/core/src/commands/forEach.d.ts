import { CommandProps, RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        forEach: {
            /**
             * Loop through an array of items.
             */
            forEach: <T>(items: T[], fn: (item: T, props: CommandProps & {
                index: number;
            }) => boolean) => ReturnType;
        };
    }
}
export declare const forEach: RawCommands['forEach'];
