import type webpack from 'webpack';
import type { ValueOf } from '../../../shared/lib/constants';
import type { ModuleReference, CollectedMetadata } from './metadata/types';
import { NextConfig } from '../../../server/config-shared';
export type AppLoaderOptions = {
    name: string;
    page: string;
    pagePath: string;
    appDir: string;
    appPaths: readonly string[] | null;
    preferredRegion: string | string[] | undefined;
    pageExtensions: string[];
    assetPrefix: string;
    rootDir?: string;
    tsconfigPath?: string;
    isDev?: boolean;
    basePath: string;
    nextConfigOutput?: NextConfig['output'];
    middlewareConfig: string;
};
type AppLoader = webpack.LoaderDefinitionFunction<AppLoaderOptions>;
declare const FILE_TYPES: {
    readonly layout: "layout";
    readonly template: "template";
    readonly error: "error";
    readonly loading: "loading";
    readonly 'not-found': "not-found";
};
export type MetadataResolver = (dir: string, filename: string, extensions: readonly string[]) => Promise<string | undefined>;
export type ComponentsType = {
    readonly [componentKey in ValueOf<typeof FILE_TYPES>]?: ModuleReference;
} & {
    readonly page?: ModuleReference;
} & {
    readonly metadata?: CollectedMetadata;
} & {
    readonly defaultPage?: ModuleReference;
};
declare const nextAppLoader: AppLoader;
export default nextAppLoader;
