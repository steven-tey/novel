import * as Log from "../../build/output/log";
import http from "http";
import { getDebugPort } from "./utils";
export const getFreePort = async ()=>{
    return new Promise((resolve, reject)=>{
        const server = http.createServer(()=>{});
        server.listen(0, ()=>{
            const address = server.address();
            server.close();
            if (address && typeof address === "object") {
                resolve(address.port);
            } else {
                reject(new Error("invalid address from server: " + (address == null ? void 0 : address.toString())));
            }
        });
    });
};
export const genRenderExecArgv = async (isNodeDebugging, type)=>{
    const execArgv = process.execArgv.filter((localArg)=>{
        return !localArg.startsWith("--inspect") && !localArg.startsWith("--inspect-brk");
    });
    if (isNodeDebugging) {
        var _process_env_NODE_OPTIONS, _process_env_NODE_OPTIONS1;
        const isDebugging = process.execArgv.some((localArg)=>localArg.startsWith("--inspect")) || ((_process_env_NODE_OPTIONS = process.env.NODE_OPTIONS) == null ? void 0 : _process_env_NODE_OPTIONS.match == null ? void 0 : _process_env_NODE_OPTIONS.match(/--inspect(=\S+)?( |$)/));
        const isDebuggingWithBrk = process.execArgv.some((localArg)=>localArg.startsWith("--inspect-brk")) || ((_process_env_NODE_OPTIONS1 = process.env.NODE_OPTIONS) == null ? void 0 : _process_env_NODE_OPTIONS1.match == null ? void 0 : _process_env_NODE_OPTIONS1.match(/--inspect-brk(=\S+)?( |$)/));
        if (isDebugging || isDebuggingWithBrk) {
            let debugPort = getDebugPort();
            debugPort += type === "pages" ? 1 : 2;
            Log.info(`the --inspect${isDebuggingWithBrk ? "-brk" : ""} option was detected, the Next.js server${type === "pages" ? " for pages" : type === "app" ? " for app" : ""} should be inspected at port ${debugPort}.`);
            execArgv.push(`--inspect${isDebuggingWithBrk ? "-brk" : ""}=${debugPort}`);
        }
    }
    return execArgv;
};

//# sourceMappingURL=worker-utils.js.map