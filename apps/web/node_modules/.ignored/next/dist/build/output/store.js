"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "store", {
    enumerable: true,
    get: function() {
        return store;
    }
});
const _unistore = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/unistore"));
const _stripansi = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/strip-ansi"));
const _trace = require("../../trace");
const _swc = require("../swc");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("./log"));
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
const store = (0, _unistore.default)({
    appUrl: null,
    bindAddr: null,
    bootstrap: true
});
let lastStore = {
    appUrl: null,
    bindAddr: null,
    bootstrap: true
};
function hasStoreChanged(nextStore) {
    if ([
        ...new Set([
            ...Object.keys(lastStore),
            ...Object.keys(nextStore)
        ])
    ].every((key)=>Object.is(lastStore[key], nextStore[key]))) {
        return false;
    }
    lastStore = nextStore;
    return true;
}
let startTime = 0;
store.subscribe((state)=>{
    if (!hasStoreChanged(state)) {
        return;
    }
    if (state.bootstrap) {
        if (state.appUrl) {
            _log.ready(`started server on ${state.bindAddr}, url: ${state.appUrl}`);
        }
        return;
    }
    if (state.loading) {
        if (state.trigger) {
            if (state.trigger !== "initial") {
                _log.wait(`compiling ${state.trigger}...`);
            }
        } else {
            _log.wait("compiling...");
        }
        if (startTime === 0) {
            startTime = Date.now();
        }
        return;
    }
    if (state.errors) {
        _log.error(state.errors[0]);
        const cleanError = (0, _stripansi.default)(state.errors[0]);
        if (cleanError.indexOf("SyntaxError") > -1) {
            const matches = cleanError.match(/\[.*\]=/);
            if (matches) {
                for (const match of matches){
                    const prop = (match.split("]").shift() || "").slice(1);
                    console.log(`AMP bind syntax [${prop}]='' is not supported in JSX, use 'data-amp-bind-${prop}' instead. https://nextjs.org/docs/messages/amp-bind-jsx-alt`);
                }
                return;
            }
        }
        startTime = 0;
        // Ensure traces are flushed after each compile in development mode
        (0, _trace.flushAllTraces)();
        (0, _swc.teardownTraceSubscriber)();
        (0, _swc.teardownHeapProfiler)();
        (0, _swc.teardownCrashReporter)();
        return;
    }
    let timeMessage = "";
    if (startTime) {
        const time = Date.now() - startTime;
        startTime = 0;
        timeMessage = time > 2000 ? ` in ${Math.round(time / 100) / 10}s` : ` in ${time} ms`;
    }
    let modulesMessage = "";
    if (state.modules) {
        modulesMessage = ` (${state.modules} modules)`;
    }
    let partialMessage = "";
    if (state.partial) {
        partialMessage = ` ${state.partial}`;
    }
    if (state.warnings) {
        _log.warn(state.warnings.join("\n\n"));
        // Ensure traces are flushed after each compile in development mode
        (0, _trace.flushAllTraces)();
        (0, _swc.teardownTraceSubscriber)();
        (0, _swc.teardownHeapProfiler)();
        (0, _swc.teardownCrashReporter)();
        return;
    }
    if (state.typeChecking) {
        _log.info(`bundled${partialMessage} successfully${timeMessage}${modulesMessage}, waiting for typecheck results...`);
        return;
    }
    _log.event(`compiled${partialMessage} successfully${timeMessage}${modulesMessage}`);
    // Ensure traces are flushed after each compile in development mode
    (0, _trace.flushAllTraces)();
    (0, _swc.teardownTraceSubscriber)();
    (0, _swc.teardownHeapProfiler)();
    (0, _swc.teardownCrashReporter)();
});

//# sourceMappingURL=store.js.map