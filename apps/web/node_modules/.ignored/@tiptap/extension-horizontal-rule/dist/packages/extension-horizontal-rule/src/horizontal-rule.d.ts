import { Node } from '@tiptap/core';
export interface HorizontalRuleOptions {
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        horizontalRule: {
            /**
             * Add a horizontal rule
             */
            setHorizontalRule: () => ReturnType;
        };
    }
}
export declare const HorizontalRule: Node<HorizontalRuleOptions, any>;
