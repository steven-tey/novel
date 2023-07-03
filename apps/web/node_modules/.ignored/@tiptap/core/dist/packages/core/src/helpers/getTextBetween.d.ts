import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Range, TextSerializer } from '../types';
export declare function getTextBetween(startNode: ProseMirrorNode, range: Range, options?: {
    blockSeparator?: string;
    textSerializers?: Record<string, TextSerializer>;
}): string;
