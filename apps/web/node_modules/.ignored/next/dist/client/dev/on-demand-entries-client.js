"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _router = /*#__PURE__*/ _interop_require_default._(require("../router"));
const _websocket = require("./error-overlay/websocket");
const _default = async (page)=>{
    if (page) {
        // in AMP the router isn't initialized on the client and
        // client-transitions don't occur so ping initial page
        setInterval(()=>{
            (0, _websocket.sendMessage)(JSON.stringify({
                event: "ping",
                page
            }));
        }, 2500);
    } else {
        _router.default.ready(()=>{
            setInterval(()=>{
                // when notFound: true is returned we should use the notFoundPage
                // as the Router.pathname will point to the 404 page but we want
                // to ping the source page that returned notFound: true instead
                const notFoundSrcPage = self.__NEXT_DATA__.notFoundSrcPage;
                const pathname = (_router.default.pathname === "/404" || _router.default.pathname === "/_error") && notFoundSrcPage ? notFoundSrcPage : _router.default.pathname;
                (0, _websocket.sendMessage)(JSON.stringify({
                    event: "ping",
                    page: pathname
                }));
            }, 2500);
        });
    }
    (0, _websocket.addMessageListener)((event)=>{
        if (!event.data.includes("{")) return;
        try {
            const payload = JSON.parse(event.data);
            // don't attempt fetching the page if we're already showing
            // the dev overlay as this can cause the error to be triggered
            // repeatedly
            if (payload.event === "pong" && payload.invalid && !self.__NEXT_DATA__.err) {
                // Payload can be invalid even if the page does exist.
                // So, we check if it can be created.
                fetch(location.href, {
                    credentials: "same-origin"
                }).then((pageRes)=>{
                    if (pageRes.status === 200) {
                        // Page exists now, reload
                        location.reload();
                    } else {
                        // Page doesn't exist
                        if (self.__NEXT_DATA__.page === _router.default.pathname && _router.default.pathname !== "/_error") {
                            // We are still on the page,
                            // reload to show 404 error page
                            location.reload();
                        }
                    }
                });
            }
        } catch (err) {
            console.error("on-demand-entries failed to parse response", err);
        }
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=on-demand-entries-client.js.map