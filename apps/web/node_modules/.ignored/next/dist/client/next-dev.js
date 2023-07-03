// TODO: Remove use of `any` type.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _ = require("./");
const _ondemandentriesclient = /*#__PURE__*/ _interop_require_default._(require("./dev/on-demand-entries-client"));
const _webpackhotmiddlewareclient = /*#__PURE__*/ _interop_require_default._(require("./dev/webpack-hot-middleware-client"));
const _devbuildwatcher = /*#__PURE__*/ _interop_require_default._(require("./dev/dev-build-watcher"));
const _fouc = require("./dev/fouc");
const _websocket = require("./dev/error-overlay/websocket");
const _querystring = require("../shared/lib/router/utils/querystring");
if (!window._nextSetupHydrationWarning) {
    const origConsoleError = window.console.error;
    window.console.error = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        const isHydrateError = args.some((arg)=>typeof arg === "string" && arg.match(/(hydration|content does not match|did not match)/i));
        if (isHydrateError) {
            args = [
                ...args,
                "\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error"
            ];
        }
        origConsoleError.apply(window.console, args);
    };
    window._nextSetupHydrationWarning = true;
}
window.next = {
    version: _.version,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
const webpackHMR = (0, _webpackhotmiddlewareclient.default)();
(0, _.initialize)({
    webpackHMR
}).then((param)=>{
    let { assetPrefix  } = param;
    (0, _websocket.connectHMR)({
        assetPrefix,
        path: "/_next/webpack-hmr"
    });
    return (0, _.hydrate)({
        beforeRender: _fouc.displayContent
    }).then(()=>{
        (0, _ondemandentriesclient.default)();
        let buildIndicatorHandler = ()=>{};
        function devPagesHmrListener(event) {
            let payload;
            try {
                payload = JSON.parse(event.data);
            } catch (e) {}
            if (payload.event === "server-error" && payload.errorJSON) {
                const { stack , message  } = JSON.parse(payload.errorJSON);
                const error = new Error(message);
                error.stack = stack;
                throw error;
            } else if (payload.action === "reloadPage") {
                window.location.reload();
            } else if (payload.action === "devPagesManifestUpdate") {
                fetch("" + assetPrefix + "/_next/static/development/_devPagesManifest.json").then((res)=>res.json()).then((manifest)=>{
                    window.__DEV_PAGES_MANIFEST = manifest;
                }).catch((err)=>{
                    console.log("Failed to fetch devPagesManifest", err);
                });
            } else if (payload.event === "middlewareChanges") {
                return window.location.reload();
            } else if (payload.event === "serverOnlyChanges") {
                const { pages  } = payload;
                // Make sure to reload when the dev-overlay is showing for an
                // API route
                if (pages.includes(_.router.query.__NEXT_PAGE)) {
                    return window.location.reload();
                }
                if (!_.router.clc && pages.includes(_.router.pathname)) {
                    console.log("Refreshing page data due to server-side change");
                    buildIndicatorHandler("building");
                    const clearIndicator = ()=>buildIndicatorHandler("built");
                    _.router.replace(_.router.pathname + "?" + String((0, _querystring.assign)((0, _querystring.urlQueryToSearchParams)(_.router.query), new URLSearchParams(location.search))), _.router.asPath, {
                        scroll: false
                    }).catch(()=>{
                        // trigger hard reload when failing to refresh data
                        // to show error overlay properly
                        location.reload();
                    }).finally(clearIndicator);
                }
            }
        }
        (0, _websocket.addMessageListener)(devPagesHmrListener);
        if (process.env.__NEXT_BUILD_INDICATOR) {
            (0, _devbuildwatcher.default)((handler)=>{
                buildIndicatorHandler = handler;
            }, process.env.__NEXT_BUILD_INDICATOR_POSITION);
        }
    });
}).catch((err)=>{
    console.error("Error was not caught", err);
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=next-dev.js.map