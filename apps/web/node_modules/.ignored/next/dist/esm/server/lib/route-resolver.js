import { join } from "path";
import { parse as parseStackTrace } from "next/dist/compiled/stacktrace-parser";
import { RouteKind } from "../future/route-kind";
import { DefaultRouteMatcherManager } from "../future/route-matcher-managers/default-route-matcher-manager";
import { getMiddlewareMatchers } from "../../build/analysis/get-page-static-info";
import { getMiddlewareRouteMatcher } from "../../shared/lib/router/utils/middleware-route-matcher";
import { CLIENT_STATIC_FILES_PATH, DEV_MIDDLEWARE_MANIFEST } from "../../shared/lib/constants";
class DevRouteMatcherManager extends DefaultRouteMatcherManager {
    constructor(hasPage){
        super();
        this.hasPage = hasPage;
    }
    async match(pathname) {
        if (await this.hasPage(pathname)) {
            return {
                definition: {
                    kind: RouteKind.PAGES,
                    page: "",
                    pathname,
                    filename: "",
                    bundlePath: ""
                },
                params: {}
            };
        }
        return null;
    }
    async test(pathname) {
        return await this.match(pathname) !== null;
    }
}
export async function makeResolver(dir, nextConfig, middleware, serverAddr) {
    var _middleware_files;
    const url = require("url");
    const { default: Router  } = require("../router");
    const { getPathMatch  } = require("../../shared/lib/router/utils/path-match");
    const { default: DevServer  } = require("../dev/next-dev-server");
    const { NodeNextRequest , NodeNextResponse  } = require("../base-http/node");
    const { default: loadCustomRoutes  } = require("../../lib/load-custom-routes");
    const routeResults = new WeakMap();
    class TurbopackDevServerProxy extends DevServer {
        // make sure static files are served by turbopack
        serveStatic() {
            return Promise.resolve();
        }
        // make turbopack handle errors
        async renderError(err, req) {
            if (err != null) {
                routeResults.set(req, {
                    type: "error",
                    error: {
                        name: err.name,
                        message: err.message,
                        stack: parseStackTrace(err.stack)
                    }
                });
            }
            return Promise.resolve();
        }
        // make turbopack handle 404s
        render404() {
            return Promise.resolve();
        }
    }
    const devServer = new TurbopackDevServerProxy({
        dir,
        conf: nextConfig,
        hostname: serverAddr.hostname || "localhost",
        port: serverAddr.port || 3000
    });
    await devServer.matchers.reload();
    // @ts-expect-error private
    devServer.setDevReady();
    // @ts-expect-error protected
    devServer.customRoutes = await loadCustomRoutes(nextConfig);
    if ((_middleware_files = middleware.files) == null ? void 0 : _middleware_files.length) {
        const matchers = middleware.matcher ? getMiddlewareMatchers(middleware.matcher, nextConfig) : [
            {
                regexp: ".*",
                originalSource: "/:path*"
            }
        ];
        // @ts-expect-error
        devServer.middleware = {
            page: "/",
            match: getMiddlewareRouteMatcher(matchers),
            matchers
        };
        const getEdgeFunctionInfo = (original)=>{
            return (params)=>{
                if (params.middleware) {
                    return {
                        name: "middleware",
                        paths: middleware.files.map((file)=>join(process.cwd(), file)),
                        wasm: [],
                        assets: []
                    };
                }
                return original(params);
            };
        };
        // @ts-expect-error protected
        devServer.getEdgeFunctionInfo = getEdgeFunctionInfo(// @ts-expect-error protected
        devServer.getEdgeFunctionInfo.bind(devServer));
        // @ts-expect-error protected
        devServer.hasMiddleware = ()=>true;
    }
    const routes = devServer.generateRoutes(true);
    // @ts-expect-error protected
    const catchAllMiddleware = devServer.generateCatchAllMiddlewareRoute(true);
    routes.matchers = new DevRouteMatcherManager(// @ts-expect-error internal method
    devServer.hasPage.bind(devServer));
    // @ts-expect-error protected
    const buildId = devServer.buildId;
    const router = new Router({
        ...routes,
        catchAllMiddleware,
        catchAllRoute: {
            match: getPathMatch("/:path*"),
            name: "catchall route",
            fn: async (req, res, _params, parsedUrl)=>{
                // clean up internal query values
                for (const key of Object.keys(parsedUrl.query || {})){
                    if (key.startsWith("_next")) {
                        delete parsedUrl.query[key];
                    }
                }
                routeResults.set(req, {
                    type: "rewrite",
                    url: url.format({
                        pathname: parsedUrl.pathname,
                        query: parsedUrl.query,
                        hash: parsedUrl.hash
                    }),
                    statusCode: 200,
                    headers: res.getHeaders()
                });
                return {
                    finished: true
                };
            }
        }
    });
    // @ts-expect-error internal field
    router.compiledRoutes = router.compiledRoutes.filter((route)=>{
        var _route_name;
        return route.type === "rewrite" || route.type === "redirect" || route.type === "header" || route.name === "catchall route" || route.name === "middleware catchall" || route.name === `_next/${CLIENT_STATIC_FILES_PATH}/${buildId}/${DEV_MIDDLEWARE_MANIFEST}` || ((_route_name = route.name) == null ? void 0 : _route_name.includes("check"));
    });
    return async function resolveRoute(_req, _res) {
        const req = new NodeNextRequest(_req);
        const res = new NodeNextResponse(_res);
        const parsedUrl = url.parse(req.url, true);
        // @ts-expect-error protected
        devServer.attachRequestMeta(req, parsedUrl);
        req._initUrl = req.url;
        await router.execute(req, res, parsedUrl);
        // If the headers are sent, then this was handled by middleware and there's
        // nothing for us to do.
        if (res.originalResponse.headersSent) {
            return;
        }
        // The response won't be used, but we need to close the request so that the
        // ClientResponse's promise will resolve. We signal that this response is
        // unneeded via the header.
        res.setHeader("x-nextjs-route-result", "1");
        res.send();
        // If we have a routeResult, then we hit the catchAllRoute during execution
        // and this is a rewrite request.
        const routeResult = routeResults.get(req);
        if (routeResult) {
            routeResults.delete(req);
            return routeResult;
        }
        // Finally, if the catchall didn't match, than this request is invalid
        // (maybe they're missing the basePath?)
        return {
            type: "none"
        };
    };
}

//# sourceMappingURL=route-resolver.js.map