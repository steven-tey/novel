import { PrefetchCacheEntryStatus, getPrefetchEntryCacheStatus } from "../get-prefetch-cache-entry-status";
export function prunePrefetchCache(prefetchCache) {
    for (const [href, prefetchCacheEntry] of prefetchCache){
        if (getPrefetchEntryCacheStatus(prefetchCacheEntry) === PrefetchCacheEntryStatus.expired) {
            prefetchCache.delete(href);
        }
    }
}

//# sourceMappingURL=prune-prefetch-cache.js.map