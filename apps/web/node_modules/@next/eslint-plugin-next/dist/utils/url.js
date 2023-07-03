"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeURL = normalizeURL;
exports.getUrlFromPagesDirectories = getUrlFromPagesDirectories;
exports.execOnce = execOnce;
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs"));
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
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
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// Cache for fs.lstatSync lookup.
// Prevent multiple blocking IO requests that have already been calculated.
var fsLstatSyncCache = {};
var fsLstatSync = function(source) {
    fsLstatSyncCache[source] = fsLstatSyncCache[source] || fs.lstatSync(source);
    return fsLstatSyncCache[source];
};
/**
 * Checks if the source is a directory.
 */ function isDirectory(source) {
    return fsLstatSync(source).isDirectory();
}
/**
 * Checks if the source is a directory.
 */ function isSymlink(source) {
    return fsLstatSync(source).isSymbolicLink();
}
// Cache for fs.readdirSync lookup.
// Prevent multiple blocking IO requests that have already been calculated.
var fsReadDirSyncCache = {};
/**
 * Recursively parse directory for page URLs.
 */ function parseUrlForPages(urlprefix, directory) {
    fsReadDirSyncCache[directory] = fsReadDirSyncCache[directory] || fs.readdirSync(directory);
    var res = [];
    fsReadDirSyncCache[directory].forEach(function(fname) {
        // TODO: this should account for all page extensions
        // not just js(x) and ts(x)
        if (/(\.(j|t)sx?)$/.test(fname)) {
            if (/^index(\.(j|t)sx?)$/.test(fname)) {
                res.push("".concat(urlprefix).concat(fname.replace(/^index(\.(j|t)sx?)$/, "")));
            }
            res.push("".concat(urlprefix).concat(fname.replace(/(\.(j|t)sx?)$/, "")));
        } else {
            var dirPath = path.join(directory, fname);
            if (isDirectory(dirPath) && !isSymlink(dirPath)) {
                var _res;
                (_res = res).push.apply(_res, _toConsumableArray(parseUrlForPages(urlprefix + fname + "/", dirPath)));
            }
        }
    });
    return res;
}
function normalizeURL(url) {
    if (!url) {
        return;
    }
    url = url.split("?")[0];
    url = url.split("#")[0];
    url = url = url.replace(/(\/index\.html)$/, "/");
    // Empty URLs should not be trailed with `/`, e.g. `#heading`
    if (url === "") {
        return url;
    }
    url = url.endsWith("/") ? url : url + "/";
    return url;
}
function getUrlFromPagesDirectories(urlPrefix, directories) {
    return Array.from(// De-duplicate similar pages across multiple directories.
    new Set(directories.map(function(directory) {
        return parseUrlForPages(urlPrefix, directory);
    }).flat().map(// Since the URLs are normalized we add `^` and `$` to the RegExp to make sure they match exactly.
    function(url) {
        return "^".concat(normalizeURL(url), "$");
    }))).map(function(urlReg) {
        urlReg = urlReg.replace(/\[.*\]/g, "((?!.+?\\..+?).*?)");
        return new RegExp(urlReg);
    });
}
function execOnce(fn) {
    var used = false;
    var result;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!used) {
            used = true;
            result = fn.apply(void 0, _toConsumableArray(args));
        }
        return result;
    };
}
