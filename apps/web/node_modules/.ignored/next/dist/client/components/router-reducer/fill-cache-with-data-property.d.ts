import { FlightSegmentPath } from '../../../server/app-render/types';
import { CacheNode } from '../../../shared/lib/app-router-context';
import { fetchServerResponse } from './fetch-server-response';
/**
 * Kick off fetch based on the common layout between two routes. Fill cache with data property holding the in-progress fetch.
 */
export declare function fillCacheWithDataProperty(newCache: CacheNode, existingCache: CacheNode, flightSegmentPath: FlightSegmentPath, fetchResponse: () => ReturnType<typeof fetchServerResponse>, bailOnParallelRoutes?: boolean): {
    bailOptimistic: boolean;
} | undefined;
