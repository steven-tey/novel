import createStore from "next/dist/compiled/unistore";
import stripAnsi from "next/dist/compiled/strip-ansi";
import { flushAllTraces } from "../../trace";
import { teardownCrashReporter, teardownHeapProfiler, teardownTraceSubscriber } from "../swc";
import * as Log from "./log";
export const store = createStore({
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
            Log.ready(`started server on ${state.bindAddr}, url: ${state.appUrl}`);
        }
        return;
    }
    if (state.loading) {
        if (state.trigger) {
            if (state.trigger !== "initial") {
                Log.wait(`compiling ${state.trigger}...`);
            }
        } else {
            Log.wait("compiling...");
        }
        if (startTime === 0) {
            startTime = Date.now();
        }
        return;
    }
    if (state.errors) {
        Log.error(state.errors[0]);
        const cleanError = stripAnsi(state.errors[0]);
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
        flushAllTraces();
        teardownTraceSubscriber();
        teardownHeapProfiler();
        teardownCrashReporter();
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
        Log.warn(state.warnings.join("\n\n"));
        // Ensure traces are flushed after each compile in development mode
        flushAllTraces();
        teardownTraceSubscriber();
        teardownHeapProfiler();
        teardownCrashReporter();
        return;
    }
    if (state.typeChecking) {
        Log.info(`bundled${partialMessage} successfully${timeMessage}${modulesMessage}, waiting for typecheck results...`);
        return;
    }
    Log.event(`compiled${partialMessage} successfully${timeMessage}${modulesMessage}`);
    // Ensure traces are flushed after each compile in development mode
    flushAllTraces();
    teardownTraceSubscriber();
    teardownHeapProfiler();
    teardownCrashReporter();
});

//# sourceMappingURL=store.js.map