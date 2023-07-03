"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getParserOptions: null,
    getJestSWCOptions: null,
    getLoaderSWCOptions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getParserOptions: function() {
        return getParserOptions;
    },
    getJestSWCOptions: function() {
        return getJestSWCOptions;
    },
    getLoaderSWCOptions: function() {
        return getLoaderSWCOptions;
    }
});
const nextDistPath = /(next[\\/]dist[\\/]shared[\\/]lib)|(next[\\/]dist[\\/]client)|(next[\\/]dist[\\/]pages)/;
const regeneratorRuntimePath = require.resolve("next/dist/compiled/regenerator-runtime");
function getParserOptions({ filename , jsConfig , ...rest }) {
    var _jsConfig_compilerOptions;
    const isTSFile = filename.endsWith(".ts");
    const isTypeScript = isTSFile || filename.endsWith(".tsx");
    const enableDecorators = Boolean(jsConfig == null ? void 0 : (_jsConfig_compilerOptions = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions.experimentalDecorators);
    return {
        ...rest,
        syntax: isTypeScript ? "typescript" : "ecmascript",
        dynamicImport: true,
        decorators: enableDecorators,
        // Exclude regular TypeScript files from React transformation to prevent e.g. generic parameters and angle-bracket type assertion from being interpreted as JSX tags.
        [isTypeScript ? "tsx" : "jsx"]: !isTSFile,
        importAssertions: true
    };
}
function getBaseSWCOptions({ filename , jest , development , hasReactRefresh , globalWindow , modularizeImports , swcPlugins , compilerOptions , resolvedBaseUrl , jsConfig , swcCacheDir , isServerLayer , hasServerComponents  }) {
    var _jsConfig_compilerOptions, _jsConfig_compilerOptions1, _jsConfig_compilerOptions2, _jsConfig_compilerOptions3, _jsConfig_compilerOptions4;
    const parserConfig = getParserOptions({
        filename,
        jsConfig
    });
    const paths = jsConfig == null ? void 0 : (_jsConfig_compilerOptions = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions.paths;
    const enableDecorators = Boolean(jsConfig == null ? void 0 : (_jsConfig_compilerOptions1 = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions1.experimentalDecorators);
    const emitDecoratorMetadata = Boolean(jsConfig == null ? void 0 : (_jsConfig_compilerOptions2 = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions2.emitDecoratorMetadata);
    const useDefineForClassFields = Boolean(jsConfig == null ? void 0 : (_jsConfig_compilerOptions3 = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions3.useDefineForClassFields);
    const plugins = (swcPlugins ?? []).filter(Array.isArray).map(([name, options])=>[
            require.resolve(name),
            options
        ]);
    return {
        jsc: {
            ...resolvedBaseUrl && paths ? {
                baseUrl: resolvedBaseUrl,
                paths
            } : {},
            externalHelpers: !process.versions.pnp && !jest,
            parser: parserConfig,
            experimental: {
                keepImportAssertions: true,
                plugins,
                cacheRoot: swcCacheDir
            },
            transform: {
                // Enables https://github.com/swc-project/swc/blob/0359deb4841be743d73db4536d4a22ac797d7f65/crates/swc_ecma_ext_transforms/src/jest.rs
                ...jest ? {
                    hidden: {
                        jest: true
                    }
                } : {},
                legacyDecorator: enableDecorators,
                decoratorMetadata: emitDecoratorMetadata,
                useDefineForClassFields: useDefineForClassFields,
                react: {
                    importSource: (jsConfig == null ? void 0 : (_jsConfig_compilerOptions4 = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions4.jsxImportSource) ?? ((compilerOptions == null ? void 0 : compilerOptions.emotion) ? "@emotion/react" : "react"),
                    runtime: "automatic",
                    pragma: "React.createElement",
                    pragmaFrag: "React.Fragment",
                    throwIfNamespace: true,
                    development: !!development,
                    useBuiltins: true,
                    refresh: !!hasReactRefresh
                },
                optimizer: {
                    simplify: false,
                    globals: jest ? null : {
                        typeofs: {
                            window: globalWindow ? "object" : "undefined"
                        },
                        envs: {
                            NODE_ENV: development ? '"development"' : '"production"'
                        }
                    }
                },
                regenerator: {
                    importPath: regeneratorRuntimePath
                }
            }
        },
        sourceMaps: jest ? "inline" : undefined,
        removeConsole: compilerOptions == null ? void 0 : compilerOptions.removeConsole,
        // disable "reactRemoveProperties" when "jest" is true
        // otherwise the setting from next.config.js will be used
        reactRemoveProperties: jest ? false : compilerOptions == null ? void 0 : compilerOptions.reactRemoveProperties,
        modularizeImports,
        relay: compilerOptions == null ? void 0 : compilerOptions.relay,
        // Always transform styled-jsx and error when `client-only` condition is triggered
        styledJsx: true,
        // Disable css-in-js libs (without client-only integration) transform on server layer for server components
        ...!isServerLayer && {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            emotion: getEmotionOptions(compilerOptions == null ? void 0 : compilerOptions.emotion, development),
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            styledComponents: getStyledComponentsOptions(compilerOptions == null ? void 0 : compilerOptions.styledComponents, development)
        },
        serverComponents: hasServerComponents ? {
            isServer: !!isServerLayer
        } : undefined,
        serverActions: hasServerComponents ? {
            isServer: !!isServerLayer
        } : undefined
    };
}
function getStyledComponentsOptions(styledComponentsConfig, development) {
    if (!styledComponentsConfig) {
        return null;
    } else if (typeof styledComponentsConfig === "object") {
        return {
            ...styledComponentsConfig,
            displayName: styledComponentsConfig.displayName ?? Boolean(development)
        };
    } else {
        return {
            displayName: Boolean(development)
        };
    }
}
function getEmotionOptions(emotionConfig, development) {
    if (!emotionConfig) {
        return null;
    }
    let autoLabel = !!development;
    switch(typeof emotionConfig === "object" && emotionConfig.autoLabel){
        case "never":
            autoLabel = false;
            break;
        case "always":
            autoLabel = true;
            break;
        case "dev-only":
        default:
            break;
    }
    return {
        enabled: true,
        autoLabel,
        sourcemap: development,
        ...typeof emotionConfig === "object" && {
            importMap: emotionConfig.importMap,
            labelFormat: emotionConfig.labelFormat,
            sourcemap: development && emotionConfig.sourceMap
        }
    };
}
function getJestSWCOptions({ isServer , filename , esm , modularizeImports , swcPlugins , compilerOptions , jsConfig , resolvedBaseUrl , pagesDir , hasServerComponents  }) {
    let baseOptions = getBaseSWCOptions({
        filename,
        jest: true,
        development: false,
        hasReactRefresh: false,
        globalWindow: !isServer,
        modularizeImports,
        swcPlugins,
        compilerOptions,
        jsConfig,
        hasServerComponents,
        resolvedBaseUrl
    });
    const isNextDist = nextDistPath.test(filename);
    return {
        ...baseOptions,
        env: {
            targets: {
                // Targets the current version of Node.js
                node: process.versions.node
            }
        },
        module: {
            type: esm && !isNextDist ? "es6" : "commonjs"
        },
        disableNextSsg: true,
        disablePageConfig: true,
        pagesDir
    };
}
function getLoaderSWCOptions({ filename , development , isServer , pagesDir , appDir , isPageFile , hasReactRefresh , modularizeImports , swcPlugins , compilerOptions , jsConfig , supportedBrowsers , swcCacheDir , relativeFilePathFromRoot , hasServerComponents , isServerLayer  }) {
    let baseOptions = getBaseSWCOptions({
        filename,
        development,
        globalWindow: !isServer,
        hasReactRefresh,
        modularizeImports,
        swcPlugins,
        compilerOptions,
        jsConfig,
        // resolvedBaseUrl,
        swcCacheDir,
        hasServerComponents,
        isServerLayer
    });
    baseOptions.fontLoaders = {
        fontLoaders: [
            "next/font/local",
            "next/font/google",
            // TODO: remove this in the next major version
            "@next/font/local",
            "@next/font/google"
        ],
        relativeFilePathFromRoot
    };
    baseOptions.cjsRequireOptimizer = {
        packages: {
            "next/server": {
                transforms: {
                    NextRequest: "next/dist/server/web/spec-extension/request",
                    NextResponse: "next/dist/server/web/spec-extension/response",
                    ImageResponse: "next/dist/server/web/spec-extension/image-response",
                    userAgentFromString: "next/dist/server/web/spec-extension/user-agent",
                    userAgent: "next/dist/server/web/spec-extension/user-agent"
                }
            }
        }
    };
    const isNextDist = nextDistPath.test(filename);
    if (isServer) {
        return {
            ...baseOptions,
            // Disables getStaticProps/getServerSideProps tree shaking on the server compilation for pages
            disableNextSsg: true,
            disablePageConfig: true,
            isDevelopment: development,
            isServer,
            pagesDir,
            appDir,
            isPageFile,
            env: {
                targets: {
                    // Targets the current version of Node.js
                    node: process.versions.node
                }
            }
        };
    } else {
        // Matches default @babel/preset-env behavior
        baseOptions.jsc.target = "es5";
        return {
            ...baseOptions,
            // Ensure Next.js internals are output as commonjs modules
            ...isNextDist ? {
                module: {
                    type: "commonjs"
                }
            } : {},
            disableNextSsg: !isPageFile,
            isDevelopment: development,
            isServer,
            pagesDir,
            appDir,
            isPageFile,
            ...supportedBrowsers && supportedBrowsers.length > 0 ? {
                env: {
                    targets: supportedBrowsers
                }
            } : {}
        };
    }
}

//# sourceMappingURL=options.js.map