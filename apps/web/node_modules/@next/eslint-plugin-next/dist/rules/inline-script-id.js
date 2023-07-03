"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/inline-script-id";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Enforce `id` attribute on `next/script` components with inline content.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var nextScriptImportName = null;
        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (node.source.value === "next/script") {
                    nextScriptImportName = node.specifiers[0].local.name;
                }
            },
            JSXElement: function JSXElement(node) {
                if (nextScriptImportName == null) return;
                if (node.openingElement && node.openingElement.name && node.openingElement.name.name !== nextScriptImportName) {
                    return;
                }
                var attributeNames = new Set();
                var hasNonCheckableSpreadAttribute = false;
                node.openingElement.attributes.forEach(function(attribute) {
                    // Early return if we already have a non-checkable spread attribute, for better performance
                    if (hasNonCheckableSpreadAttribute) return;
                    if (attribute.type === "JSXAttribute") {
                        attributeNames.add(attribute.name.name);
                    } else if (attribute.type === "JSXSpreadAttribute") {
                        if (attribute.argument && attribute.argument.properties) {
                            attribute.argument.properties.forEach(function(property) {
                                attributeNames.add(property.key.name);
                            });
                        } else {
                            // JSXSpreadAttribute without properties is not checkable
                            hasNonCheckableSpreadAttribute = true;
                        }
                    }
                });
                // https://github.com/vercel/next.js/issues/34030
                // If there is a non-checkable spread attribute, we simply ignore them
                if (hasNonCheckableSpreadAttribute) return;
                if (node.children.length > 0 || attributeNames.has("dangerouslySetInnerHTML")) {
                    if (!attributeNames.has("id")) {
                        context.report({
                            node: node,
                            message: "`next/script` components with inline content must specify an `id` attribute. See: ".concat(url)
                        });
                    }
                }
            }
        };
    }
});
