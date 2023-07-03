type Callback = (...args: any[]) => Promise<any>;
export declare function unstable_cache<T extends Callback>(cb: T, keyParts?: string[], options?: {
    revalidate?: number | false;
    tags?: string[];
}): T;
export {};
