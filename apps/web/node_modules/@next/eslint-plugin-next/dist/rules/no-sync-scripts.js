"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-sync-scripts";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent synchronous scripts.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        return {
            JSXOpeningElement: function JSXOpeningElement(node) {
                if (node.name.name !== "script") {
                    return;
                }
                if (node.attributes.length === 0) {
                    return;
                }
                var attributeNames = node.attributes.filter(function(attr) {
                    return attr.type === "JSXAttribute";
                }).map(function(attr) {
                    return attr.name.name;
                });
                if (attributeNames.includes("src") && !attributeNames.includes("async") && !attributeNames.includes("defer")) {
                    context.report({
                        node: node,
                        message: "Synchronous scripts should not be used. See: ".concat(url)
                    });
                }
            }
        };
    }
});
