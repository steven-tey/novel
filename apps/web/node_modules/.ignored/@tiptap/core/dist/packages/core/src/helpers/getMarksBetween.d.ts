import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { MarkRange } from '../types';
export declare function getMarksBetween(from: number, to: number, doc: ProseMirrorNode): MarkRange[];
