"use strict";
var _defineRule = require("../utils/define-rule");
var _nodeAttributes = _interopRequireDefault(require("../utils/node-attributes"));
var _path = require("path");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var url = "https://nextjs.org/docs/messages/no-page-custom-font";
function isIdentifierMatch(id1, id2) {
    return id1 === null && id2 === null || id1 && id2 && id1.name === id2.name;
}
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent page-only custom fonts.",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var paths = context.getFilename().split("pages");
        var page = paths[paths.length - 1];
        // outside of a file within `pages`, bail
        if (!page) {
            return {};
        }
        var is_Document = page.startsWith("".concat(_path.sep, "_document")) || page.startsWith("".concat(_path.posix.sep, "_document"));
        var documentImportName;
        var localDefaultExportId;
        var exportDeclarationType;
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
            ExportDefaultDeclaration: function ExportDefaultDeclaration(node) {
                exportDeclarationType = node.declaration.type;
                if (node.declaration.type === "FunctionDeclaration") {
                    localDefaultExportId = node.declaration.id;
                    return;
                }
                if (node.declaration.type === "ClassDeclaration" && node.declaration.superClass && "name" in node.declaration.superClass && node.declaration.superClass.name === documentImportName) {
                    localDefaultExportId = node.declaration.id;
                }
            },
            JSXOpeningElement: function JSXOpeningElement(node) {
                if (node.name.name !== "link") {
                    return;
                }
                var ancestors = context.getAncestors();
                // if `export default <name>` is further down within the file after the
                // currently traversed component, then `localDefaultExportName` will
                // still be undefined
                if (!localDefaultExportId) {
                    // find the top level of the module
                    var program = ancestors.find(function(ancestor) {
                        return ancestor.type === "Program";
                    });
                    // go over each token to find the combination of `export default <name>`
                    for(var i = 0; i <= program.tokens.length - 1; i++){
                        if (localDefaultExportId) {
                            break;
                        }
                        var token = program.tokens[i];
                        if (token.type === "Keyword" && token.value === "export") {
                            var nextToken = program.tokens[i + 1];
                            if (nextToken && nextToken.type === "Keyword" && nextToken.value === "default") {
                                var maybeIdentifier = program.tokens[i + 2];
                                if (maybeIdentifier && maybeIdentifier.type === "Identifier") {
                                    localDefaultExportId = {
                                        name: maybeIdentifier.value
                                    };
                                }
                            }
                        }
                    }
                }
                var parentComponent = ancestors.find(function(ancestor) {
                    // export default class ... extends ...
                    if (exportDeclarationType === "ClassDeclaration") {
                        return ancestor.type === exportDeclarationType && "superClass" in ancestor && ancestor.superClass && "name" in ancestor.superClass && ancestor.superClass.name === documentImportName;
                    }
                    if ("id" in ancestor) {
                        // export default function ...
                        if (exportDeclarationType === "FunctionDeclaration") {
                            return ancestor.type === exportDeclarationType && isIdentifierMatch(ancestor.id, localDefaultExportId);
                        }
                        // function ...() {} export default ...
                        // class ... extends ...; export default ...
                        return isIdentifierMatch(ancestor.id, localDefaultExportId);
                    }
                    return false;
                });
                // file starts with _document and this <link /> is within the default export
                if (is_Document && parentComponent) {
                    return;
                }
                var attributes = new _nodeAttributes.default(node);
                if (!attributes.has("href") || !attributes.hasValue("href")) {
                    return;
                }
                var hrefValue = attributes.value("href");
                var isGoogleFont = typeof hrefValue === "string" && hrefValue.startsWith("https://fonts.googleapis.com/css");
                if (isGoogleFont) {
                    var end = "This is discouraged. See: ".concat(url);
                    var message = is_Document ? "Using `<link />` outside of `<Head>` will disable automatic font optimization. ".concat(end) : "Custom fonts not added in `pages/_document.js` will only load for a single page. ".concat(end);
                    context.report({
                        node: node,
                        message: message
                    });
                }
            }
        };
    }
});
