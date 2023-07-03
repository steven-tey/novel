"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "missingDepsError", {
    enumerable: true,
    get: function() {
        return missingDepsError;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
const _oxfordcommalist = require("../oxford-comma-list");
const _fatalerror = require("../fatal-error");
const _getpkgmanager = require("../helpers/get-pkg-manager");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function missingDepsError(dir, missingPackages) {
    const packagesHuman = (0, _oxfordcommalist.getOxfordCommaList)(missingPackages.map((p)=>p.pkg));
    const packagesCli = missingPackages.map((p)=>p.pkg).join(" ");
    const packageManager = (0, _getpkgmanager.getPkgManager)(dir);
    const removalMsg = "\n\n" + _chalk.default.bold("If you are not trying to use TypeScript, please remove the " + _chalk.default.cyan("tsconfig.json") + " file from your package root (and any TypeScript files in your pages directory).");
    throw new _fatalerror.FatalError(_chalk.default.bold.red(`It looks like you're trying to use TypeScript but do not have the required package(s) installed.`) + "\n\n" + _chalk.default.bold(`Please install ${_chalk.default.bold(packagesHuman)} by running:`) + "\n\n" + `\t${_chalk.default.bold.cyan((packageManager === "yarn" ? "yarn add --dev" : packageManager === "pnpm" ? "pnpm install --save-dev" : "npm install --save-dev") + " " + packagesCli)}` + removalMsg + "\n");
}

//# sourceMappingURL=missingDependencyError.js.map