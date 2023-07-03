import { Mark } from '@tiptap/core';
export interface TextStyleOptions {
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        textStyle: {
            /**
             * Remove spans without inline style attributes.
             */
            removeEmptyTextStyle: () => ReturnType;
        };
    }
}
export declare const TextStyle: Mark<TextStyleOptions, any>;
