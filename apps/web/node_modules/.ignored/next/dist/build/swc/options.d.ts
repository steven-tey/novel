import type { NextConfig, ExperimentalConfig } from '../../server/config-shared';
export declare function getParserOptions({ filename, jsConfig, ...rest }: any): any;
export declare function getJestSWCOptions({ isServer, filename, esm, modularizeImports, swcPlugins, compilerOptions, jsConfig, resolvedBaseUrl, pagesDir, hasServerComponents, }: {
    isServer: boolean;
    filename: string;
    esm: boolean;
    modularizeImports?: NextConfig['modularizeImports'];
    swcPlugins: ExperimentalConfig['swcPlugins'];
    compilerOptions: NextConfig['compiler'];
    jsConfig: any;
    resolvedBaseUrl?: string;
    pagesDir?: string;
    hasServerComponents?: boolean;
}): {
    env: {
        targets: {
            node: string;
        };
    };
    module: {
        type: string;
    };
    disableNextSsg: boolean;
    disablePageConfig: boolean;
    pagesDir: string | undefined;
    serverComponents: {
        isServer: boolean;
    } | undefined;
    serverActions: {
        isServer: boolean;
    } | undefined;
    emotion?: {
        importMap?: {
            [importName: string]: {
                [exportName: string]: {
                    canonicalImport?: [string, string] | undefined;
                    styledBaseImport?: [string, string] | undefined;
                };
            };
        } | undefined;
        labelFormat?: string | undefined;
        sourcemap: boolean;
        enabled: boolean;
        autoLabel: boolean;
    } | null | undefined;
    styledComponents?: {
        displayName: boolean;
        topLevelImportPaths?: string[] | undefined;
        ssr?: boolean | undefined;
        fileName?: boolean | undefined;
        meaninglessFileNames?: string[] | undefined;
        minify?: boolean | undefined;
        transpileTemplateLiterals?: boolean | undefined;
        namespace?: string | undefined;
        pure?: boolean | undefined;
        cssProp?: boolean | undefined;
    } | null | undefined;
    jsc: {
        externalHelpers: boolean;
        parser: any;
        experimental: {
            keepImportAssertions: boolean;
            plugins: any[][];
            cacheRoot: string | undefined;
        };
        transform: {
            legacyDecorator: boolean;
            decoratorMetadata: boolean;
            useDefineForClassFields: boolean;
            react: {
                importSource: any;
                runtime: string;
                pragma: string;
                pragmaFrag: string;
                throwIfNamespace: boolean;
                development: boolean;
                useBuiltins: boolean;
                refresh: boolean;
            };
            optimizer: {
                simplify: boolean;
                globals: {
                    typeofs: {
                        window: string;
                    };
                    envs: {
                        NODE_ENV: string;
                    };
                } | null;
            };
            regenerator: {
                importPath: string;
            };
            hidden?: {
                jest: boolean;
            } | undefined;
        };
        baseUrl?: string | undefined;
        paths?: any;
    };
    sourceMaps: string | undefined;
    removeConsole: boolean | {
        exclude?: string[] | undefined;
    } | undefined;
    reactRemoveProperties: boolean | {
        properties?: string[] | undefined;
    } | undefined;
    modularizeImports: Record<string, {
        transform: string;
        preventFullImport?: boolean | undefined;
        skipDefaultConversion?: boolean | undefined;
    }> | undefined;
    relay: {
        src: string;
        artifactDirectory?: string | undefined;
        language?: "flow" | "typescript" | "javascript" | undefined;
        eagerEsModules?: boolean | undefined;
    } | undefined;
    styledJsx: boolean;
};
export declare function getLoaderSWCOptions({ filename, development, isServer, pagesDir, appDir, isPageFile, hasReactRefresh, modularizeImports, swcPlugins, compilerOptions, jsConfig, supportedBrowsers, swcCacheDir, relativeFilePathFromRoot, hasServerComponents, isServerLayer, }: {
    filename: string;
    development: boolean;
    isServer: boolean;
    pagesDir?: string;
    appDir: string;
    isPageFile: boolean;
    hasReactRefresh: boolean;
    modularizeImports: NextConfig['modularizeImports'];
    swcPlugins: ExperimentalConfig['swcPlugins'];
    compilerOptions: NextConfig['compiler'];
    jsConfig: any;
    supportedBrowsers: string[];
    swcCacheDir: string;
    relativeFilePathFromRoot: string;
    hasServerComponents?: boolean;
    isServerLayer: boolean;
}): any;
