import * as Log from "../../build/output/log";
export function printAndExit(message, code = 1) {
    if (code === 0) {
        console.log(message);
    } else {
        console.error(message);
    }
    process.exit(code);
}
export const getDebugPort = ()=>{
    var _process_execArgv_find, _process_env_NODE_OPTIONS, _process_env_NODE_OPTIONS_match;
    const debugPortStr = ((_process_execArgv_find = process.execArgv.find((localArg)=>localArg.startsWith("--inspect") || localArg.startsWith("--inspect-brk"))) == null ? void 0 : _process_execArgv_find.split("=")[1]) ?? ((_process_env_NODE_OPTIONS = process.env.NODE_OPTIONS) == null ? void 0 : _process_env_NODE_OPTIONS.match == null ? void 0 : (_process_env_NODE_OPTIONS_match = _process_env_NODE_OPTIONS.match(/--inspect(-brk)?(=(\S+))?( |$)/)) == null ? void 0 : _process_env_NODE_OPTIONS_match[3]);
    return debugPortStr ? parseInt(debugPortStr, 10) : 9229;
};
export const genRouterWorkerExecArgv = async (isNodeDebugging)=>{
    const execArgv = process.execArgv.filter((localArg)=>{
        return !localArg.startsWith("--inspect") && !localArg.startsWith("--inspect-brk");
    });
    if (isNodeDebugging) {
        const isDebuggingWithBrk = isNodeDebugging === "brk";
        let debugPort = getDebugPort() + 1;
        Log.info(`the --inspect${isDebuggingWithBrk ? "-brk" : ""} option was detected, the Next.js routing server should be inspected at port ${debugPort}.`);
        execArgv.push(`--inspect${isNodeDebugging === "brk" ? "-brk" : ""}=${debugPort}`);
    }
    return execArgv;
};
const NODE_INSPECT_RE = /--inspect(-brk)?(=\S+)?( |$)/;
export function getNodeOptionsWithoutInspect() {
    return (process.env.NODE_OPTIONS || "").replace(NODE_INSPECT_RE, "");
}
export function getPort(args) {
    if (typeof args["--port"] === "number") {
        return args["--port"];
    }
    const parsed = process.env.PORT && parseInt(process.env.PORT, 10);
    if (typeof parsed === "number" && !Number.isNaN(parsed)) {
        return parsed;
    }
    return 3000;
}

//# sourceMappingURL=utils.js.map