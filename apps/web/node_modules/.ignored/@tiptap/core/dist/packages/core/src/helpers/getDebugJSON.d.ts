import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { JSONContent } from '../types';
interface DebugJSONContent extends JSONContent {
    from: number;
    to: number;
}
export declare function getDebugJSON(node: ProseMirrorNode, startOffset?: number): DebugJSONContent;
export {};
