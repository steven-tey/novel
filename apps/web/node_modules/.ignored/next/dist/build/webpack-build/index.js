"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "webpackBuild", {
    enumerable: true,
    get: function() {
        return webpackBuild;
    }
});
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../output/log"));
const _buildcontext = require("../build-context");
const _jestworker = require("next/dist/compiled/jest-worker");
const _debug = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/debug"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
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
const debug = (0, _debug.default)("next:build:webpack-build");
async function webpackBuildWithWorker() {
    const { config , telemetryPlugin , buildSpinner , nextBuildSpan , ...prunedBuildContext } = _buildcontext.NextBuildContext;
    const getWorker = (compilerName)=>{
        var _worker__workerPool;
        const _worker = new _jestworker.Worker(_path.default.join(__dirname, "impl.js"), {
            exposedMethods: [
                "workerMain"
            ],
            numWorkers: 1,
            maxRetries: 0,
            forkOptions: {
                env: {
                    ...process.env,
                    NEXT_PRIVATE_BUILD_WORKER: "1"
                }
            }
        });
        _worker.getStderr().pipe(process.stderr);
        _worker.getStdout().pipe(process.stdout);
        for (const worker of ((_worker__workerPool = _worker._workerPool) == null ? void 0 : _worker__workerPool._workers) || []){
            worker._child.on("exit", (code, signal)=>{
                if (code || signal) {
                    console.error(`Compiler ${compilerName} unexpectedly exited with code: ${code} and signal: ${signal}`);
                }
            });
        }
        return _worker;
    };
    const combinedResult = {
        duration: 0,
        turbotraceContext: {}
    };
    // order matters here
    const ORDERED_COMPILER_NAMES = [
        "server",
        "edge-server",
        "client"
    ];
    for (const compilerName of ORDERED_COMPILER_NAMES){
        var _curResult_serializedPagesManifestEntries, _curResult_serializedPagesManifestEntries1, _curResult_serializedPagesManifestEntries2, _curResult_serializedPagesManifestEntries3, _curResult_turbotraceContext;
        const worker = getWorker(compilerName);
        const curResult = await worker.workerMain({
            buildContext: prunedBuildContext,
            compilerName
        });
        // destroy worker so it's not sticking around using memory
        await worker.end();
        // Update plugin state
        prunedBuildContext.pluginState = curResult.pluginState;
        prunedBuildContext.serializedPagesManifestEntries = {
            edgeServerAppPaths: (_curResult_serializedPagesManifestEntries = curResult.serializedPagesManifestEntries) == null ? void 0 : _curResult_serializedPagesManifestEntries.edgeServerAppPaths,
            edgeServerPages: (_curResult_serializedPagesManifestEntries1 = curResult.serializedPagesManifestEntries) == null ? void 0 : _curResult_serializedPagesManifestEntries1.edgeServerPages,
            nodeServerAppPaths: (_curResult_serializedPagesManifestEntries2 = curResult.serializedPagesManifestEntries) == null ? void 0 : _curResult_serializedPagesManifestEntries2.nodeServerAppPaths,
            nodeServerPages: (_curResult_serializedPagesManifestEntries3 = curResult.serializedPagesManifestEntries) == null ? void 0 : _curResult_serializedPagesManifestEntries3.nodeServerPages
        };
        combinedResult.duration += curResult.duration;
        if ((_curResult_turbotraceContext = curResult.turbotraceContext) == null ? void 0 : _curResult_turbotraceContext.entriesTrace) {
            combinedResult.turbotraceContext = curResult.turbotraceContext;
            const { entryNameMap  } = combinedResult.turbotraceContext.entriesTrace;
            if (entryNameMap) {
                combinedResult.turbotraceContext.entriesTrace.entryNameMap = new Map(entryNameMap);
            }
        }
    }
    buildSpinner == null ? void 0 : buildSpinner.stopAndPersist();
    _log.info("Compiled successfully");
    return combinedResult;
}
async function webpackBuild() {
    const config = _buildcontext.NextBuildContext.config;
    if (config.experimental.webpackBuildWorker) {
        debug("using separate compiler workers");
        return await webpackBuildWithWorker();
    } else {
        debug("building all compilers in same process");
        const webpackBuildImpl = require("./impl").webpackBuildImpl;
        return await webpackBuildImpl();
    }
}

//# sourceMappingURL=index.js.map