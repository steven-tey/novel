"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return loadJsConfig;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _fileexists = require("../lib/file-exists");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("./output/log"));
const _getTypeScriptConfiguration = require("../lib/typescript/getTypeScriptConfiguration");
const _fs = require("fs");
const _iserror = /*#__PURE__*/ _interop_require_default(require("../lib/is-error"));
const _hasnecessarydependencies = require("../lib/has-necessary-dependencies");
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
let TSCONFIG_WARNED = false;
function parseJsonFile(filePath) {
    const JSON5 = require("next/dist/compiled/json5");
    const contents = (0, _fs.readFileSync)(filePath, "utf8");
    // Special case an empty file
    if (contents.trim() === "") {
        return {};
    }
    try {
        return JSON5.parse(contents);
    } catch (err) {
        if (!(0, _iserror.default)(err)) throw err;
        const { codeFrameColumns  } = require("next/dist/compiled/babel/code-frame");
        const codeFrame = codeFrameColumns(String(contents), {
            start: {
                line: err.lineNumber || 0,
                column: err.columnNumber || 0
            }
        }, {
            message: err.message,
            highlightCode: true
        });
        throw new Error(`Failed to parse "${filePath}":\n${codeFrame}`);
    }
}
async function loadJsConfig(dir, config) {
    let typeScriptPath;
    try {
        const deps = await (0, _hasnecessarydependencies.hasNecessaryDependencies)(dir, [
            {
                pkg: "typescript",
                file: "typescript/lib/typescript.js",
                exportsRestrict: true
            }
        ]);
        typeScriptPath = deps.resolved.get("typescript");
    } catch (_) {}
    const tsConfigPath = _path.default.join(dir, config.typescript.tsconfigPath);
    const useTypeScript = Boolean(typeScriptPath && await (0, _fileexists.fileExists)(tsConfigPath));
    let implicitBaseurl;
    let jsConfig;
    // jsconfig is a subset of tsconfig
    if (useTypeScript) {
        if (config.typescript.tsconfigPath !== "tsconfig.json" && TSCONFIG_WARNED === false) {
            TSCONFIG_WARNED = true;
            _log.info(`Using tsconfig file: ${config.typescript.tsconfigPath}`);
        }
        const ts = await Promise.resolve(require(typeScriptPath));
        const tsConfig = await (0, _getTypeScriptConfiguration.getTypeScriptConfiguration)(ts, tsConfigPath, true);
        jsConfig = {
            compilerOptions: tsConfig.options
        };
        implicitBaseurl = _path.default.dirname(tsConfigPath);
    }
    const jsConfigPath = _path.default.join(dir, "jsconfig.json");
    if (!useTypeScript && await (0, _fileexists.fileExists)(jsConfigPath)) {
        jsConfig = parseJsonFile(jsConfigPath);
        implicitBaseurl = _path.default.dirname(jsConfigPath);
    }
    let resolvedBaseUrl;
    if (jsConfig) {
        var _jsConfig_compilerOptions;
        if ((_jsConfig_compilerOptions = jsConfig.compilerOptions) == null ? void 0 : _jsConfig_compilerOptions.baseUrl) {
            resolvedBaseUrl = _path.default.resolve(dir, jsConfig.compilerOptions.baseUrl);
        } else {
            resolvedBaseUrl = implicitBaseurl;
        }
    }
    return {
        useTypeScript,
        jsConfig,
        resolvedBaseUrl
    };
}

//# sourceMappingURL=load-jsconfig.js.map