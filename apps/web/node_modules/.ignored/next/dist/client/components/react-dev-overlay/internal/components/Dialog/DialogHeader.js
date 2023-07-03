"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DialogHeader", {
    enumerable: true,
    get: function() {
        return DialogHeader;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const DialogHeader = function DialogHeader(param) {
    let { children , className  } = param;
    return /*#__PURE__*/ _react.createElement("div", {
        "data-nextjs-dialog-header": true,
        className: className
    }, children);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=DialogHeader.js.map