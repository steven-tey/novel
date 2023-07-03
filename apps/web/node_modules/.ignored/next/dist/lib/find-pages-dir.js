"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    existsSync: null,
    findDir: null,
    findPagesDir: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    existsSync: function() {
        return existsSync;
    },
    findDir: function() {
        return findDir;
    },
    findPagesDir: function() {
        return findPagesDir;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../build/output/log"));
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
const existsSync = (f)=>{
    try {
        _fs.default.accessSync(f, _fs.default.constants.F_OK);
        return true;
    } catch (_) {
        return false;
    }
};
function findDir(dir, name) {
    // prioritize ./${name} over ./src/${name}
    let curDir = _path.default.join(dir, name);
    if (existsSync(curDir)) return curDir;
    curDir = _path.default.join(dir, "src", name);
    if (existsSync(curDir)) return curDir;
    return null;
}
function findPagesDir(dir, isAppDirEnabled) {
    const pagesDir = findDir(dir, "pages") || undefined;
    const appDir = findDir(dir, "app") || undefined;
    if (isAppDirEnabled && appDir == null && pagesDir == null) {
        throw new Error("> Couldn't find any `pages` or `app` directory. Please create one under the project root");
    }
    if (!isAppDirEnabled) {
        if (appDir != null && pagesDir == null) {
            throw new Error("> The `app` directory is experimental. To enable, add `appDir: true` to your `next.config.js` configuration under `experimental`. See https://nextjs.org/docs/messages/experimental-app-dir-config");
        }
        if (appDir != null && pagesDir != null) {
            _log.warn("The `app` directory is experimental. To enable, add `appDir: true` to your `next.config.js` configuration under `experimental`. See https://nextjs.org/docs/messages/experimental-app-dir-config");
        }
        if (pagesDir == null) {
            throw new Error("> Couldn't find a `pages` directory. Please create one under the project root");
        }
    }
    return {
        pagesDir,
        appDir: isAppDirEnabled ? appDir : undefined
    };
}

//# sourceMappingURL=find-pages-dir.js.map