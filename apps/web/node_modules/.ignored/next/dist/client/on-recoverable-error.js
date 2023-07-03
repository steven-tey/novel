"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return onRecoverableError;
    }
});
const _nossrerror = require("../shared/lib/lazy-dynamic/no-ssr-error");
function onRecoverableError(err) {
    // Using default react onRecoverableError
    // x-ref: https://github.com/facebook/react/blob/d4bc16a7d69eb2ea38a88c8ac0b461d5f72cdcab/packages/react-dom/src/client/ReactDOMRoot.js#L83
    const defaultOnRecoverableError = typeof reportError === "function" ? // emulating an uncaught JavaScript error.
    reportError : (error)=>{
        window.console.error(error);
    };
    // Skip certain custom errors which are not expected to be reported on client
    if (err.digest === _nossrerror.NEXT_DYNAMIC_NO_SSR_CODE) return;
    defaultOnRecoverableError(err);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=on-recoverable-error.js.map