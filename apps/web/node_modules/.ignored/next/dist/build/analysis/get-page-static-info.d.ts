import type { NextConfig } from '../../server/config-shared';
import type { RouteHas } from '../../lib/load-custom-routes';
import { ServerRuntime } from 'next/types';
import type { RSCMeta } from '../webpack/loaders/get-module-build-info';
export interface MiddlewareConfig {
    matchers?: MiddlewareMatcher[];
    unstable_allowDynamicGlobs?: string[];
    regions?: string[] | string;
}
export interface MiddlewareMatcher {
    regexp: string;
    locale?: false;
    has?: RouteHas[];
    missing?: RouteHas[];
    originalSource: string;
}
export interface PageStaticInfo {
    runtime?: ServerRuntime;
    preferredRegion?: string | string[];
    ssg?: boolean;
    ssr?: boolean;
    rsc?: RSCModuleType;
    middleware?: MiddlewareConfig;
    amp?: boolean | 'hybrid';
    extraConfig?: Record<string, any>;
}
export type RSCModuleType = 'server' | 'client';
export declare function getRSCModuleInformation(source: string, isServerLayer?: boolean): RSCMeta;
export declare function getMiddlewareMatchers(matcherOrMatchers: unknown, nextConfig: NextConfig): MiddlewareMatcher[];
export declare function isDynamicMetadataRoute(pageFilePath: string): Promise<boolean>;
/**
 * For a given pageFilePath and nextConfig, if the config supports it, this
 * function will read the file and return the runtime that should be used.
 * It will look into the file content only if the page *requires* a runtime
 * to be specified, that is, when gSSP or gSP is used.
 * Related discussion: https://github.com/vercel/next.js/discussions/34179
 */
export declare function getPageStaticInfo(params: {
    pageFilePath: string;
    nextConfig: Partial<NextConfig>;
    isDev?: boolean;
    page?: string;
    pageType: 'pages' | 'app' | 'root';
}): Promise<PageStaticInfo>;
