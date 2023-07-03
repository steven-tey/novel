#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "nextExport", {
    enumerable: true,
    get: function() {
        return nextExport;
    }
});
const _path = require("path");
const _fs = require("fs");
const _index = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/arg/index.js"));
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
const _export = /*#__PURE__*/ _interop_require_wildcard(require("../export"));
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../build/output/log"));
const _utils = require("../server/lib/utils");
const _trace = require("../trace");
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
const nextExport = (argv)=>{
    const nextExportCliSpan = (0, _trace.trace)("next-export-cli");
    const validArgs = {
        // Types
        "--help": Boolean,
        "--silent": Boolean,
        "--outdir": String,
        "--threads": Number,
        // Aliases
        "-h": "--help",
        "-o": "--outdir",
        "-s": "--silent"
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
        console.log(`
      Description
        [DEPRECATED] Exports a static version of the application for production deployment

      Usage
        $ next export [options] <dir>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
       --outdir, -o  Set the output dir (defaults to 'out')
       --silent, -s  Do not print any messages to console
       --threads     Max number of threads to use
       --help, -h    List this help

      The "next export" command is deprecated in favor of "output: export" in next.config.js
      Learn more: ${_chalk.default.cyan("https://nextjs.org/docs/advanced-features/static-html-export")}
    `);
        process.exit(0);
    }
    const dir = (0, _getprojectdir.getProjectDir)(args._[0]);
    // Check if pages dir exists and warn if not
    if (!(0, _fs.existsSync)(dir)) {
        (0, _utils.printAndExit)(`> No such directory exists as the project root: ${dir}`);
    }
    const options = {
        silent: args["--silent"] || false,
        threads: args["--threads"],
        outdir: args["--outdir"] ? (0, _path.resolve)(args["--outdir"]) : (0, _path.join)(dir, "out"),
        hasOutdirFromCli: Boolean(args["--outdir"]),
        isInvokedFromCli: true,
        hasAppDir: false,
        buildExport: false
    };
    (0, _export.default)(dir, options, nextExportCliSpan).then(()=>{
        nextExportCliSpan.stop();
        (0, _utils.printAndExit)(`Export successful. Files written to ${options.outdir}`, 0);
    }).catch((err)=>{
        nextExportCliSpan.stop();
        if (err instanceof _export.ExportError || err.code === "NEXT_EXPORT_ERROR") {
            _log.error(err.message);
        } else {
            console.error(err);
        }
        process.exit(1);
    });
};

//# sourceMappingURL=next-export.js.map