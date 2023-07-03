import { VALID_LOADERS } from "../shared/lib/image-config";
const configSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        amp: {
            additionalProperties: false,
            properties: {
                canonicalBase: {
                    nullable: true,
                    type: "string"
                }
            },
            type: "object"
        },
        analyticsId: {
            type: "string"
        },
        assetPrefix: {
            nullable: true,
            type: "string"
        },
        basePath: {
            type: "string"
        },
        cleanDistDir: {
            type: "boolean"
        },
        compiler: {
            additionalProperties: false,
            properties: {
                emotion: {
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                sourceMap: {
                                    type: "boolean"
                                },
                                autoLabel: {
                                    type: "string",
                                    enum: [
                                        "always",
                                        "dev-only",
                                        "never"
                                    ]
                                },
                                labelFormat: {
                                    type: "string",
                                    minLength: 1
                                },
                                importMap: {
                                    type: "object"
                                }
                            }
                        }
                    ]
                },
                reactRemoveProperties: {
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                properties: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    ]
                },
                relay: {
                    type: "object"
                },
                removeConsole: {
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                exclude: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        minLength: 1
                                    }
                                }
                            }
                        }
                    ]
                },
                styledComponents: {
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                displayName: {
                                    type: "boolean"
                                },
                                topLevelImportPaths: {
                                    oneOf: [
                                        {
                                            type: "boolean"
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                minLength: 1
                                            }
                                        }
                                    ]
                                },
                                ssr: {
                                    type: "boolean"
                                },
                                fileName: {
                                    type: "boolean"
                                },
                                meaninglessFileNames: {
                                    oneOf: [
                                        {
                                            type: "boolean"
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                minLength: 1
                                            }
                                        }
                                    ]
                                },
                                minify: {
                                    type: "boolean"
                                },
                                transpileTemplateLiterals: {
                                    type: "boolean"
                                },
                                namespace: {
                                    type: "string",
                                    minLength: 1
                                },
                                pure: {
                                    type: "boolean"
                                },
                                cssProp: {
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            type: "object"
        },
        compress: {
            type: "boolean"
        },
        configOrigin: {
            type: "string"
        },
        crossOrigin: {
            oneOf: [
                false,
                {
                    enum: [
                        "anonymous",
                        "use-credentials"
                    ],
                    type: "string"
                }
            ]
        },
        devIndicators: {
            additionalProperties: false,
            properties: {
                buildActivity: {
                    type: "boolean"
                },
                buildActivityPosition: {
                    // automatic typing does not like enum
                    enum: [
                        "bottom-left",
                        "bottom-right",
                        "top-left",
                        "top-right"
                    ],
                    type: "string"
                }
            },
            type: "object"
        },
        distDir: {
            minLength: 1,
            type: "string",
            nullable: true
        },
        env: {
            type: "object"
        },
        eslint: {
            additionalProperties: false,
            properties: {
                dirs: {
                    items: {
                        minLength: 1,
                        type: "string"
                    },
                    type: "array"
                },
                ignoreDuringBuilds: {
                    type: "boolean"
                }
            },
            type: "object"
        },
        excludeDefaultMomentLocales: {
            type: "boolean"
        },
        experimental: {
            additionalProperties: false,
            properties: {
                appDocumentPreloading: {
                    type: "boolean"
                },
                adjustFontFallbacks: {
                    type: "boolean"
                },
                adjustFontFallbacksWithSizeAdjust: {
                    type: "boolean"
                },
                allowedRevalidateHeaderKeys: {
                    type: "array"
                },
                amp: {
                    additionalProperties: false,
                    properties: {
                        optimizer: {
                            type: "object"
                        },
                        skipValidation: {
                            type: "boolean"
                        },
                        validator: {
                            type: "string"
                        }
                    },
                    type: "object"
                },
                clientRouterFilter: {
                    type: "boolean"
                },
                clientRouterFilterRedirects: {
                    type: "boolean"
                },
                clientRouterFilterAllowedRate: {
                    type: "number"
                },
                cpus: {
                    type: "number"
                },
                memoryBasedWorkersCount: {
                    type: "boolean"
                },
                craCompat: {
                    type: "boolean"
                },
                caseSensitiveRoutes: {
                    type: "boolean"
                },
                useDeploymentId: {
                    type: "boolean"
                },
                useDeploymentIdServerActions: {
                    type: "boolean"
                },
                deploymentId: {
                    type: "string"
                },
                disableOptimizedLoading: {
                    type: "boolean"
                },
                disablePostcssPresetEnv: {
                    type: "boolean"
                },
                esmExternals: {
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            const: "loose"
                        }
                    ]
                },
                appDir: {
                    type: "boolean"
                },
                serverActions: {
                    type: "boolean"
                },
                serverActionsBodySizeLimit: {
                    oneOf: [
                        {
                            type: "number"
                        },
                        {
                            type: "string"
                        }
                    ]
                },
                extensionAlias: {
                    type: "object"
                },
                externalDir: {
                    type: "boolean"
                },
                externalMiddlewareRewritesResolve: {
                    type: "boolean"
                },
                fallbackNodePolyfills: {
                    type: "boolean"
                },
                fetchCacheKeyPrefix: {
                    type: "string"
                },
                forceSwcTransforms: {
                    type: "boolean"
                },
                fullySpecified: {
                    type: "boolean"
                },
                gzipSize: {
                    type: "boolean"
                },
                incrementalCacheHandlerPath: {
                    type: "string"
                },
                isrFlushToDisk: {
                    type: "boolean"
                },
                isrMemoryCacheSize: {
                    type: "number"
                },
                largePageDataBytes: {
                    type: "number"
                },
                legacyBrowsers: {
                    type: "boolean"
                },
                manualClientBasePath: {
                    type: "boolean"
                },
                middlewarePrefetch: {
                    // automatic typing doesn't like enum
                    enum: [
                        "strict",
                        "flexible"
                    ],
                    type: "string"
                },
                newNextLinkBehavior: {
                    type: "boolean"
                },
                nextScriptWorkers: {
                    type: "boolean"
                },
                optimizeCss: {
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object"
                        }
                    ]
                },
                optimisticClientCache: {
                    type: "boolean"
                },
                outputFileTracingRoot: {
                    nullable: true,
                    type: "string"
                },
                outputFileTracingExcludes: {
                    type: "object"
                },
                outputFileTracingIgnores: {
                    type: "array"
                },
                outputFileTracingIncludes: {
                    type: "object"
                },
                pageEnv: {
                    type: "boolean"
                },
                proxyTimeout: {
                    minimum: 0,
                    type: "number"
                },
                serverComponentsExternalPackages: {
                    items: {
                        type: "string"
                    },
                    type: "array"
                },
                scrollRestoration: {
                    type: "boolean"
                },
                sharedPool: {
                    type: "boolean"
                },
                sri: {
                    properties: {
                        algorithm: {
                            enum: [
                                "sha256",
                                "sha384",
                                "sha512"
                            ],
                            type: "string"
                        }
                    },
                    type: "object"
                },
                strictNextHead: {
                    type: "boolean"
                },
                swcFileReading: {
                    type: "boolean"
                },
                swcMinify: {
                    type: "boolean"
                },
                swcPlugins: {
                    type: "array"
                },
                swcTraceProfiling: {
                    type: "boolean"
                },
                urlImports: {
                    items: {
                        type: "string"
                    },
                    type: "array"
                },
                workerThreads: {
                    type: "boolean"
                },
                webVitalsAttribution: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: [
                            "CLS",
                            "FCP",
                            "FID",
                            "INP",
                            "LCP",
                            "TTFB"
                        ]
                    }
                },
                mdxRs: {
                    type: "boolean"
                },
                typedRoutes: {
                    type: "boolean"
                },
                webpackBuildWorker: {
                    type: "boolean"
                },
                turbo: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        loaders: {
                            type: "object"
                        },
                        resolveAlias: {
                            type: "object"
                        }
                    }
                },
                instrumentationHook: {
                    type: "boolean"
                },
                turbotrace: {
                    type: "object",
                    properties: {
                        logLevel: {
                            type: "string",
                            enum: [
                                "bug",
                                "fatal",
                                "error",
                                "warning",
                                "hint",
                                "note",
                                "suggestions",
                                "info"
                            ]
                        },
                        logAll: {
                            type: "boolean"
                        },
                        logDetail: {
                            type: "boolean"
                        },
                        contextDirectory: {
                            type: "string"
                        },
                        processCwd: {
                            type: "string"
                        },
                        memoryLimit: {
                            type: "integer"
                        }
                    }
                },
                logging: {
                    type: "string"
                },
                serverMinification: {
                    type: "boolean"
                },
                serverSourceMaps: {
                    type: "boolean"
                }
            },
            type: "object"
        },
        exportPathMap: {
            isFunction: true,
            errorMessage: "must be a function that returns a Promise"
        },
        generateBuildId: {
            isFunction: true,
            errorMessage: "must be a function that returns a Promise"
        },
        generateEtags: {
            type: "boolean"
        },
        headers: {
            isFunction: true,
            errorMessage: "must be a function that returns a Promise"
        },
        httpAgentOptions: {
            additionalProperties: false,
            properties: {
                keepAlive: {
                    type: "boolean"
                }
            },
            type: "object"
        },
        i18n: {
            additionalProperties: false,
            nullable: true,
            properties: {
                defaultLocale: {
                    minLength: 1,
                    type: "string"
                },
                domains: {
                    items: {
                        additionalProperties: false,
                        properties: {
                            defaultLocale: {
                                minLength: 1,
                                type: "string"
                            },
                            domain: {
                                minLength: 1,
                                type: "string"
                            },
                            http: {
                                type: "boolean"
                            },
                            locales: {
                                items: {
                                    minLength: 1,
                                    type: "string"
                                },
                                type: "array"
                            }
                        },
                        type: "object"
                    },
                    type: "array"
                },
                localeDetection: {
                    type: "boolean"
                },
                locales: {
                    items: {
                        minLength: 1,
                        type: "string"
                    },
                    type: "array"
                }
            },
            type: "object"
        },
        images: {
            additionalProperties: false,
            nullable: true,
            properties: {
                remotePatterns: {
                    nullable: true,
                    items: {
                        additionalProperties: false,
                        properties: {
                            hostname: {
                                type: "string"
                            },
                            pathname: {
                                type: "string"
                            },
                            port: {
                                maxLength: 5,
                                type: "string"
                            },
                            protocol: {
                                // automatic typing doesn't like enum
                                enum: [
                                    "http",
                                    "https"
                                ],
                                type: "string"
                            }
                        },
                        required: [
                            "hostname"
                        ],
                        type: "object"
                    },
                    maxItems: 50,
                    type: "array"
                },
                unoptimized: {
                    type: "boolean"
                },
                contentSecurityPolicy: {
                    type: "string",
                    nullable: true
                },
                contentDispositionType: {
                    enum: [
                        "inline",
                        "attachment"
                    ],
                    type: "string",
                    nullable: true
                },
                dangerouslyAllowSVG: {
                    type: "boolean",
                    nullable: true
                },
                deviceSizes: {
                    items: {
                        type: "integer",
                        minimum: 1,
                        maximum: 10000
                    },
                    maxItems: 25,
                    type: "array",
                    nullable: true
                },
                disableStaticImages: {
                    type: "boolean",
                    nullable: true
                },
                domains: {
                    items: {
                        type: "string"
                    },
                    maxItems: 50,
                    type: "array",
                    nullable: true
                },
                formats: {
                    items: {
                        enum: [
                            "image/avif",
                            "image/webp"
                        ],
                        type: "string"
                    },
                    maxItems: 4,
                    type: "array",
                    nullable: true
                },
                imageSizes: {
                    items: {
                        type: "integer",
                        minimum: 1,
                        maximum: 10000
                    },
                    minItems: 0,
                    maxItems: 25,
                    type: "array",
                    nullable: true
                },
                loader: {
                    // automatic typing does not like enum
                    enum: VALID_LOADERS,
                    type: "string",
                    nullable: true
                },
                loaderFile: {
                    type: "string",
                    nullable: true
                },
                minimumCacheTTL: {
                    type: "integer",
                    minimum: 0,
                    nullable: true
                },
                path: {
                    type: "string",
                    nullable: true
                }
            },
            type: "object"
        },
        modularizeImports: {
            type: "object"
        },
        onDemandEntries: {
            additionalProperties: false,
            properties: {
                maxInactiveAge: {
                    type: "number"
                },
                pagesBufferLength: {
                    type: "number"
                }
            },
            type: "object"
        },
        optimizeFonts: {
            type: "boolean"
        },
        output: {
            // automatic typing doesn't like enum
            enum: [
                "standalone",
                "export"
            ],
            type: "string"
        },
        outputFileTracing: {
            type: "boolean"
        },
        pageExtensions: {
            minItems: 1,
            type: "array"
        },
        poweredByHeader: {
            type: "boolean"
        },
        productionBrowserSourceMaps: {
            type: "boolean"
        },
        publicRuntimeConfig: {
            type: "object"
        },
        reactProductionProfiling: {
            type: "boolean"
        },
        reactStrictMode: {
            type: "boolean"
        },
        redirects: {
            isFunction: true,
            errorMessage: "must be a function that returns a Promise"
        },
        rewrites: {
            isFunction: true,
            errorMessage: "must be a function that returns a Promise"
        },
        sassOptions: {
            type: "object"
        },
        serverRuntimeConfig: {
            type: "object"
        },
        skipMiddlewareUrlNormalize: {
            type: "boolean"
        },
        skipTrailingSlashRedirect: {
            type: "boolean"
        },
        staticPageGenerationTimeout: {
            type: "number"
        },
        swcMinify: {
            type: "boolean"
        },
        target: {
            type: "string"
        },
        trailingSlash: {
            type: "boolean"
        },
        transpilePackages: {
            items: {
                type: "string"
            },
            type: "array"
        },
        typescript: {
            additionalProperties: false,
            properties: {
                ignoreBuildErrors: {
                    type: "boolean"
                },
                tsconfigPath: {
                    minLength: 1,
                    type: "string"
                }
            },
            type: "object"
        },
        useFileSystemPublicRoutes: {
            type: "boolean"
        },
        webpack: {
            isFunction: true,
            errorMessage: "must be a function that returns a webpack configuration object"
        }
    }
};
// module.exports is used to get around an export bug with TypeScript
// and the Ajv automatic typing
module.exports = {
    configSchema
};

//# sourceMappingURL=config-schema.js.map