import { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';
import { Predicate } from '../types';
export declare function findParentNodeClosestToPos($pos: ResolvedPos, predicate: Predicate): {
    pos: number;
    start: number;
    depth: number;
    node: ProseMirrorNode;
} | undefined;
