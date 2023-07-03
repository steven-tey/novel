"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getProjectDir", {
    enumerable: true,
    get: function() {
        return getProjectDir;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _commands = require("./commands");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../build/output/log"));
const _detecttypo = require("./detect-typo");
const _realpath = require("./realpath");
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
function getProjectDir(dir) {
    try {
        const resolvedDir = _path.default.resolve(dir || ".");
        const realDir = (0, _realpath.realpathSync)(resolvedDir);
        if (resolvedDir !== realDir && resolvedDir.toLowerCase() === realDir.toLowerCase()) {
            _log.warn(`Invalid casing detected for project dir, received ${resolvedDir} actual path ${realDir}, see more info here https://nextjs.org/docs/messages/invalid-project-dir-casing`);
        }
        return realDir;
    } catch (err) {
        if (err.code === "ENOENT") {
            if (typeof dir === "string") {
                const detectedTypo = (0, _detecttypo.detectTypo)(dir, Object.keys(_commands.commands));
                if (detectedTypo) {
                    _log.error(`"next ${dir}" does not exist. Did you mean "next ${detectedTypo}"?`);
                    process.exit(1);
                }
            }
            _log.error(`Invalid project directory provided, no such directory: ${_path.default.resolve(dir || ".")}`);
            process.exit(1);
        }
        throw err;
    }
}

//# sourceMappingURL=get-project-dir.js.map