"use strict";
var _defineRule = require("../utils/define-rule");
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs"));
var _getRootDirs = require("../utils/get-root-dirs");
var _url = require("../utils/url");
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var pagesDirWarning = (0, _url).execOnce(function(pagesDirs) {
    console.warn("Pages directory cannot be found at ".concat(pagesDirs.join(" or "), ". ") + "If using a custom path, please configure with the `no-html-link-for-pages` rule in your eslint config file.");
});
// Cache for fs.existsSync lookup.
// Prevent multiple blocking IO requests that have already been calculated.
var fsExistsSyncCache = {};
var url = "https://nextjs.org/docs/messages/no-html-link-for-pages";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `<a>` elements to navigate to internal Next.js pages.",
            category: "HTML",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: [
            {
                oneOf: [
                    {
                        type: "string"
                    },
                    {
                        type: "array",
                        uniqueItems: true,
                        items: {
                            type: "string"
                        }
                    }, 
                ]
            }, 
        ]
    },
    /**
   * Creates an ESLint rule listener.
   */ create: function create(context) {
        var ruleOptions = context.options;
        var _ruleOptions = _slicedToArray(ruleOptions, 1), customPagesDirectory = _ruleOptions[0];
        var rootDirs = (0, _getRootDirs).getRootDirs(context);
        var pagesDirs = (customPagesDirectory ? [
            customPagesDirectory
        ] : rootDirs.map(function(dir) {
            return [
                path.join(dir, "pages"),
                path.join(dir, "src", "pages"), 
            ];
        })).flat();
        var foundPagesDirs = pagesDirs.filter(function(dir) {
            if (fsExistsSyncCache[dir] === undefined) {
                fsExistsSyncCache[dir] = fs.existsSync(dir);
            }
            return fsExistsSyncCache[dir];
        });
        if (foundPagesDirs.length === 0) {
            pagesDirWarning(pagesDirs);
            return {};
        }
        var pageUrls = (0, _url).getUrlFromPagesDirectories("/", foundPagesDirs);
        return {
            JSXOpeningElement: function JSXOpeningElement(node) {
                if (node.name.name !== "a") {
                    return;
                }
                if (node.attributes.length === 0) {
                    return;
                }
                var target = node.attributes.find(function(attr) {
                    return attr.type === "JSXAttribute" && attr.name.name === "target";
                });
                if (target && target.value.value === "_blank") {
                    return;
                }
                var href = node.attributes.find(function(attr) {
                    return attr.type === "JSXAttribute" && attr.name.name === "href";
                });
                if (!href || href.value && href.value.type !== "Literal") {
                    return;
                }
                var hasDownloadAttr = node.attributes.find(function(attr) {
                    return attr.type === "JSXAttribute" && attr.name.name === "download";
                });
                if (hasDownloadAttr) {
                    return;
                }
                var hrefPath = (0, _url).normalizeURL(href.value.value);
                // Outgoing links are ignored
                if (/^(https?:\/\/|\/\/)/.test(hrefPath)) {
                    return;
                }
                pageUrls.forEach(function(pageUrl) {
                    if (pageUrl.test((0, _url).normalizeURL(hrefPath))) {
                        context.report({
                            node: node,
                            message: "Do not use an `<a>` element to navigate to `".concat(hrefPath, "`. Use `<Link />` from `next/link` instead. See: ").concat(url)
                        });
                    }
                });
            }
        };
    }
});
