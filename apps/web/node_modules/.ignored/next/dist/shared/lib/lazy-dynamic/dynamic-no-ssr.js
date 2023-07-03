"use client";
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    suspense: null,
    NoSSR: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    suspense: function() {
        return suspense;
    },
    NoSSR: function() {
        return NoSSR;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _nossrerror = require("./no-ssr-error");

function suspense() {
    const error = new Error(_nossrerror.NEXT_DYNAMIC_NO_SSR_CODE);
    error.digest = _nossrerror.NEXT_DYNAMIC_NO_SSR_CODE;
    throw error;
}
function NoSSR(param) {
    let { children  } = param;
    if (typeof window === "undefined") {
        suspense();
    }
    return children;
}

//# sourceMappingURL=dynamic-no-ssr.js.map