"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateInterceptionRoutesRewrites", {
    enumerable: true,
    get: function() {
        return generateInterceptionRoutesRewrites;
    }
});
const _pathtoregexp = require("next/dist/compiled/path-to-regexp");
const _approuterheaders = require("../client/components/app-router-headers");
const _interceptionroutes = require("../server/future/helpers/interception-routes");
// a function that converts normalised paths (e.g. /foo/[bar]/[baz]) to the format expected by pathToRegexp (e.g. /foo/:bar/:baz)
function toPathToRegexpPath(path) {
    return path.replace(/\[\[?([^\]]+)\]\]?/g, (_, capture)=>{
        // handle catch-all segments (e.g. /foo/bar/[...baz] or /foo/bar/[[...baz]])
        if (capture.startsWith("...")) {
            return `:${capture.slice(3)}*`;
        }
        return ":" + capture;
    });
}
// for interception routes we don't have access to the dynamic segments from the
// referrer route so we mark them as noop for the app renderer so that it
// can retrieve them from the router state later on. This also allows us to
// compile the route properly with path-to-regexp, otherwise it will throw
function voidParamsBeforeInterceptionMarker(path) {
    let newPath = [];
    let foundInterceptionMarker = false;
    for (const segment of path.split("/")){
        if (_interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((marker)=>segment.startsWith(marker))) {
            foundInterceptionMarker = true;
        }
        if (segment.startsWith(":") && !foundInterceptionMarker) {
            newPath.push("__NEXT_EMPTY_PARAM__");
        } else {
            newPath.push(segment);
        }
    }
    return newPath.join("/");
}
function generateInterceptionRoutesRewrites(appPaths) {
    const rewrites = [];
    for (const appPath of appPaths){
        if ((0, _interceptionroutes.isInterceptionRouteAppPath)(appPath)) {
            const { interceptingRoute , interceptedRoute  } = (0, _interceptionroutes.extractInterceptionRouteInformation)(appPath);
            const normalizedInterceptingRoute = `${interceptingRoute !== "/" ? toPathToRegexpPath(interceptingRoute) : ""}/(.*)?`;
            const normalizedInterceptedRoute = toPathToRegexpPath(interceptedRoute);
            const normalizedAppPath = voidParamsBeforeInterceptionMarker(toPathToRegexpPath(appPath));
            // pathToRegexp returns a regex that matches the path, but we need to
            // convert it to a string that can be used in a header value
            // to the format that Next/the proxy expects
            let interceptingRouteRegex = (0, _pathtoregexp.pathToRegexp)(normalizedInterceptingRoute).toString().slice(2, -3);
            rewrites.push({
                source: normalizedInterceptedRoute,
                destination: normalizedAppPath,
                has: [
                    {
                        type: "header",
                        key: _approuterheaders.NEXT_URL,
                        value: interceptingRouteRegex
                    }
                ]
            });
        }
    }
    return rewrites;
}

//# sourceMappingURL=generate-interception-routes-rewrites.js.map