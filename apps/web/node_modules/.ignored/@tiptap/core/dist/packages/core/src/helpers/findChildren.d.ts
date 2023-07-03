import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeWithPos, Predicate } from '../types';
export declare function findChildren(node: ProseMirrorNode, predicate: Predicate): NodeWithPos[];
