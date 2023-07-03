"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "exportPage", {
    enumerable: true,
    get: function() {
        return _worker.default;
    }
});
0 && __export(require("./utils"));
require("../server/require-hook");
_export_star(require("./utils"), exports);
const _worker = /*#__PURE__*/ _interop_require_default(require("../export/worker"));
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=worker.js.map