import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setNodeSelection: {
            /**
             * Creates a NodeSelection.
             */
            setNodeSelection: (position: number) => ReturnType;
        };
    }
}
export declare const setNodeSelection: RawCommands['setNodeSelection'];
