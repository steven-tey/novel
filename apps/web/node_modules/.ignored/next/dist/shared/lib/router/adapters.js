"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    adaptForAppRouterInstance: null,
    adaptForSearchParams: null,
    PathnameContextProviderAdapter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    adaptForAppRouterInstance: function() {
        return adaptForAppRouterInstance;
    },
    adaptForSearchParams: function() {
        return adaptForSearchParams;
    },
    PathnameContextProviderAdapter: function() {
        return PathnameContextProviderAdapter;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _hooksclientcontext = require("../hooks-client-context");
const _utils = require("./utils");
function adaptForAppRouterInstance(router) {
    return {
        back () {
            router.back();
        },
        forward () {
            router.forward();
        },
        refresh () {
            router.reload();
        },
        push (href) {
            void router.push(href);
        },
        replace (href) {
            void router.replace(href);
        },
        prefetch (href) {
            void router.prefetch(href);
        }
    };
}
/**
 * transforms the ParsedUrlQuery into a URLSearchParams.
 *
 * @param query the query to transform
 * @returns URLSearchParams
 */ function transformQuery(query) {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const val of value){
                params.append(name, val);
            }
        } else if (typeof value !== "undefined") {
            params.append(name, value);
        }
    }
    return params;
}
function adaptForSearchParams(router) {
    if (!router.isReady || !router.query) {
        return new URLSearchParams();
    }
    return transformQuery(router.query);
}
function PathnameContextProviderAdapter(param) {
    let { children , router , ...props } = param;
    const ref = (0, _react.useRef)(props.isAutoExport);
    const value = (0, _react.useMemo)(()=>{
        // isAutoExport is only ever `true` on the first render from the server,
        // so reset it to `false` after we read it for the first time as `true`. If
        // we don't use the value, then we don't need it.
        const isAutoExport = ref.current;
        if (isAutoExport) {
            ref.current = false;
        }
        // When the route is a dynamic route, we need to do more processing to
        // determine if we need to stop showing the pathname.
        if ((0, _utils.isDynamicRoute)(router.pathname)) {
            // When the router is rendering the fallback page, it can't possibly know
            // the path, so return `null` here. Read more about fallback pages over
            // at:
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-pages
            if (router.isFallback) {
                return null;
            }
            // When `isAutoExport` is true, meaning this is a page page has been
            // automatically statically optimized, and the router is not ready, then
            // we can't know the pathname yet. Read more about automatic static
            // optimization at:
            // https://nextjs.org/docs/advanced-features/automatic-static-optimization
            if (isAutoExport && !router.isReady) {
                return null;
            }
        }
        // The `router.asPath` contains the pathname seen by the browser (including
        // any query strings), so it should have that stripped. Read more about the
        // `asPath` option over at:
        // https://nextjs.org/docs/api-reference/next/router#router-object
        let url;
        try {
            url = new URL(router.asPath, "http://f");
        } catch (_) {
            // fallback to / for invalid asPath values e.g. //
            return "/";
        }
        return url.pathname;
    }, [
        router.asPath,
        router.isFallback,
        router.isReady,
        router.pathname
    ]);
    return /*#__PURE__*/ _react.default.createElement(_hooksclientcontext.PathnameContext.Provider, {
        value: value
    }, children);
}

//# sourceMappingURL=adapters.js.map