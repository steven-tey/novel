import { Selection } from '@tiptap/pm/state';
import { Predicate } from '../types';
export declare function findParentNode(predicate: Predicate): (selection: Selection) => {
    pos: number;
    start: number;
    depth: number;
    node: import("prosemirror-model").Node;
} | undefined;
