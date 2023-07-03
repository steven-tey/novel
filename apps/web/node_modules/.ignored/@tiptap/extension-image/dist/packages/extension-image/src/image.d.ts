import { Node } from '@tiptap/core';
export interface ImageOptions {
    inline: boolean;
    allowBase64: boolean;
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        image: {
            /**
             * Add an image
             */
            setImage: (options: {
                src: string;
                alt?: string;
                title?: string;
            }) => ReturnType;
        };
    }
}
export declare const inputRegex: RegExp;
export declare const Image: Node<ImageOptions, any>;
