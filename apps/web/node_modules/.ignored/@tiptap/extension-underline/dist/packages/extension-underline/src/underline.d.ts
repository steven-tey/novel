import { Mark } from '@tiptap/core';
export interface UnderlineOptions {
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        underline: {
            /**
             * Set an underline mark
             */
            setUnderline: () => ReturnType;
            /**
             * Toggle an underline mark
             */
            toggleUnderline: () => ReturnType;
            /**
             * Unset an underline mark
             */
            unsetUnderline: () => ReturnType;
        };
    }
}
export declare const Underline: Mark<UnderlineOptions, any>;
