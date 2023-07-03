import { PrefetchCacheEntry } from './router-reducer-types';
export declare enum PrefetchCacheEntryStatus {
    fresh = "fresh",
    reusable = "reusable",
    expired = "expired",
    stale = "stale"
}
export declare function getPrefetchEntryCacheStatus({ kind, prefetchTime, lastUsedTime, }: PrefetchCacheEntry): PrefetchCacheEntryStatus;
