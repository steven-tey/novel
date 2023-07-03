"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-title-in-document-head";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `<title>` with `Head` component from `next/document`.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var headFromNextDocument = false;
        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (node.source.value === "next/document") {
                    if (node.specifiers.some(function(param) {
                        var local = param.local;
                        return local.name === "Head";
                    })) {
                        headFromNextDocument = true;
                    }
                }
            },
            JSXElement: function JSXElement(node) {
                if (!headFromNextDocument) {
                    return;
                }
                if (node.openingElement && node.openingElement.name && node.openingElement.name.name !== "Head") {
                    return;
                }
                var titleTag = node.children.find(function(child) {
                    return child.openingElement && child.openingElement.name && child.openingElement.name.type === "JSXIdentifier" && child.openingElement.name.name === "title";
                });
                if (titleTag) {
                    context.report({
                        node: titleTag,
                        message: "Do not use `<title>` element with `<Head />` component from `next/document`. Titles should defined at the page-level using `<Head />` from `next/head` instead. See: ".concat(url)
                    });
                }
            }
        };
    }
});
