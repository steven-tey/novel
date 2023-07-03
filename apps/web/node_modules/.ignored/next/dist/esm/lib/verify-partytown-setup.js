import { promises } from "fs";
import chalk from "next/dist/compiled/chalk";
import path from "path";
import { hasNecessaryDependencies } from "./has-necessary-dependencies";
import { fileExists, FileType } from "./file-exists";
import { FatalError } from "./fatal-error";
import { recursiveDelete } from "./recursive-delete";
import * as Log from "../build/output/log";
import { getPkgManager } from "./helpers/get-pkg-manager";
async function missingDependencyError(dir) {
    const packageManager = getPkgManager(dir);
    throw new FatalError(chalk.bold.red("It looks like you're trying to use Partytown with next/script but do not have the required package(s) installed.") + "\n\n" + chalk.bold(`Please install Partytown by running:`) + "\n\n" + `\t${chalk.bold.cyan((packageManager === "yarn" ? "yarn add --dev" : packageManager === "pnpm" ? "pnpm install --save-dev" : "npm install --save-dev") + " @builder.io/partytown")}` + "\n\n" + chalk.bold(`If you are not trying to use Partytown, please disable the experimental ${chalk.cyan('"nextScriptWorkers"')} flag in next.config.js.`) + "\n");
}
async function copyPartytownStaticFiles(deps, staticDir) {
    const partytownLibDir = path.join(staticDir, "~partytown");
    const hasPartytownLibDir = await fileExists(partytownLibDir, FileType.Directory);
    if (hasPartytownLibDir) {
        await recursiveDelete(partytownLibDir);
        await promises.rmdir(partytownLibDir);
    }
    const { copyLibFiles  } = await Promise.resolve(require(path.join(deps.resolved.get("@builder.io/partytown"), "../utils")));
    await copyLibFiles(partytownLibDir);
}
export async function verifyPartytownSetup(dir, targetDir) {
    try {
        var _partytownDeps_missing;
        const partytownDeps = await hasNecessaryDependencies(dir, [
            {
                file: "@builder.io/partytown",
                pkg: "@builder.io/partytown",
                exportsRestrict: false
            }
        ]);
        if (((_partytownDeps_missing = partytownDeps.missing) == null ? void 0 : _partytownDeps_missing.length) > 0) {
            await missingDependencyError(dir);
        } else {
            try {
                await copyPartytownStaticFiles(partytownDeps, targetDir);
            } catch (err) {
                Log.warn(`Partytown library files could not be copied to the static directory. Please ensure that ${chalk.bold.cyan("@builder.io/partytown")} is installed as a dependency.`);
            }
        }
    } catch (err) {
        // Don't show a stack trace when there is an error due to missing dependencies
        if (err instanceof FatalError) {
            console.error(err.message);
            process.exit(1);
        }
        throw err;
    }
}

//# sourceMappingURL=verify-partytown-setup.js.map