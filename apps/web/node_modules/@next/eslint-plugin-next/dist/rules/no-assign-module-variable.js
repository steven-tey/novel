"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-assign-module-variable";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent assignment to the `module` variable.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        return {
            VariableDeclaration: function VariableDeclaration(node) {
                // Checks node.declarations array for variable with id.name of `module`
                var moduleVariableFound = node.declarations.some(function(declaration) {
                    if ("name" in declaration.id) {
                        return declaration.id.name === "module";
                    }
                    return false;
                });
                // Return early if no `module` variable is found
                if (!moduleVariableFound) {
                    return;
                }
                context.report({
                    node: node,
                    message: "Do not assign to the variable `module`. See: ".concat(url)
                });
            }
        };
    }
});
