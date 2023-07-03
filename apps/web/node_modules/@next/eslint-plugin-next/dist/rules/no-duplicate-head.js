"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-duplicate-head";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent duplicate usage of `<Head>` in `pages/_document.js`.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var documentImportName;
        return {
            ImportDeclaration: function ImportDeclaration(node) {
                if (node.source.value === "next/document") {
                    var documentImport = node.specifiers.find(function(param) {
                        var type = param.type;
                        return type === "ImportDefaultSpecifier";
                    });
                    if (documentImport && documentImport.local) {
                        documentImportName = documentImport.local.name;
                    }
                }
            },
            ReturnStatement: function ReturnStatement(node) {
                var ancestors = context.getAncestors();
                var documentClass = ancestors.find(function(ancestorNode) {
                    return ancestorNode.type === "ClassDeclaration" && ancestorNode.superClass && "name" in ancestorNode.superClass && ancestorNode.superClass.name === documentImportName;
                });
                if (!documentClass) {
                    return;
                }
                // @ts-expect-error - `node.argument` could be a `JSXElement` which has property `children`
                if (node.argument && "children" in node.argument && node.argument.children) {
                    // @ts-expect-error - `node.argument` could be a `JSXElement` which has property `children`
                    var headComponents = node.argument.children.filter(function(childrenNode) {
                        return childrenNode.openingElement && childrenNode.openingElement.name && childrenNode.openingElement.name.name === "Head";
                    });
                    if (headComponents.length > 1) {
                        for(var i = 1; i < headComponents.length; i++){
                            context.report({
                                node: headComponents[i],
                                message: "Do not include multiple instances of `<Head/>`. See: ".concat(url)
                            });
                        }
                    }
                }
            }
        };
    }
});
