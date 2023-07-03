import { webpack } from 'next/dist/compiled/webpack/webpack';
export type PagesManifest = {
    [page: string]: string;
};
export declare let edgeServerPages: {};
export declare let nodeServerPages: {};
export declare let edgeServerAppPaths: {};
export declare let nodeServerAppPaths: {};
export default class PagesManifestPlugin implements webpack.WebpackPluginInstance {
    dev: boolean;
    isEdgeRuntime: boolean;
    appDirEnabled: boolean;
    constructor({ dev, isEdgeRuntime, appDirEnabled, }: {
        dev: boolean;
        isEdgeRuntime: boolean;
        appDirEnabled: boolean;
    });
    createAssets(compilation: any, assets: any): void;
    apply(compiler: webpack.Compiler): void;
}
