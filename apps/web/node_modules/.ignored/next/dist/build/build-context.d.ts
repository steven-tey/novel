import type { LoadedEnvFiles } from '@next/env';
import type { Ora } from 'next/dist/compiled/ora';
import type { Rewrite, Redirect } from '../lib/load-custom-routes';
import type { __ApiPreviewProps } from '../server/api-utils';
import type { NextConfigComplete } from '../server/config-shared';
import type { Span } from '../trace';
import type getBaseWebpackConfig from './webpack-config';
import type { PagesManifest } from './webpack/plugins/pages-manifest-plugin';
import type { TelemetryPlugin } from './webpack/plugins/telemetry-plugin';
export declare function resumePluginState(resumedState?: Record<string, any>): void;
export declare function getProxiedPluginState<State extends Record<string, any>>(initialState: State): State;
export declare function getPluginState(): Record<string, any>;
export declare const NextBuildContext: Partial<{
    compilerIdx?: number;
    pluginState: Record<string, any>;
    serializedPagesManifestEntries: {
        edgeServerPages?: PagesManifest;
        nodeServerPages?: PagesManifest;
        edgeServerAppPaths?: PagesManifest;
        nodeServerAppPaths?: PagesManifest;
    };
    dir: string;
    buildId: string;
    config: NextConfigComplete;
    appDir: string;
    pagesDir: string;
    rewrites: {
        fallback: Rewrite[];
        afterFiles: Rewrite[];
        beforeFiles: Rewrite[];
    };
    originalRewrites: {
        fallback: Rewrite[];
        afterFiles: Rewrite[];
        beforeFiles: Rewrite[];
    };
    originalRedirects: Redirect[];
    loadedEnvFiles: LoadedEnvFiles;
    previewProps: __ApiPreviewProps;
    mappedPages: {
        [page: string]: string;
    } | undefined;
    mappedAppPages: {
        [page: string]: string;
    } | undefined;
    mappedRootPaths: {
        [page: string]: string;
    };
    hasInstrumentationHook: boolean;
    telemetryPlugin: TelemetryPlugin;
    buildSpinner: Ora;
    nextBuildSpan: Span;
    reactProductionProfiling: boolean;
    noMangling: boolean;
    appDirOnly: boolean;
    clientRouterFilters: Parameters<typeof getBaseWebpackConfig>[1]['clientRouterFilters'];
    previewModeId: string;
    fetchCacheKeyPrefix?: string;
    allowedRevalidateHeaderKeys?: string[];
}>;
