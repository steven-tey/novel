"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getCustomDocumentImageError", {
    enumerable: true,
    get: function() {
        return getCustomDocumentImageError;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getCustomDocumentImageError() {
    return `Images ${_chalk.default.bold("cannot")} be imported within ${_chalk.default.cyan("pages/_document.js")}. Please move image imports that need to be displayed on every page into ${_chalk.default.cyan("pages/_app.js")}.\nRead more: https://nextjs.org/docs/messages/custom-document-image-import`;
}

//# sourceMappingURL=messages.js.map