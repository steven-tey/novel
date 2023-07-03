import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeWithPos, Predicate, Range } from '../types';
/**
 * Same as `findChildren` but searches only within a `range`.
 */
export declare function findChildrenInRange(node: ProseMirrorNode, range: Range, predicate: Predicate): NodeWithPos[];
