import type { CacheFs } from '../../../shared/lib/utils';
import { PrerenderManifest } from '../../../build';
import { IncrementalCacheValue, IncrementalCacheEntry } from '../../response-cache';
export interface CacheHandlerContext {
    fs?: CacheFs;
    dev?: boolean;
    flushToDisk?: boolean;
    serverDistDir?: string;
    maxMemoryCacheSize?: number;
    fetchCacheKeyPrefix?: string;
    prerenderManifest?: PrerenderManifest;
    revalidatedTags: string[];
    _appDir: boolean;
    _requestHeaders: IncrementalCache['requestHeaders'];
}
export interface CacheHandlerValue {
    lastModified?: number;
    age?: number;
    cacheState?: string;
    value: IncrementalCacheValue | null;
}
export declare class CacheHandler {
    constructor(_ctx: CacheHandlerContext);
    get(_key: string, _fetchCache?: boolean, _fetchUrl?: string, _fetchIdx?: number): Promise<CacheHandlerValue | null>;
    set(_key: string, _data: IncrementalCacheValue | null, _fetchCache?: boolean, _fetchUrl?: string, _fetchIdx?: number): Promise<void>;
    revalidateTag(_tag: string): Promise<void>;
}
export declare class IncrementalCache {
    dev?: boolean;
    cacheHandler?: CacheHandler;
    prerenderManifest: PrerenderManifest;
    requestHeaders: Record<string, undefined | string | string[]>;
    requestProtocol?: 'http' | 'https';
    allowedRevalidateHeaderKeys?: string[];
    minimalMode?: boolean;
    fetchCacheKeyPrefix?: string;
    revalidatedTags?: string[];
    isOnDemandRevalidate?: boolean;
    constructor({ fs, dev, appDir, flushToDisk, fetchCache, minimalMode, serverDistDir, requestHeaders, requestProtocol, maxMemoryCacheSize, getPrerenderManifest, fetchCacheKeyPrefix, CurCacheHandler, allowedRevalidateHeaderKeys, }: {
        fs?: CacheFs;
        dev: boolean;
        appDir?: boolean;
        fetchCache?: boolean;
        minimalMode?: boolean;
        serverDistDir?: string;
        flushToDisk?: boolean;
        requestProtocol?: 'http' | 'https';
        allowedRevalidateHeaderKeys?: string[];
        requestHeaders: IncrementalCache['requestHeaders'];
        maxMemoryCacheSize?: number;
        getPrerenderManifest: () => PrerenderManifest;
        fetchCacheKeyPrefix?: string;
        CurCacheHandler?: typeof CacheHandler;
    });
    private calculateRevalidate;
    _getPathname(pathname: string, fetchCache?: boolean): string;
    revalidateTag(tag: string): Promise<void | undefined>;
    fetchCacheKey(url: string, init?: RequestInit | Request): Promise<string>;
    get(pathname: string, fetchCache?: boolean, revalidate?: number | false, fetchUrl?: string, fetchIdx?: number): Promise<IncrementalCacheEntry | null>;
    set(pathname: string, data: IncrementalCacheValue | null, revalidateSeconds?: number | false, fetchCache?: boolean, fetchUrl?: string, fetchIdx?: number): Promise<void>;
}
