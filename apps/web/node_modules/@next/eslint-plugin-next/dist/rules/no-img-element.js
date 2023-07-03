"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-img-element";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `<img>` element due to slower LCP and higher bandwidth.",
            category: "HTML",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        return {
            JSXOpeningElement: function JSXOpeningElement(node) {
                var ref, ref1, ref2, ref3;
                if (node.name.name !== "img") {
                    return;
                }
                if (node.attributes.length === 0) {
                    return;
                }
                if (((ref = node.parent) === null || ref === void 0 ? void 0 : (ref1 = ref.parent) === null || ref1 === void 0 ? void 0 : (ref2 = ref1.openingElement) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.name) === null || ref3 === void 0 ? void 0 : ref3.name) === "picture") {
                    return;
                }
                context.report({
                    node: node,
                    message: "Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: ".concat(url)
                });
            }
        };
    }
});
