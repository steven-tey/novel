import { Transaction } from '@tiptap/pm/state';
export interface TrackerResult {
    position: number;
    deleted: boolean;
}
export declare class Tracker {
    transaction: Transaction;
    currentStep: number;
    constructor(transaction: Transaction);
    map(position: number): TrackerResult;
}
