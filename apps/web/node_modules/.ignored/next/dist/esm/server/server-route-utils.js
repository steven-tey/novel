/* eslint-disable no-redeclare */ import { getRedirectStatus, modifyRouteRegex } from "../lib/redirect-status";
import { getPathMatch } from "../shared/lib/router/utils/path-match";
import { compileNonPath, prepareDestination } from "../shared/lib/router/utils/prepare-destination";
import { getRequestMeta } from "./request-meta";
import { stringify as stringifyQs } from "querystring";
import { format as formatUrl } from "url";
import { normalizeRepeatedSlashes } from "../shared/lib/utils";
export function getCustomRoute(params) {
    const { rule , type , restrictedRedirectPaths  } = params;
    const match = getPathMatch(rule.source, {
        strict: true,
        removeUnnamedParams: true,
        regexModifier: !rule.internal ? (regex)=>modifyRouteRegex(regex, type === "redirect" ? restrictedRedirectPaths : undefined) : undefined,
        sensitive: params.caseSensitive
    });
    return {
        ...rule,
        type,
        match,
        name: type,
        fn: async (_req, _res, _params, _parsedUrl)=>({
                finished: false
            })
    };
}
export const createHeaderRoute = ({ rule , restrictedRedirectPaths , caseSensitive  })=>{
    const headerRoute = getCustomRoute({
        type: "header",
        rule,
        restrictedRedirectPaths,
        caseSensitive
    });
    return {
        match: headerRoute.match,
        matchesBasePath: true,
        matchesLocale: true,
        matchesLocaleAPIRoutes: true,
        matchesTrailingSlash: true,
        has: headerRoute.has,
        missing: headerRoute.missing,
        type: headerRoute.type,
        name: `${headerRoute.type} ${headerRoute.source} header route`,
        fn: async (_req, res, params, _parsedUrl)=>{
            const hasParams = Object.keys(params).length > 0;
            for (const header of headerRoute.headers){
                let { key , value  } = header;
                if (hasParams) {
                    key = compileNonPath(key, params);
                    value = compileNonPath(value, params);
                }
                if (key.toLowerCase() === "set-cookie") {
                    res.appendHeader(key, value);
                } else {
                    res.setHeader(key, value);
                }
            }
            return {
                finished: false
            };
        }
    };
};
// since initial query values are decoded by querystring.parse
// we need to re-encode them here but still allow passing through
// values from rewrites/redirects
export const stringifyQuery = (req, query)=>{
    const initialQuery = getRequestMeta(req, "__NEXT_INIT_QUERY") || {};
    const initialQueryValues = Object.values(initialQuery);
    return stringifyQs(query, undefined, undefined, {
        encodeURIComponent (value) {
            if (value in initialQuery || initialQueryValues.some((initialQueryVal)=>{
                // `value` always refers to a query value, even if it's nested in an array
                return Array.isArray(initialQueryVal) ? initialQueryVal.includes(value) : initialQueryVal === value;
            })) {
                // Encode keys and values from initial query
                return encodeURIComponent(value);
            }
            return value;
        }
    });
};
export const createRedirectRoute = ({ rule , restrictedRedirectPaths , caseSensitive  })=>{
    const redirectRoute = getCustomRoute({
        type: "redirect",
        rule,
        restrictedRedirectPaths,
        caseSensitive
    });
    return {
        internal: redirectRoute.internal,
        type: redirectRoute.type,
        match: redirectRoute.match,
        matchesBasePath: true,
        matchesLocale: redirectRoute.internal ? undefined : true,
        matchesLocaleAPIRoutes: true,
        matchesTrailingSlash: true,
        has: redirectRoute.has,
        missing: redirectRoute.missing,
        statusCode: redirectRoute.statusCode,
        name: `Redirect route ${redirectRoute.source}`,
        fn: async (req, res, params, parsedUrl)=>{
            const { parsedDestination  } = prepareDestination({
                appendParamsToQuery: false,
                destination: redirectRoute.destination,
                params: params,
                query: parsedUrl.query
            });
            const { query  } = parsedDestination;
            delete parsedDestination.query;
            parsedDestination.search = stringifyQuery(req, query);
            let updatedDestination = formatUrl(parsedDestination);
            if (updatedDestination.startsWith("/")) {
                updatedDestination = normalizeRepeatedSlashes(updatedDestination);
            }
            res.redirect(updatedDestination, getRedirectStatus(redirectRoute)).body(updatedDestination).send();
            return {
                finished: true
            };
        }
    };
};

//# sourceMappingURL=server-route-utils.js.map