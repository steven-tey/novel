import chalk from "next/dist/compiled/chalk";
import { Worker } from "next/dist/compiled/jest-worker";
import { existsSync } from "fs";
import { join } from "path";
import { ESLINT_DEFAULT_DIRS, ESLINT_DEFAULT_DIRS_WITH_APP } from "./constants";
import { eventLintCheckCompleted } from "../telemetry/events";
import { CompileError } from "./compile-error";
import isError from "./is-error";
export async function verifyAndLint(dir, cacheLocation, configLintDirs, enableWorkerThreads, telemetry, hasAppDir) {
    try {
        const lintWorkers = new Worker(require.resolve("./eslint/runLintCheck"), {
            numWorkers: 1,
            enableWorkerThreads,
            maxRetries: 0
        });
        lintWorkers.getStdout().pipe(process.stdout);
        lintWorkers.getStderr().pipe(process.stderr);
        // Remove that when the `appDir` will be stable.
        const directoriesToLint = hasAppDir ? ESLINT_DEFAULT_DIRS_WITH_APP : ESLINT_DEFAULT_DIRS;
        const lintDirs = (configLintDirs ?? directoriesToLint).reduce((res, d)=>{
            const currDir = join(dir, d);
            if (!existsSync(currDir)) return res;
            res.push(currDir);
            return res;
        }, []);
        const lintResults = await lintWorkers.runLintCheck(dir, lintDirs, hasAppDir, {
            lintDuringBuild: true,
            eslintOptions: {
                cacheLocation
            }
        });
        const lintOutput = typeof lintResults === "string" ? lintResults : lintResults == null ? void 0 : lintResults.output;
        if (typeof lintResults !== "string" && (lintResults == null ? void 0 : lintResults.eventInfo)) {
            telemetry.record(eventLintCheckCompleted({
                ...lintResults.eventInfo,
                buildLint: true
            }));
        }
        if (typeof lintResults !== "string" && (lintResults == null ? void 0 : lintResults.isError) && lintOutput) {
            await telemetry.flush();
            throw new CompileError(lintOutput);
        }
        if (lintOutput) {
            console.log(lintOutput);
        }
        lintWorkers.end();
    } catch (err) {
        if (isError(err)) {
            if (err.type === "CompileError" || err instanceof CompileError) {
                console.error(chalk.red("\nFailed to compile."));
                console.error(err.message);
                process.exit(1);
            } else if (err.type === "FatalError") {
                console.error(err.message);
                process.exit(1);
            }
        }
        throw err;
    }
}

//# sourceMappingURL=verifyAndLint.js.map