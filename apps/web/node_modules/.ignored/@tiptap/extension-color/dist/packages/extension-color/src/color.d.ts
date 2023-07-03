import '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
export declare type ColorOptions = {
    types: string[];
};
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        color: {
            /**
             * Set the text color
             */
            setColor: (color: string) => ReturnType;
            /**
             * Unset the text color
             */
            unsetColor: () => ReturnType;
        };
    }
}
export declare const Color: Extension<ColorOptions, any>;
