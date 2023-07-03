import type { ReactNode } from 'react';
import type { CacheNode } from '../../../shared/lib/app-router-context';
import type { FlightRouterState } from '../../../server/app-render/types';
import { CacheStates } from '../../../shared/lib/app-router-context';
export interface InitialRouterStateParameters {
    buildId: string;
    initialTree: FlightRouterState;
    initialCanonicalUrl: string;
    children: ReactNode;
    initialParallelRoutes: CacheNode['parallelRoutes'];
    isServer: boolean;
    location: Location | null;
    initialHead: ReactNode;
}
export declare function createInitialRouterState({ buildId, initialTree, children, initialCanonicalUrl, initialParallelRoutes, isServer, location, initialHead, }: InitialRouterStateParameters): {
    buildId: string;
    tree: FlightRouterState;
    cache: {
        status: CacheStates.READY;
        data: null;
        head?: ReactNode;
        subTreeData: ReactNode;
        parallelRoutes: Map<string, import("../../../shared/lib/app-router-context").ChildSegmentMap>;
    };
    prefetchCache: Map<any, any>;
    pushRef: {
        pendingPush: boolean;
        mpaNavigation: boolean;
    };
    focusAndScrollRef: {
        apply: boolean;
        hashFragment: null;
        segmentPaths: never[];
    };
    canonicalUrl: string;
    nextUrl: string | null;
};
