import React from 'react';
import type { AppRouterInstance } from '../app-router-context';
import type { NextRouter } from './router';
/**
 * adaptForAppRouterInstance implements the AppRouterInstance with a NextRouter.
 *
 * @param router the NextRouter to adapt
 * @returns an AppRouterInstance
 */
export declare function adaptForAppRouterInstance(router: NextRouter): AppRouterInstance;
/**
 * adaptForSearchParams transforms the ParsedURLQuery into URLSearchParams.
 *
 * @param router the router that contains the query.
 * @returns the search params in the URLSearchParams format
 */
export declare function adaptForSearchParams(router: Pick<NextRouter, 'isReady' | 'query'>): URLSearchParams;
export declare function PathnameContextProviderAdapter({ children, router, ...props }: React.PropsWithChildren<{
    router: Pick<NextRouter, 'pathname' | 'asPath' | 'isReady' | 'isFallback'>;
    isAutoExport: boolean;
}>): React.JSX.Element;
