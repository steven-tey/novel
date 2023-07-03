import isError from "../../lib/is-error";
import * as Log from "../../build/output/log";
export function logAppDirError(err) {
    if (isError(err) && (err == null ? void 0 : err.stack)) {
        const filteredStack = err.stack.split("\n").map((line)=>// Remove 'webpack-internal:' noise from the path
            line.replace(/(webpack-internal:\/\/\/|file:\/\/)(\(.*\)\/)?/, ""))// Only display stack frames from the user's code
        .filter((line)=>!/next[\\/]dist[\\/]compiled/.test(line) && !/node_modules[\\/]/.test(line) && !/node:internal[\\/]/.test(line)).join("\n");
        Log.error(filteredStack);
        if (typeof err.digest !== "undefined") {
            console.error(`digest: ${JSON.stringify(err.digest)}`);
        }
    } else {
        Log.error(err);
    }
}

//# sourceMappingURL=log-app-dir-error.js.map