#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "nextTelemetry", {
    enumerable: true,
    get: function() {
        return nextTelemetry;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
const _index = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/arg/index.js"));
const _utils = require("../server/lib/utils");
const _storage = require("../telemetry/storage");
const _iserror = /*#__PURE__*/ _interop_require_default(require("../lib/is-error"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const nextTelemetry = (argv)=>{
    const validArgs = {
        // Types
        "--enable": Boolean,
        "--disable": Boolean,
        "--help": Boolean,
        // Aliases
        "-h": "--help"
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
        Allows you to control Next.js' telemetry collection

      Usage
        $ next telemetry [enable/disable]

      You may pass the 'enable' or 'disable' argument to turn Next.js' telemetry collection on or off.

      Options
       --enable    Enables Next.js' telemetry collection
       --disable   Disables Next.js' telemetry collection
       --help, -h  Displays this message

      Learn more: ${_chalk.default.cyan("https://nextjs.org/telemetry")}
    `);
        return;
    }
    const telemetry = new _storage.Telemetry({
        distDir: process.cwd()
    });
    let isEnabled = telemetry.isEnabled;
    if (args["--enable"] || args._[0] === "enable") {
        telemetry.setEnabled(true);
        console.log(_chalk.default.cyan("Success!"));
        console.log();
        isEnabled = true;
    } else if (args["--disable"] || args._[0] === "disable") {
        const path = telemetry.setEnabled(false);
        if (isEnabled) {
            console.log(_chalk.default.cyan(`Your preference has been saved${path ? ` to ${path}` : ""}.`));
        } else {
            console.log(_chalk.default.yellow(`Next.js' telemetry collection is already disabled.`));
        }
        console.log();
        isEnabled = false;
    } else {
        console.log(_chalk.default.bold("Next.js Telemetry"));
        console.log();
    }
    console.log(`Status: ${isEnabled ? _chalk.default.bold.green("Enabled") : _chalk.default.bold.red("Disabled")}`);
    console.log();
    if (isEnabled) {
        console.log(`Next.js telemetry is completely anonymous. Thank you for participating!`);
    } else {
        console.log(`You have opted-out of Next.js' anonymous telemetry program.`);
        console.log(`No data will be collected from your machine.`);
    }
    console.log(`Learn more: https://nextjs.org/telemetry`);
    console.log();
};

//# sourceMappingURL=next-telemetry.js.map