"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getFreePort: null,
    genRenderExecArgv: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getFreePort: function() {
        return getFreePort;
    },
    genRenderExecArgv: function() {
        return genRenderExecArgv;
    }
});
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../../build/output/log"));
const _http = /*#__PURE__*/ _interop_require_default(require("http"));
const _utils = require("./utils");
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
const getFreePort = async ()=>{
    return new Promise((resolve, reject)=>{
        const server = _http.default.createServer(()=>{});
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
const genRenderExecArgv = async (isNodeDebugging, type)=>{
    const execArgv = process.execArgv.filter((localArg)=>{
        return !localArg.startsWith("--inspect") && !localArg.startsWith("--inspect-brk");
    });
    if (isNodeDebugging) {
        var _process_env_NODE_OPTIONS, _process_env_NODE_OPTIONS1;
        const isDebugging = process.execArgv.some((localArg)=>localArg.startsWith("--inspect")) || ((_process_env_NODE_OPTIONS = process.env.NODE_OPTIONS) == null ? void 0 : _process_env_NODE_OPTIONS.match == null ? void 0 : _process_env_NODE_OPTIONS.match(/--inspect(=\S+)?( |$)/));
        const isDebuggingWithBrk = process.execArgv.some((localArg)=>localArg.startsWith("--inspect-brk")) || ((_process_env_NODE_OPTIONS1 = process.env.NODE_OPTIONS) == null ? void 0 : _process_env_NODE_OPTIONS1.match == null ? void 0 : _process_env_NODE_OPTIONS1.match(/--inspect-brk(=\S+)?( |$)/));
        if (isDebugging || isDebuggingWithBrk) {
            let debugPort = (0, _utils.getDebugPort)();
            debugPort += type === "pages" ? 1 : 2;
            _log.info(`the --inspect${isDebuggingWithBrk ? "-brk" : ""} option was detected, the Next.js server${type === "pages" ? " for pages" : type === "app" ? " for app" : ""} should be inspected at port ${debugPort}.`);
            execArgv.push(`--inspect${isDebuggingWithBrk ? "-brk" : ""}=${debugPort}`);
        }
    }
    return execArgv;
};

//# sourceMappingURL=worker-utils.js.map