import { EditorState, Transaction } from '@tiptap/pm/state';
export declare function createChainableState(config: {
    transaction: Transaction;
    state: EditorState;
}): EditorState;
