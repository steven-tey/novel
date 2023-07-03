import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Transaction } from '@tiptap/pm/state';
import { Transform } from '@tiptap/pm/transform';
/**
 * Returns a new `Transform` based on all steps of the passed transactions.
 */
export declare function combineTransactionSteps(oldDoc: ProseMirrorNode, transactions: Transaction[]): Transform;
