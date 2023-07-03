/**
 * Read record value or throw Promise if it's not resolved yet.
 */
export declare function readRecordValue<T>(thenable: Promise<T>): T;
