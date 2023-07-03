"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouter", {
    enumerable: true,
    get: function() {
        return useRouter;
    }
});
const _react = require("react");
const _routercontext = require("../../shared/lib/router-context");
function useRouter() {
    return (0, _react.useContext)(_routercontext.RouterContext);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=router.js.map