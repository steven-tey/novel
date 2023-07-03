import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { TextSerializer } from '../types';
export declare function getText(node: ProseMirrorNode, options?: {
    blockSeparator?: string;
    textSerializers?: Record<string, TextSerializer>;
}): string;
