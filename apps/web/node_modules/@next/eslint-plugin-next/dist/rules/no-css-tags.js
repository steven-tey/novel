"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-css-tags";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent manual stylesheet tags.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        return {
            JSXOpeningElement: function JSXOpeningElement(node) {
                if (node.name.name !== "link") {
                    return;
                }
                if (node.attributes.length === 0) {
                    return;
                }
                var attributes = node.attributes.filter(function(attr) {
                    return attr.type === "JSXAttribute";
                });
                if (attributes.find(function(attr) {
                    return attr.name.name === "rel" && attr.value.value === "stylesheet";
                }) && attributes.find(function(attr) {
                    return attr.name.name === "href" && attr.value.type === "Literal" && !/^https?/.test(attr.value.value);
                })) {
                    context.report({
                        node: node,
                        message: "Do not include stylesheets manually. See: ".concat(url)
                    });
                }
            }
        };
    }
});
