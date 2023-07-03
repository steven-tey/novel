"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    trace: null,
    flushAllTraces: null,
    SpanId: null,
    Span: null,
    SpanStatus: null,
    setGlobal: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    trace: function() {
        return _trace.trace;
    },
    flushAllTraces: function() {
        return _trace.flushAllTraces;
    },
    SpanId: function() {
        return _shared.SpanId;
    },
    Span: function() {
        return _trace.Span;
    },
    SpanStatus: function() {
        return _trace.SpanStatus;
    },
    setGlobal: function() {
        return _shared.setGlobal;
    }
});
const _trace = require("./trace");
const _shared = require("./shared");

//# sourceMappingURL=index.js.map