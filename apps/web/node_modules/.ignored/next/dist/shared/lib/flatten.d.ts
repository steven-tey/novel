type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T;
/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first. Stolen from Ramda.
 */
export declare function flatten<T extends readonly any[]>(list: T): Flattened<T>[];
export {};
