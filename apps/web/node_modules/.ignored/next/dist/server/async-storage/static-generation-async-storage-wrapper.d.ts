import type { AsyncStorageWrapper } from './async-storage-wrapper';
import type { StaticGenerationStore } from '../../client/components/static-generation-async-storage';
import type { IncrementalCache } from '../lib/incremental-cache';
export type StaticGenerationContext = {
    pathname: string;
    renderOpts: {
        originalPathname?: string;
        incrementalCache?: IncrementalCache;
        supportsDynamicHTML: boolean;
        isRevalidate?: boolean;
        isOnDemandRevalidate?: boolean;
        isBot?: boolean;
        nextExport?: boolean;
        fetchCache?: StaticGenerationStore['fetchCache'];
        isDraftMode?: boolean;
    };
};
export declare const StaticGenerationAsyncStorageWrapper: AsyncStorageWrapper<StaticGenerationStore, StaticGenerationContext>;
