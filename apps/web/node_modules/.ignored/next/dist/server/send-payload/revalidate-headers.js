"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setRevalidateHeaders", {
    enumerable: true,
    get: function() {
        return setRevalidateHeaders;
    }
});
function setRevalidateHeaders(res, options) {
    if (options.private || options.stateful) {
        if (options.private || !res.getHeader("Cache-Control")) {
            res.setHeader("Cache-Control", `private, no-cache, no-store, max-age=0, must-revalidate`);
        }
    } else if (typeof options.revalidate === "number") {
        if (options.revalidate < 1) {
            throw new Error(`invariant: invalid Cache-Control duration provided: ${options.revalidate} < 1`);
        }
        res.setHeader("Cache-Control", `s-maxage=${options.revalidate}, stale-while-revalidate`);
    } else if (options.revalidate === false) {
        res.setHeader("Cache-Control", `s-maxage=31536000, stale-while-revalidate`);
    }
}

//# sourceMappingURL=revalidate-headers.js.map