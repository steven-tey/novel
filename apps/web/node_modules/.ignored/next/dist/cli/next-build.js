#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "nextBuild", {
    enumerable: true,
    get: function() {
        return nextBuild;
    }
});
const _fs = require("fs");
const _index = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/arg/index.js"));
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../build/output/log"));
const _build = /*#__PURE__*/ _interop_require_default(require("../build"));
const _utils = require("../server/lib/utils");
const _iserror = /*#__PURE__*/ _interop_require_default(require("../lib/is-error"));
const _getprojectdir = require("../lib/get-project-dir");
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
const nextBuild = (argv)=>{
    const validArgs = {
        // Types
        "--help": Boolean,
        "--profile": Boolean,
        "--debug": Boolean,
        "--no-lint": Boolean,
        "--no-mangling": Boolean,
        "--experimental-app-only": Boolean,
        "--experimental-turbo": Boolean,
        "--experimental-turbo-root": String,
        "--build-mode": String,
        // Aliases
        "-h": "--help",
        "-d": "--debug"
    };
    let args;
    try {
        args = (0, _index.default)(validArgs, {
            argv
        });
    } catch (error) {
        if ((0, _iserror.default)(error) && error.code === "ARG_UNKNOWN_OPTION") {
            return (0, _utils.printAndExit)(error.message, 1);
        }
        throw error;
    }
    if (args["--help"]) {
        (0, _utils.printAndExit)(`
      Description
        Compiles the application for production deployment

      Usage
        $ next build <dir>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
      --profile                Can be used to enable React Production Profiling
      --no-lint                Disable linting
      --no-mangling            Disable mangling
      --experimental-app-only  Only build 'app' routes
      --experimental-turbo     Enable experimental turbo mode
      --help, -h               Displays this message
    `, 0);
    }
    if (args["--profile"]) {
        _log.warn("Profiling is enabled. Note: This may affect performance");
    }
    if (args["--no-lint"]) {
        _log.warn("Linting is disabled");
    }
    if (args["--no-mangling"]) {
        _log.warn("Mangling is disabled. Note: This may affect performance and should only be used for debugging purposes");
    }
    const dir = (0, _getprojectdir.getProjectDir)(args._[0]);
    // Check if the provided directory exists
    if (!(0, _fs.existsSync)(dir)) {
        (0, _utils.printAndExit)(`> No such directory exists as the project root: ${dir}`);
    }
    if (args["--experimental-turbo"]) {
        process.env.TURBOPACK = "1";
    }
    return (0, _build.default)(dir, args["--profile"], args["--debug"] || process.env.NEXT_DEBUG_BUILD, !args["--no-lint"], args["--no-mangling"], args["--experimental-app-only"], !!process.env.TURBOPACK, args["--experimental-turbo-root"], args["--build-mode"] || "default").catch((err)=>{
        console.error("");
        if ((0, _iserror.default)(err) && (err.code === "INVALID_RESOLVE_ALIAS" || err.code === "WEBPACK_ERRORS" || err.code === "BUILD_OPTIMIZATION_FAILED" || err.code === "NEXT_EXPORT_ERROR" || err.code === "NEXT_STATIC_GEN_BAILOUT" || err.code === "EDGE_RUNTIME_UNSUPPORTED_API")) {
            (0, _utils.printAndExit)(`> ${err.message}`);
        } else {
            console.error("> Build error occurred");
            (0, _utils.printAndExit)(err);
        }
    });
};

//# sourceMappingURL=next-build.js.map