"use strict";
var _defineRule = require("../utils/define-rule");
// Keep in sync with next.js polyfills file : https://github.com/vercel/next.js/blob/master/packages/next-polyfill-nomodule/src/index.js
var NEXT_POLYFILLED_FEATURES = [
    "Array.prototype.@@iterator",
    "Array.prototype.copyWithin",
    "Array.prototype.fill",
    "Array.prototype.find",
    "Array.prototype.findIndex",
    "Array.prototype.flatMap",
    "Array.prototype.flat",
    "Array.from",
    "Array.prototype.includes",
    "Array.of",
    "Function.prototype.name",
    "fetch",
    "Map",
    "Number.EPSILON",
    "Number.Epsilon",
    "Number.isFinite",
    "Number.isNaN",
    "Number.isInteger",
    "Number.isSafeInteger",
    "Number.MAX_SAFE_INTEGER",
    "Number.MIN_SAFE_INTEGER",
    "Number.parseFloat",
    "Number.parseInt",
    "Object.assign",
    "Object.entries",
    "Object.fromEntries",
    "Object.getOwnPropertyDescriptor",
    "Object.getOwnPropertyDescriptors",
    "Object.is",
    "Object.keys",
    "Object.values",
    "Reflect",
    "Set",
    "Symbol",
    "Symbol.asyncIterator",
    "String.prototype.codePointAt",
    "String.prototype.endsWith",
    "String.fromCodePoint",
    "String.prototype.includes",
    "String.prototype.@@iterator",
    "String.prototype.padEnd",
    "String.prototype.padStart",
    "String.prototype.repeat",
    "String.raw",
    "String.prototype.startsWith",
    "String.prototype.trimEnd",
    "String.prototype.trimStart",
    "URL",
    "URL.prototype.toJSON",
    "URLSearchParams",
    "WeakMap",
    "WeakSet",
    "Promise",
    "Promise.prototype.finally",
    "es2015",
    "es2016",
    "es2017",
    "es2018",
    "es2019",
    "es5",
    "es6",
    "es7"
];
var url = "https://nextjs.org/docs/messages/no-unwanted-polyfillio";
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent duplicate polyfills from Polyfill.io.",
            category: "HTML",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var scriptImport = null;
        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (node.source && node.source.value === "next/script") {
                    scriptImport = node.specifiers[0].local.name;
                }
            },
            JSXOpeningElement: function JSXOpeningElement(node) {
                if (node.name && node.name.name !== "script" && node.name.name !== scriptImport) {
                    return;
                }
                if (node.attributes.length === 0) {
                    return;
                }
                var srcNode = node.attributes.find(function(attr) {
                    return attr.type === "JSXAttribute" && attr.name.name === "src";
                });
                if (!srcNode || srcNode.value.type !== "Literal") {
                    return;
                }
                var src = srcNode.value.value;
                if (src.startsWith("https://cdn.polyfill.io/v2/") || src.startsWith("https://polyfill.io/v3/")) {
                    var featureQueryString = new URL(src).searchParams.get("features");
                    var featuresRequested = (featureQueryString || "").split(",");
                    var unwantedFeatures = featuresRequested.filter(function(feature) {
                        return NEXT_POLYFILLED_FEATURES.includes(feature);
                    });
                    if (unwantedFeatures.length > 0) {
                        context.report({
                            node: node,
                            message: "No duplicate polyfills from Polyfill.io are allowed. ".concat(unwantedFeatures.join(", "), " ").concat(unwantedFeatures.length > 1 ? "are" : "is", " already shipped with Next.js. See: ").concat(url)
                        });
                    }
                }
            }
        };
    }
});
