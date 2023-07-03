"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    makeResolver: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return Router;
    },
    makeResolver: function() {
        return makeResolver;
    }
});
const _requestmeta = require("./request-meta");
const _isapiroute = require("../lib/is-api-route");
const _pathmatch = require("../shared/lib/router/utils/path-match");
const _preparedestination = require("../shared/lib/router/utils/prepare-destination");
const _removepathprefix = require("../shared/lib/router/utils/remove-path-prefix");
const _formatnextpathnameinfo = require("../shared/lib/router/utils/format-next-pathname-info");
const _getnextpathnameinfo = require("../shared/lib/router/utils/get-next-pathname-info");
const _removetrailingslash = require("../shared/lib/router/utils/remove-trailing-slash");
const _tracer = require("./lib/trace/tracer");
const _constants = require("./lib/trace/constants");
class Router {
    constructor({ headers =[] , fsRoutes =[] , rewrites ={
        beforeFiles: [],
        afterFiles: [],
        fallback: []
    } , redirects =[] , catchAllRoute , catchAllMiddleware =[] , matchers , useFileSystemPublicRoutes , nextConfig , i18nProvider  }){
        this.nextConfig = nextConfig;
        this.headers = headers;
        this.fsRoutes = [
            ...fsRoutes
        ];
        this.rewrites = rewrites;
        this.redirects = redirects;
        this.catchAllRoute = catchAllRoute;
        this.catchAllMiddleware = catchAllMiddleware;
        this.matchers = matchers;
        this.useFileSystemPublicRoutes = useFileSystemPublicRoutes;
        this.i18nProvider = i18nProvider;
        // Perform the initial route compilation.
        this.compiledRoutes = this.compileRoutes();
        this.needsRecompilation = false;
    }
    get basePath() {
        return this.nextConfig.basePath || "";
    }
    /**
   * True when the router has catch-all middleware routes configured.
   */ get hasMiddleware() {
        return this.catchAllMiddleware.length > 0;
    }
    setCatchallMiddleware(catchAllMiddleware) {
        this.catchAllMiddleware = catchAllMiddleware;
        this.needsRecompilation = true;
    }
    setRewrites(rewrites) {
        this.rewrites = rewrites;
        this.needsRecompilation = true;
    }
    addFsRoute(fsRoute) {
        // We use unshift so that we're sure the routes is defined before Next's
        // default routes.
        this.fsRoutes.unshift(fsRoute);
        this.needsRecompilation = true;
    }
    compileRoutes() {
        /*
        Desired routes order
        - headers
        - redirects
        - Check filesystem (including pages), if nothing found continue
        - User rewrites (checking filesystem and pages each match)
      */ const [middlewareCatchAllRoute] = this.catchAllMiddleware;
        return [
            ...middlewareCatchAllRoute ? this.fsRoutes.filter((route)=>route.name === "_next/data catchall").map((route)=>({
                    ...route,
                    name: "_next/data normalizing",
                    check: false
                })) : [],
            ...this.headers,
            ...this.redirects,
            ...this.useFileSystemPublicRoutes && middlewareCatchAllRoute ? [
                middlewareCatchAllRoute
            ] : [],
            ...this.rewrites.beforeFiles,
            ...this.fsRoutes,
            // We only check the catch-all route if public page routes hasn't been
            // disabled
            ...this.useFileSystemPublicRoutes ? [
                {
                    type: "route",
                    matchesLocale: true,
                    name: "page checker",
                    match: (0, _pathmatch.getPathMatch)("/:path*"),
                    fn: async (req, res, params, parsedUrl, upgradeHead)=>{
                        var _this_i18nProvider;
                        // Next.js performs all route matching without the trailing slash.
                        const pathname = (0, _removetrailingslash.removeTrailingSlash)(parsedUrl.pathname || "/");
                        // Normalize and detect the locale on the pathname.
                        const options = {
                            // We need to skip dynamic route matching because the next
                            // step we're processing the afterFiles rewrites which must
                            // not include dynamic matches.
                            skipDynamic: true,
                            i18n: (_this_i18nProvider = this.i18nProvider) == null ? void 0 : _this_i18nProvider.analyze(pathname)
                        };
                        // If the locale was inferred from the default, we should mark
                        // it in the match options.
                        if (options.i18n && parsedUrl.query.__nextInferredLocaleFromDefault) {
                            options.i18n.inferredFromDefault = true;
                        }
                        const match = await this.matchers.match(pathname, options);
                        if (!match) return {
                            finished: false
                        };
                        // Add the match so we can get it later.
                        (0, _requestmeta.addRequestMeta)(req, "_nextMatch", match);
                        return this.catchAllRoute.fn(req, res, params, parsedUrl, upgradeHead);
                    }
                }
            ] : [],
            ...this.rewrites.afterFiles,
            ...this.rewrites.fallback.length ? [
                {
                    type: "route",
                    name: "dynamic route/page check",
                    match: (0, _pathmatch.getPathMatch)("/:path*"),
                    fn: async (req, res, _params, parsedCheckerUrl, upgradeHead)=>{
                        return {
                            finished: await this.checkFsRoutes(req, res, parsedCheckerUrl, upgradeHead)
                        };
                    }
                },
                ...this.rewrites.fallback
            ] : [],
            // We only check the catch-all route if public page routes hasn't been
            // disabled
            ...this.useFileSystemPublicRoutes ? [
                this.catchAllRoute
            ] : []
        ].map((route)=>{
            if (route.fn) {
                return {
                    ...route,
                    fn: (0, _tracer.getTracer)().wrap(_constants.RouterSpan.executeRoute, {
                        attributes: {
                            "next.route": route.name
                        }
                    }, route.fn)
                };
            }
            return route;
        });
    }
    async checkFsRoutes(req, res, parsedUrl, upgradeHead) {
        var _this_i18nProvider;
        const fsPathname = (0, _removepathprefix.removePathPrefix)(parsedUrl.pathname, this.basePath);
        for (const route of this.fsRoutes){
            const params = route.match(fsPathname);
            if (!params) continue;
            const { finished  } = await route.fn(req, res, params, {
                ...parsedUrl,
                pathname: fsPathname
            });
            if (finished) {
                return true;
            }
        }
        // Normalize and detect the locale on the pathname.
        const options = {
            i18n: (_this_i18nProvider = this.i18nProvider) == null ? void 0 : _this_i18nProvider.analyze(fsPathname)
        };
        const match = await this.matchers.test(fsPathname, options);
        if (!match) return false;
        // Matched a page or dynamic route so render it using catchAllRoute
        const params = this.catchAllRoute.match(parsedUrl.pathname);
        if (!params) {
            throw new Error(`Invariant: could not match params, this is an internal error please open an issue.`);
        }
        const { finished  } = await this.catchAllRoute.fn(req, res, params, {
            ...parsedUrl,
            pathname: fsPathname,
            query: {
                ...parsedUrl.query,
                _nextBubbleNoFallback: "1"
            }
        }, upgradeHead);
        return finished;
    }
    async execute(req, res, parsedUrl, upgradeHead) {
        // Only recompile if the routes need to be recompiled, this should only
        // happen in development.
        if (this.needsRecompilation) {
            this.compiledRoutes = this.compileRoutes();
            this.needsRecompilation = false;
        }
        // Create a deep copy of the parsed URL.
        const parsedUrlUpdated = {
            ...parsedUrl,
            query: {
                ...parsedUrl.query
            }
        };
        // when x-invoke-path is specified we can short short circuit resolving
        // we only honor this header if we are inside of a render worker to
        // prevent external users coercing the routing path
        const matchedPath = req.headers["x-invoke-path"];
        let curRoutes = this.compiledRoutes;
        if (process.env.NEXT_RUNTIME !== "edge" && process.env.__NEXT_PRIVATE_RENDER_WORKER && matchedPath) {
            curRoutes = this.compiledRoutes.filter((r)=>{
                return r.name === "Catchall render" || r.name === "_next/data catchall";
            });
            const parsedMatchedPath = new URL(matchedPath || "/", "http://n");
            const pathnameInfo = (0, _getnextpathnameinfo.getNextPathnameInfo)(parsedMatchedPath.pathname, {
                nextConfig: this.nextConfig,
                parseData: false
            });
            if (pathnameInfo.locale) {
                parsedUrlUpdated.query.__nextLocale = pathnameInfo.locale;
            }
            if (parsedUrlUpdated.pathname !== parsedMatchedPath.pathname) {
                parsedUrlUpdated.pathname = parsedMatchedPath.pathname;
                (0, _requestmeta.addRequestMeta)(req, "_nextRewroteUrl", pathnameInfo.pathname);
                (0, _requestmeta.addRequestMeta)(req, "_nextDidRewrite", true);
            }
            for (const key of Object.keys(parsedUrlUpdated.query)){
                if (!key.startsWith("__next") && !key.startsWith("_next")) {
                    delete parsedUrlUpdated.query[key];
                }
            }
            const invokeQuery = req.headers["x-invoke-query"];
            if (typeof invokeQuery === "string") {
                Object.assign(parsedUrlUpdated.query, JSON.parse(decodeURIComponent(invokeQuery)));
            }
        }
        for (const route of curRoutes){
            var _this_nextConfig_i18n;
            // only process rewrites for upgrade request
            if (upgradeHead && route.type !== "rewrite") {
                continue;
            }
            const originalPathname = parsedUrlUpdated.pathname;
            const pathnameInfo = (0, _getnextpathnameinfo.getNextPathnameInfo)(originalPathname, {
                nextConfig: this.nextConfig,
                parseData: false
            });
            // If the request has a locale and the route is an api route that doesn't
            // support matching locales, skip the route.
            if (pathnameInfo.locale && !route.matchesLocaleAPIRoutes && (0, _isapiroute.isAPIRoute)(pathnameInfo.pathname)) {
                continue;
            }
            // Restore the `basePath` if the request had a `basePath`.
            if ((0, _requestmeta.getRequestMeta)(req, "_nextHadBasePath")) {
                pathnameInfo.basePath = this.basePath;
            }
            // Create a copy of the `basePath` so we can modify it for the next
            // request if the route doesn't match with the `basePath`.
            const basePath = pathnameInfo.basePath;
            if (!route.matchesBasePath) {
                pathnameInfo.basePath = undefined;
            }
            // Add the locale to the information if the route supports matching
            // locales and the locale is not present in the info.
            const locale = parsedUrlUpdated.query.__nextLocale;
            if (route.matchesLocale && locale && !pathnameInfo.locale) {
                pathnameInfo.locale = locale;
            }
            // If the route doesn't support matching locales and the locale is the
            // default locale then remove it from the info.
            if (!route.matchesLocale && pathnameInfo.locale === ((_this_nextConfig_i18n = this.nextConfig.i18n) == null ? void 0 : _this_nextConfig_i18n.defaultLocale) && pathnameInfo.locale) {
                pathnameInfo.locale = undefined;
            }
            // If the route doesn't support trailing slashes and the request had a
            // trailing slash then remove it from the info.
            if (route.matchesTrailingSlash && (0, _requestmeta.getRequestMeta)(req, "__nextHadTrailingSlash")) {
                pathnameInfo.trailingSlash = true;
            }
            // Construct a new pathname based on the info.
            const matchPathname = (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
                ignorePrefix: true,
                ...pathnameInfo
            });
            let params = route.match(matchPathname);
            if ((route.has || route.missing) && params) {
                const hasParams = (0, _preparedestination.matchHas)(req, parsedUrlUpdated.query, route.has, route.missing);
                if (hasParams) {
                    Object.assign(params, hasParams);
                } else {
                    params = false;
                }
            }
            // If it is a matcher that doesn't match the basePath (like the public
            // directory) but Next.js is configured to use a basePath that was
            // never there, we consider this an invalid match and keep routing.
            if (params && this.basePath && !route.matchesBasePath && !(0, _requestmeta.getRequestMeta)(req, "_nextDidRewrite") && !basePath) {
                continue;
            }
            if (params) {
                const isNextDataNormalizing = route.name === "_next/data normalizing";
                if (isNextDataNormalizing) {
                    (0, _requestmeta.addRequestMeta)(req, "_nextDataNormalizing", true);
                }
                parsedUrlUpdated.pathname = matchPathname;
                const result = await route.fn(req, res, params, parsedUrlUpdated, upgradeHead);
                if (isNextDataNormalizing) {
                    (0, _requestmeta.addRequestMeta)(req, "_nextDataNormalizing", false);
                }
                if (result.finished) {
                    return true;
                }
                // If the result includes a pathname then we need to update the
                // parsed url pathname to continue routing.
                if (result.pathname) {
                    parsedUrlUpdated.pathname = result.pathname;
                } else {
                    // since the fs route didn't finish routing we need to re-add the
                    // basePath to continue checking with the basePath present
                    parsedUrlUpdated.pathname = originalPathname;
                }
                // Copy over only internal query parameters from the original query and
                // merge with the result query.
                if (result.query) {
                    parsedUrlUpdated.query = {
                        ...(0, _requestmeta.getNextInternalQuery)(parsedUrlUpdated.query),
                        ...result.query
                    };
                }
                // check filesystem
                if (route.check && await this.checkFsRoutes(req, res, parsedUrlUpdated)) {
                    return true;
                }
            }
        }
        // All routes were tested, none were found.
        return false;
    }
}
let _makeResolver = ()=>{};
if (// ensure this isn't bundled for edge runtime
process.env.NEXT_RUNTIME !== "edge" && // only load if we are inside of the turbopack handler
process.argv.some((arg)=>arg.endsWith("router.js"))) {
    _makeResolver = require("./lib/route-resolver").makeResolver;
}
const makeResolver = _makeResolver;

//# sourceMappingURL=router.js.map