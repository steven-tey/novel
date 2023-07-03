#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "nextStart", {
    enumerable: true,
    get: function() {
        return nextStart;
    }
});
const _index = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/arg/index.js"));
const _startserver = require("../server/lib/start-server");
const _utils = require("../server/lib/utils");
const _iserror = /*#__PURE__*/ _interop_require_default(require("../lib/is-error"));
const _getprojectdir = require("../lib/get-project-dir");
const _path = require("path");
const _constants = require("../shared/lib/constants");
const _config = /*#__PURE__*/ _interop_require_default(require("../server/config"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const nextStart = async (argv)=>{
    const validArgs = {
        // Types
        "--help": Boolean,
        "--port": Number,
        "--hostname": String,
        "--keepAliveTimeout": Number,
        // Aliases
        "-h": "--help",
        "-p": "--port",
        "-H": "--hostname"
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
        Starts the application in production mode.
        The application should be compiled with \`next build\` first.

      Usage
        $ next start <dir> -p <port>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p          A port number on which to start the application
        --hostname, -H      Hostname on which to start the application (default: 0.0.0.0)
        --keepAliveTimeout  Max milliseconds to wait before closing inactive connections
        --help, -h          Displays this message
    `);
        process.exit(0);
    }
    const dir = (0, _getprojectdir.getProjectDir)(args._[0]);
    const host = args["--hostname"];
    const port = (0, _utils.getPort)(args);
    const keepAliveTimeoutArg = args["--keepAliveTimeout"];
    if (typeof keepAliveTimeoutArg !== "undefined" && (Number.isNaN(keepAliveTimeoutArg) || !Number.isFinite(keepAliveTimeoutArg) || keepAliveTimeoutArg < 0)) {
        (0, _utils.printAndExit)(`Invalid --keepAliveTimeout, expected a non negative number but received "${keepAliveTimeoutArg}"`, 1);
    }
    const keepAliveTimeout = keepAliveTimeoutArg ? Math.ceil(keepAliveTimeoutArg) : undefined;
    const config = await (0, _config.default)(_constants.PHASE_PRODUCTION_SERVER, (0, _path.resolve)(dir || "."), undefined, undefined, true);
    await (0, _startserver.startServer)({
        dir,
        isDev: false,
        hostname: host,
        port,
        keepAliveTimeout,
        useWorkers: !!config.experimental.appDir
    });
};

//# sourceMappingURL=next-start.js.map