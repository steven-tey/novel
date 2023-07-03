"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getMaybePagePath: null,
    getPagePath: null,
    requirePage: null,
    requireFontManifest: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getMaybePagePath: function() {
        return getMaybePagePath;
    },
    getPagePath: function() {
        return getPagePath;
    },
    requirePage: function() {
        return requirePage;
    },
    requireFontManifest: function() {
        return requireFontManifest;
    }
});
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _path = require("path");
const _constants = require("../shared/lib/constants");
const _normalizelocalepath = require("../shared/lib/i18n/normalize-locale-path");
const _normalizepagepath = require("../shared/lib/page-path/normalize-page-path");
const _denormalizepagepath = require("../shared/lib/page-path/denormalize-page-path");
const _utils = require("../shared/lib/utils");
const _lrucache = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/lru-cache"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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
const isDev = process.env.NODE_ENV === "development";
const pagePathCache = isDev ? {
    get: (_key)=>{
        return null;
    },
    set: ()=>{},
    has: ()=>false
} : new _lrucache.default({
    max: 1000
});
const loadManifest = (manifestPath)=>{
    if (isDev) {
        return JSON.parse(_fs.default.readFileSync(manifestPath, "utf8"));
    }
    return require(manifestPath);
};
function getMaybePagePath(page, distDir, locales, isAppPath) {
    const cacheKey = `${page}:${distDir}:${locales}:${isAppPath}`;
    if (pagePathCache.has(cacheKey)) {
        return pagePathCache.get(cacheKey);
    }
    const serverBuildPath = (0, _path.join)(distDir, _constants.SERVER_DIRECTORY);
    let appPathsManifest;
    if (isAppPath) {
        appPathsManifest = loadManifest((0, _path.join)(serverBuildPath, _constants.APP_PATHS_MANIFEST));
    }
    const pagesManifest = loadManifest((0, _path.join)(serverBuildPath, _constants.PAGES_MANIFEST));
    try {
        page = (0, _denormalizepagepath.denormalizePagePath)((0, _normalizepagepath.normalizePagePath)(page));
    } catch (err) {
        console.error(err);
        throw new _utils.PageNotFoundError(page);
    }
    const checkManifest = (manifest)=>{
        let curPath = manifest[page];
        if (!manifest[curPath] && locales) {
            const manifestNoLocales = {};
            for (const key of Object.keys(manifest)){
                manifestNoLocales[(0, _normalizelocalepath.normalizeLocalePath)(key, locales).pathname] = pagesManifest[key];
            }
            curPath = manifestNoLocales[page];
        }
        return curPath;
    };
    let pagePath;
    if (appPathsManifest) {
        pagePath = checkManifest(appPathsManifest);
    }
    if (!pagePath) {
        pagePath = checkManifest(pagesManifest);
    }
    if (!pagePath) {
        pagePathCache.set(cacheKey, null);
        return null;
    }
    const path = (0, _path.join)(serverBuildPath, pagePath);
    pagePathCache.set(cacheKey, path);
    return path;
}
function getPagePath(page, distDir, locales, isAppPath) {
    const pagePath = getMaybePagePath(page, distDir, locales, isAppPath);
    if (!pagePath) {
        throw new _utils.PageNotFoundError(page);
    }
    return pagePath;
}
function requirePage(page, distDir, isAppPath) {
    const pagePath = getPagePath(page, distDir, undefined, isAppPath);
    if (pagePath.endsWith(".html")) {
        return _fs.promises.readFile(pagePath, "utf8").catch((err)=>{
            throw new _utils.MissingStaticPage(page, err.message);
        });
    }
    return require(pagePath);
}
function requireFontManifest(distDir) {
    const serverBuildPath = (0, _path.join)(distDir, _constants.SERVER_DIRECTORY);
    const fontManifest = require((0, _path.join)(serverBuildPath, _constants.FONT_MANIFEST));
    return fontManifest;
}

//# sourceMappingURL=require.js.map