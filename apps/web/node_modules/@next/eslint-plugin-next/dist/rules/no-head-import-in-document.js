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
var url = "https://nextjs.org/docs/messages/no-head-import-in-document";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `next/head` in `pages/_document.js`.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (node.source.value !== "next/head") {
                    return;
                }
                var document = context.getFilename().split("pages")[1];
                if (!document) {
                    return;
                }
                var ref = path.parse(document), name = ref.name, dir = ref.dir;
                if (name.startsWith("_document") || dir === "/_document" && name === "index") {
                    context.report({
                        node: node,
                        message: "`next/head` should not be imported in `pages".concat(document, "`. Use `<Head />` from `next/document` instead. See: ").concat(url)
                    });
                }
            }
        };
    }
});
