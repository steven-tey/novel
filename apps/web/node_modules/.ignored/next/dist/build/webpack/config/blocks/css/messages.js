"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getGlobalImportError: null,
    getGlobalModuleImportError: null,
    getLocalModuleImportError: null,
    getCustomDocumentError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getGlobalImportError: function() {
        return getGlobalImportError;
    },
    getGlobalModuleImportError: function() {
        return getGlobalModuleImportError;
    },
    getLocalModuleImportError: function() {
        return getLocalModuleImportError;
    },
    getCustomDocumentError: function() {
        return getCustomDocumentError;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getGlobalImportError() {
    return `Global CSS ${_chalk.default.bold("cannot")} be imported from files other than your ${_chalk.default.bold("Custom <App>")}. Due to the Global nature of stylesheets, and to avoid conflicts, Please move all first-party global CSS imports to ${_chalk.default.cyan("pages/_app.js")}. Or convert the import to Component-Level CSS (CSS Modules).\nRead more: https://nextjs.org/docs/messages/css-global`;
}
function getGlobalModuleImportError() {
    return `Global CSS ${_chalk.default.bold("cannot")} be imported from within ${_chalk.default.bold("node_modules")}.\nRead more: https://nextjs.org/docs/messages/css-npm`;
}
function getLocalModuleImportError() {
    return `CSS Modules ${_chalk.default.bold("cannot")} be imported from within ${_chalk.default.bold("node_modules")}.\nRead more: https://nextjs.org/docs/messages/css-modules-npm`;
}
function getCustomDocumentError() {
    return `CSS ${_chalk.default.bold("cannot")} be imported within ${_chalk.default.cyan("pages/_document.js")}. Please move global styles to ${_chalk.default.cyan("pages/_app.js")}.`;
}

//# sourceMappingURL=messages.js.map