import { promises as fs } from "fs";
import LRUCache from "next/dist/compiled/lru-cache";
import { matcher } from "next/dist/compiled/micromatch";
import { extractExportedConstValue, UnsupportedValueError } from "./extract-const-value";
import { parseModule } from "./parse-module";
import * as Log from "../output/log";
import { SERVER_RUNTIME } from "../../lib/constants";
import { checkCustomRoutes } from "../../lib/load-custom-routes";
import { tryToParsePath } from "../../lib/try-to-parse-path";
import { isAPIRoute } from "../../lib/is-api-route";
import { isEdgeRuntime } from "../../lib/is-edge-runtime";
import { RSC_MODULE_TYPES } from "../../shared/lib/constants";
// TODO: migrate preferredRegion here
// Don't forget to update the next-types-plugin file as well
const AUTHORIZED_EXTRA_PROPS = [
    "maxDuration"
];
const CLIENT_MODULE_LABEL = /\/\* __next_internal_client_entry_do_not_use__ ([^ ]*) (cjs|auto) \*\//;
const ACTION_MODULE_LABEL = /\/\* __next_internal_action_entry_do_not_use__ ([^ ]+) \*\//;
export function getRSCModuleInformation(source, isServerLayer = true) {
    var _source_match, _source_match_, _clientInfoMatch_;
    const actions = (_source_match = source.match(ACTION_MODULE_LABEL)) == null ? void 0 : (_source_match_ = _source_match[1]) == null ? void 0 : _source_match_.split(",");
    const clientInfoMatch = source.match(CLIENT_MODULE_LABEL);
    const isClientRef = !!clientInfoMatch;
    if (!isServerLayer) {
        return {
            type: RSC_MODULE_TYPES.client,
            actions,
            isClientRef
        };
    }
    const clientRefs = clientInfoMatch == null ? void 0 : (_clientInfoMatch_ = clientInfoMatch[1]) == null ? void 0 : _clientInfoMatch_.split(",");
    const clientEntryType = clientInfoMatch == null ? void 0 : clientInfoMatch[2];
    const type = clientRefs ? RSC_MODULE_TYPES.client : RSC_MODULE_TYPES.server;
    return {
        type,
        actions,
        clientRefs,
        clientEntryType,
        isClientRef
    };
}
/**
 * Receives a parsed AST from SWC and checks if it belongs to a module that
 * requires a runtime to be specified. Those are:
 *   - Modules with `export function getStaticProps | getServerSideProps`
 *   - Modules with `export { getStaticProps | getServerSideProps } <from ...>`
 *   - Modules with `export const runtime = ...`
 */ function checkExports(swcAST) {
    const exportsSet = new Set([
        "getStaticProps",
        "getServerSideProps",
        "generateImageMetadata",
        "generateSitemaps"
    ]);
    if (Array.isArray(swcAST == null ? void 0 : swcAST.body)) {
        try {
            let runtime;
            let preferredRegion;
            let ssr = false;
            let ssg = false;
            let generateImageMetadata = false;
            let generateSitemaps = false;
            let extraProperties = new Set();
            for (const node of swcAST.body){
                var _node_declaration, _node_declaration1, _node_declaration_identifier, _node_declaration2;
                if (node.type === "ExportDeclaration" && ((_node_declaration = node.declaration) == null ? void 0 : _node_declaration.type) === "VariableDeclaration") {
                    var _node_declaration3;
                    for (const declaration of (_node_declaration3 = node.declaration) == null ? void 0 : _node_declaration3.declarations){
                        if (declaration.id.value === "runtime") {
                            runtime = declaration.init.value;
                        } else if (declaration.id.value === "preferredRegion") {
                            if (declaration.init.type === "ArrayExpression") {
                                const elements = [];
                                for (const element of declaration.init.elements){
                                    const { expression  } = element;
                                    if (expression.type !== "StringLiteral") {
                                        continue;
                                    }
                                    elements.push(expression.value);
                                }
                                preferredRegion = elements;
                            } else {
                                preferredRegion = declaration.init.value;
                            }
                        } else {
                            extraProperties.add(declaration.id.value);
                        }
                    }
                }
                if (node.type === "ExportDeclaration" && ((_node_declaration1 = node.declaration) == null ? void 0 : _node_declaration1.type) === "FunctionDeclaration" && exportsSet.has((_node_declaration_identifier = node.declaration.identifier) == null ? void 0 : _node_declaration_identifier.value)) {
                    const id = node.declaration.identifier.value;
                    ssg = id === "getStaticProps";
                    ssr = id === "getServerSideProps";
                    generateImageMetadata = id === "generateImageMetadata";
                    generateSitemaps = id === "generateSitemaps";
                }
                if (node.type === "ExportDeclaration" && ((_node_declaration2 = node.declaration) == null ? void 0 : _node_declaration2.type) === "VariableDeclaration") {
                    var _node_declaration_declarations_, _node_declaration4;
                    const id = (_node_declaration_declarations_ = (_node_declaration4 = node.declaration) == null ? void 0 : _node_declaration4.declarations[0]) == null ? void 0 : _node_declaration_declarations_.id.value;
                    if (exportsSet.has(id)) {
                        ssg = id === "getStaticProps";
                        ssr = id === "getServerSideProps";
                        generateImageMetadata = id === "generateImageMetadata";
                        generateSitemaps = id === "generateSitemaps";
                    }
                }
                if (node.type === "ExportNamedDeclaration") {
                    const values = node.specifiers.map((specifier)=>{
                        var _specifier_orig, _specifier_orig1;
                        return specifier.type === "ExportSpecifier" && ((_specifier_orig = specifier.orig) == null ? void 0 : _specifier_orig.type) === "Identifier" && ((_specifier_orig1 = specifier.orig) == null ? void 0 : _specifier_orig1.value);
                    });
                    for (const value of values){
                        if (!ssg && value === "getStaticProps") ssg = true;
                        if (!ssr && value === "getServerSideProps") ssr = true;
                        if (!generateImageMetadata && value === "generateImageMetadata") generateImageMetadata = true;
                        if (!generateSitemaps && value === "generateSitemaps") generateSitemaps = true;
                    }
                }
            }
            return {
                ssr,
                ssg,
                runtime,
                preferredRegion,
                generateImageMetadata,
                generateSitemaps,
                extraProperties
            };
        } catch (err) {}
    }
    return {
        ssg: false,
        ssr: false,
        runtime: undefined,
        preferredRegion: undefined,
        generateImageMetadata: false,
        generateSitemaps: false,
        extraProperties: undefined
    };
}
async function tryToReadFile(filePath, shouldThrow) {
    try {
        return await fs.readFile(filePath, {
            encoding: "utf8"
        });
    } catch (error) {
        if (shouldThrow) {
            throw error;
        }
    }
}
export function getMiddlewareMatchers(matcherOrMatchers, nextConfig) {
    let matchers = [];
    if (Array.isArray(matcherOrMatchers)) {
        matchers = matcherOrMatchers;
    } else {
        matchers.push(matcherOrMatchers);
    }
    const { i18n  } = nextConfig;
    const originalSourceMap = new Map();
    let routes = matchers.map((m)=>{
        let middleware = typeof m === "string" ? {
            source: m
        } : m;
        if (middleware) {
            originalSourceMap.set(middleware, middleware.source);
        }
        return middleware;
    });
    // check before we process the routes and after to ensure
    // they are still valid
    checkCustomRoutes(routes, "middleware");
    routes = routes.map((r)=>{
        let { source  } = r;
        const isRoot = source === "/";
        if ((i18n == null ? void 0 : i18n.locales) && r.locale !== false) {
            source = `/:nextInternalLocale((?!_next/)[^/.]{1,})${isRoot ? "" : source}`;
        }
        source = `/:nextData(_next/data/[^/]{1,})?${source}${isRoot ? `(${nextConfig.i18n ? "|\\.json|" : ""}/?index|/?index\\.json)?` : "(.json)?"}`;
        if (nextConfig.basePath) {
            source = `${nextConfig.basePath}${source}`;
        }
        r.source = source;
        return r;
    });
    checkCustomRoutes(routes, "middleware");
    return routes.map((r)=>{
        const { source , ...rest } = r;
        const parsedPage = tryToParsePath(source);
        if (parsedPage.error || !parsedPage.regexStr) {
            throw new Error(`Invalid source: ${source}`);
        }
        const originalSource = originalSourceMap.get(r);
        return {
            ...rest,
            regexp: parsedPage.regexStr,
            originalSource: originalSource || source
        };
    });
}
function getMiddlewareConfig(pageFilePath, config, nextConfig) {
    const result = {};
    if (config.matcher) {
        result.matchers = getMiddlewareMatchers(config.matcher, nextConfig);
    }
    if (typeof config.regions === "string" || Array.isArray(config.regions)) {
        result.regions = config.regions;
    } else if (typeof config.regions !== "undefined") {
        Log.warn(`The \`regions\` config was ignored: config must be empty, a string or an array of strings. (${pageFilePath})`);
    }
    if (config.unstable_allowDynamic) {
        result.unstable_allowDynamicGlobs = Array.isArray(config.unstable_allowDynamic) ? config.unstable_allowDynamic : [
            config.unstable_allowDynamic
        ];
        for (const glob of result.unstable_allowDynamicGlobs ?? []){
            try {
                matcher(glob);
            } catch (err) {
                throw new Error(`${pageFilePath} exported 'config.unstable_allowDynamic' contains invalid pattern '${glob}': ${err.message}`);
            }
        }
    }
    return result;
}
const apiRouteWarnings = new LRUCache({
    max: 250
});
function warnAboutExperimentalEdge(apiRoute) {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PRIVATE_BUILD_WORKER === "1") {
        return;
    }
    if (apiRouteWarnings.has(apiRoute)) {
        return;
    }
    Log.warn(apiRoute ? `${apiRoute} provided runtime 'experimental-edge'. It can be updated to 'edge' instead.` : `You are using an experimental edge runtime, the API might change.`);
    apiRouteWarnings.set(apiRoute, 1);
}
const warnedUnsupportedValueMap = new Map();
function warnAboutUnsupportedValue(pageFilePath, page, error) {
    if (warnedUnsupportedValueMap.has(pageFilePath)) {
        return;
    }
    Log.warn(`Next.js can't recognize the exported \`config\` field in ` + (page ? `route "${page}"` : `"${pageFilePath}"`) + ":\n" + error.message + (error.path ? ` at "${error.path}"` : "") + ".\n" + "The default config will be used instead.\n" + "Read More - https://nextjs.org/docs/messages/invalid-page-config");
    warnedUnsupportedValueMap.set(pageFilePath, true);
}
// Detect if metadata routes is a dynamic route, which containing
// generateImageMetadata or generateSitemaps as export
export async function isDynamicMetadataRoute(pageFilePath) {
    const fileContent = await tryToReadFile(pageFilePath, true) || "";
    if (!/generateImageMetadata|generateSitemaps/.test(fileContent)) return false;
    const swcAST = await parseModule(pageFilePath, fileContent);
    const exportsInfo = checkExports(swcAST);
    return !exportsInfo.generateImageMetadata || !exportsInfo.generateSitemaps;
}
/**
 * For a given pageFilePath and nextConfig, if the config supports it, this
 * function will read the file and return the runtime that should be used.
 * It will look into the file content only if the page *requires* a runtime
 * to be specified, that is, when gSSP or gSP is used.
 * Related discussion: https://github.com/vercel/next.js/discussions/34179
 */ export async function getPageStaticInfo(params) {
    const { isDev , pageFilePath , nextConfig , page , pageType  } = params;
    const fileContent = await tryToReadFile(pageFilePath, !isDev) || "";
    if (/runtime|preferredRegion|getStaticProps|getServerSideProps|export const/.test(fileContent)) {
        const swcAST = await parseModule(pageFilePath, fileContent);
        const { ssg , ssr , runtime , preferredRegion , extraProperties  } = checkExports(swcAST);
        const rsc = getRSCModuleInformation(fileContent).type;
        // default / failsafe value for config
        let config;
        try {
            config = extractExportedConstValue(swcAST, "config");
        } catch (e) {
            if (e instanceof UnsupportedValueError) {
                warnAboutUnsupportedValue(pageFilePath, page, e);
            }
        // `export config` doesn't exist, or other unknown error throw by swc, silence them
        }
        let extraConfig;
        if (extraProperties) {
            extraConfig = {};
            for (const prop of extraProperties){
                if (!AUTHORIZED_EXTRA_PROPS.includes(prop)) continue;
                try {
                    extraConfig[prop] = extractExportedConstValue(swcAST, prop);
                } catch (e) {
                    if (e instanceof UnsupportedValueError) {
                        warnAboutUnsupportedValue(pageFilePath, page, e);
                    }
                }
            }
        }
        if (pageType === "app") {
            if (config) {
                const message = `\`export const config\` in ${pageFilePath} is deprecated. Please change \`runtime\` property to segment export config. See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config`;
                if (isDev) {
                    Log.warnOnce(message);
                } else {
                    throw new Error(message);
                }
                config = {};
            }
        }
        if (!config) config = {};
        // We use `export const config = { runtime: '...' }` to specify the page runtime for pages/.
        // In the new app directory, we prefer to use `export const runtime = '...'`
        // and deprecate the old way. To prevent breaking changes for `pages`, we use the exported config
        // as the fallback value.
        let resolvedRuntime;
        if (pageType === "app") {
            resolvedRuntime = runtime;
        } else {
            resolvedRuntime = runtime || config.runtime;
        }
        if (typeof resolvedRuntime !== "undefined" && resolvedRuntime !== SERVER_RUNTIME.nodejs && !isEdgeRuntime(resolvedRuntime)) {
            const options = Object.values(SERVER_RUNTIME).join(", ");
            const message = typeof resolvedRuntime !== "string" ? `The \`runtime\` config must be a string. Please leave it empty or choose one of: ${options}` : `Provided runtime "${resolvedRuntime}" is not supported. Please leave it empty or choose one of: ${options}`;
            if (isDev) {
                Log.error(message);
            } else {
                throw new Error(message);
            }
        }
        const requiresServerRuntime = ssr || ssg || pageType === "app";
        const isAnAPIRoute = isAPIRoute(page == null ? void 0 : page.replace(/^(?:\/src)?\/pages\//, "/"));
        resolvedRuntime = isEdgeRuntime(resolvedRuntime) || requiresServerRuntime ? resolvedRuntime : undefined;
        if (resolvedRuntime === SERVER_RUNTIME.experimentalEdge) {
            warnAboutExperimentalEdge(isAnAPIRoute ? page : null);
        }
        if (resolvedRuntime === SERVER_RUNTIME.edge && pageType === "pages" && page && !isAnAPIRoute) {
            const message = `Page ${page} provided runtime 'edge', the edge runtime for rendering is currently experimental. Use runtime 'experimental-edge' instead.`;
            if (isDev) {
                Log.error(message);
            } else {
                throw new Error(message);
            }
        }
        const middlewareConfig = getMiddlewareConfig(page ?? "middleware/edge API route", config, nextConfig);
        return {
            ssr,
            ssg,
            rsc,
            amp: config.amp || false,
            ...middlewareConfig && {
                middleware: middlewareConfig
            },
            ...resolvedRuntime && {
                runtime: resolvedRuntime
            },
            preferredRegion,
            extraConfig
        };
    }
    return {
        ssr: false,
        ssg: false,
        rsc: RSC_MODULE_TYPES.server,
        amp: false,
        runtime: undefined
    };
}

//# sourceMappingURL=get-page-static-info.js.map