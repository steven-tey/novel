/// <reference types="react" />
import { CacheNode } from '../../../shared/lib/app-router-context';
import type { FlightRouterState } from '../../../server/app-render/types';
export declare function fillLazyItemsTillLeafWithHead(newCache: CacheNode, existingCache: CacheNode | undefined, routerState: FlightRouterState, head: React.ReactNode, wasPrefetched?: boolean): void;
