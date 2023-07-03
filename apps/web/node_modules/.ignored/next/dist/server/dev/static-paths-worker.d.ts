import type { NextConfigComplete } from '../config-shared';
import '../require-hook';
import '../node-polyfill-fetch';
import '../node-environment';
import { IncrementalCache } from '../lib/incremental-cache';
type RuntimeConfig = any;
export declare function loadStaticPaths({ distDir, pathname, config, httpAgentOptions, locales, defaultLocale, isAppPath, originalAppPath, isrFlushToDisk, fetchCacheKeyPrefix, maxMemoryCacheSize, requestHeaders, incrementalCacheHandlerPath, }: {
    distDir: string;
    pathname: string;
    config: RuntimeConfig;
    httpAgentOptions: NextConfigComplete['httpAgentOptions'];
    locales?: string[];
    defaultLocale?: string;
    isAppPath?: boolean;
    originalAppPath?: string;
    isrFlushToDisk?: boolean;
    fetchCacheKeyPrefix?: string;
    maxMemoryCacheSize?: number;
    requestHeaders: IncrementalCache['requestHeaders'];
    incrementalCacheHandlerPath?: string;
}): Promise<{
    paths?: string[];
    encodedPaths?: string[];
    fallback?: boolean | 'blocking';
}>;
export {};
