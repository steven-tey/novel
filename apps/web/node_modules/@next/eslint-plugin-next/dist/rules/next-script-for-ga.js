"use strict";
var _defineRule = require("../utils/define-rule");
var _nodeAttributes = _interopRequireDefault(require("../utils/node-attributes"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var SUPPORTED_SRCS = [
    "www.google-analytics.com/analytics.js",
    "www.googletagmanager.com/gtag/js", 
];
var SUPPORTED_HTML_CONTENT_URLS = [
    "www.google-analytics.com/analytics.js",
    "www.googletagmanager.com/gtm.js", 
];
var description = "Prefer `next/script` component when using the inline script for Google Analytics.";
var url = "https://nextjs.org/docs/messages/next-script-for-ga";
var ERROR_MSG = "".concat(description, " See: ").concat(url);
// Check if one of the items in the list is a substring of the passed string
var containsStr = function(str, strList) {
    return strList.some(function(s) {
        return str.includes(s);
    });
};
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: description,
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
                var attributes = new _nodeAttributes.default(node);
                // Check if the Alternative async tag is being used to add GA.
                // https://developers.google.com/analytics/devguides/collection/analyticsjs#alternative_async_tag
                // https://developers.google.com/analytics/devguides/collection/gtagjs
                if (typeof attributes.value("src") === "string" && containsStr(attributes.value("src"), SUPPORTED_SRCS)) {
                    return context.report({
                        node: node,
                        message: ERROR_MSG
                    });
                }
                // Check if inline script is being used to add GA.
                // https://developers.google.com/analytics/devguides/collection/analyticsjs#the_google_analytics_tag
                // https://developers.google.com/tag-manager/quickstart
                if (attributes.value("dangerouslySetInnerHTML") && attributes.value("dangerouslySetInnerHTML").length > 0) {
                    var htmlContent = attributes.value("dangerouslySetInnerHTML")[0].value.quasis && attributes.value("dangerouslySetInnerHTML")[0].value.quasis[0].value.raw;
                    if (htmlContent && containsStr(htmlContent, SUPPORTED_HTML_CONTENT_URLS)) {
                        context.report({
                            node: node,
                            message: ERROR_MSG
                        });
                    }
                }
            }
        };
    }
});
