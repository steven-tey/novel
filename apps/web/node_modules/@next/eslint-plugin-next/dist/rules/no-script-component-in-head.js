"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-script-component-in-head";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `next/script` in `next/head` component.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var isNextHead = null;
        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (node.source.value === "next/head") {
                    isNextHead = node.source.value;
                }
                if (node.source.value !== "next/script") {
                    return;
                }
            },
            JSXElement: function JSXElement(node) {
                if (!isNextHead) {
                    return;
                }
                if (node.openingElement && node.openingElement.name && node.openingElement.name.name !== "Head") {
                    return;
                }
                var scriptTag = node.children.find(function(child) {
                    return child.openingElement && child.openingElement.name && child.openingElement.name.name === "Script";
                });
                if (scriptTag) {
                    context.report({
                        node: node,
                        message: "`next/script` should not be used in `next/head` component. Move `<Script />` outside of `<Head>` instead. See: ".concat(url)
                    });
                }
            }
        };
    }
});
