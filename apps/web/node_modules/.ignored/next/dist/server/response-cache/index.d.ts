import type { IncrementalCache, ResponseCacheEntry, ResponseGenerator } from './types';
export * from './types';
export default class ResponseCache {
    pendingResponses: Map<string, Promise<ResponseCacheEntry | null>>;
    previousCacheItem?: {
        key: string;
        entry: ResponseCacheEntry | null;
        expiresAt: number;
    };
    minimalMode?: boolean;
    constructor(minimalMode: boolean);
    get(key: string | null, responseGenerator: ResponseGenerator, context: {
        isOnDemandRevalidate?: boolean;
        isPrefetch?: boolean;
        incrementalCache: IncrementalCache;
    }): Promise<ResponseCacheEntry | null>;
}
