import type { MiddlewareConfig, MiddlewareMatcher, RSCModuleType } from '../../analysis/get-page-static-info';
import { webpack } from 'next/dist/compiled/webpack/webpack';
/**
 * A getter for module build info that casts to the type it should have.
 * We also expose here types to make easier to use it.
 */
export declare function getModuleBuildInfo(webpackModule: webpack.Module): {
    nextEdgeMiddleware?: EdgeMiddlewareMeta | undefined;
    nextEdgeApiFunction?: EdgeMiddlewareMeta | undefined;
    nextEdgeSSR?: EdgeSSRMeta | undefined;
    nextWasmMiddlewareBinding?: AssetBinding | undefined;
    nextAssetMiddlewareBinding?: AssetBinding | undefined;
    usingIndirectEval?: boolean | Set<string> | undefined;
    route?: RouteMeta | undefined;
    importLocByPath?: Map<string, any> | undefined;
    rootDir?: string | undefined;
    rsc?: RSCMeta | undefined;
};
export interface RSCMeta {
    type: RSCModuleType;
    actions?: string[];
    clientRefs?: string[];
    clientEntryType?: 'cjs' | 'auto';
    isClientRef?: boolean;
    requests?: string[];
}
export interface RouteMeta {
    page: string;
    absolutePagePath: string;
    preferredRegion: string | string[] | undefined;
    middlewareConfig: MiddlewareConfig;
}
export interface EdgeMiddlewareMeta {
    page: string;
    matchers?: MiddlewareMatcher[];
}
export interface EdgeSSRMeta {
    isServerComponent: boolean;
    isAppDir?: boolean;
    page: string;
}
export interface AssetBinding {
    filePath: string;
    name: string;
}
