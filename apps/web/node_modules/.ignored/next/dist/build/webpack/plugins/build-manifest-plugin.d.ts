import type { CustomRoutes } from '../../../lib/load-custom-routes';
import { webpack } from 'next/dist/compiled/webpack/webpack';
export type ClientBuildManifest = Record<string, string[]>;
export declare function getEntrypointFiles(entrypoint: any): string[];
export default class BuildManifestPlugin {
    private buildId;
    private rewrites;
    private isDevFallback;
    private exportRuntime;
    private appDirEnabled;
    constructor(options: {
        buildId: string;
        rewrites: CustomRoutes['rewrites'];
        isDevFallback?: boolean;
        exportRuntime?: boolean;
        appDirEnabled: boolean;
    });
    createAssets(compiler: any, compilation: any, assets: any): any;
    apply(compiler: webpack.Compiler): void;
}
