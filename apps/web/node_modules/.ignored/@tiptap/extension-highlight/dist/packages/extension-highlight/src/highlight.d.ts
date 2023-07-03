import { Mark } from '@tiptap/core';
export interface HighlightOptions {
    multicolor: boolean;
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        highlight: {
            /**
             * Set a highlight mark
             */
            setHighlight: (attributes?: {
                color: string;
            }) => ReturnType;
            /**
             * Toggle a highlight mark
             */
            toggleHighlight: (attributes?: {
                color: string;
            }) => ReturnType;
            /**
             * Unset a highlight mark
             */
            unsetHighlight: () => ReturnType;
        };
    }
}
export declare const inputRegex: RegExp;
export declare const pasteRegex: RegExp;
export declare const Highlight: Mark<HighlightOptions, any>;
