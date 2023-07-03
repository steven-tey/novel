"use strict";
var _defineRule = require("../utils/define-rule");
var path = _interopRequireWildcard(require("path"));
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
var url = "https://nextjs.org/docs/messages/no-before-interactive-script-outside-document";
var startsWithUsingCorrectSeparators = function(str, start) {
    return [
        path.sep,
        path.posix.sep
    ].some(function(sep) {
        return str.startsWith(start.replace(/\//g, sep));
    });
};
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `next/script`'s `beforeInteractive` strategy outside of `pages/_document.js`.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var scriptImportName = null;
        return {
            'ImportDeclaration[source.value="next/script"] > ImportDefaultSpecifier': function(node) {
                scriptImportName = node.local.name;
            },
            JSXOpeningElement: function JSXOpeningElement(node) {
                var pathname = context.getFilename();
                if (startsWithUsingCorrectSeparators(pathname, "src/")) {
                    pathname = pathname.slice(4);
                }
                // This rule shouldn't fire in `app/`
                if (startsWithUsingCorrectSeparators(pathname, "app/")) {
                    return;
                }
                if (!scriptImportName) {
                    return;
                }
                if (node.name && node.name.name !== scriptImportName) {
                    return;
                }
                var strategy = node.attributes.find(function(child) {
                    return child.name && child.name.name === "strategy";
                });
                if (!strategy || !strategy.value || strategy.value.value !== "beforeInteractive") {
                    return;
                }
                var document = context.getFilename().split("pages")[1];
                if (document && path.parse(document).name.startsWith("_document")) {
                    return;
                }
                context.report({
                    node: node,
                    message: "`next/script`'s `beforeInteractive` strategy should not be used outside of `pages/_document.js`. See: ".concat(url)
                });
            }
        };
    }
});
