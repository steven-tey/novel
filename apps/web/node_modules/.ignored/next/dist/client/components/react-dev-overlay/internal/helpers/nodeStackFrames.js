"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getFilesystemFrame: null,
    getErrorSource: null,
    decorateServerError: null,
    getServerError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getFilesystemFrame: function() {
        return getFilesystemFrame;
    },
    getErrorSource: function() {
        return getErrorSource;
    },
    decorateServerError: function() {
        return decorateServerError;
    },
    getServerError: function() {
        return getServerError;
    }
});
const _stacktraceparser = require("next/dist/compiled/stacktrace-parser");
function getFilesystemFrame(frame) {
    const f = {
        ...frame
    };
    if (typeof f.file === "string") {
        if (// Posix:
        f.file.startsWith("/") || // Win32:
        /^[a-z]:\\/i.test(f.file) || // Win32 UNC:
        f.file.startsWith("\\\\")) {
            f.file = "file://" + f.file;
        }
    }
    return f;
}
const symbolError = Symbol("NextjsError");
function getErrorSource(error) {
    return error[symbolError] || null;
}
function decorateServerError(error, type) {
    Object.defineProperty(error, symbolError, {
        writable: false,
        enumerable: false,
        configurable: false,
        value: type
    });
}
function getServerError(error, type) {
    let n;
    try {
        throw new Error(error.message);
    } catch (e) {
        n = e;
    }
    n.name = error.name;
    try {
        n.stack = n.toString() + "\n" + (0, _stacktraceparser.parse)(error.stack).map(getFilesystemFrame).map((f)=>{
            let str = "    at " + f.methodName;
            if (f.file) {
                let loc = f.file;
                if (f.lineNumber) {
                    loc += ":" + f.lineNumber;
                    if (f.column) {
                        loc += ":" + f.column;
                    }
                }
                str += " (" + loc + ")";
            }
            return str;
        }).join("\n");
    } catch (e) {
        n.stack = error.stack;
    }
    decorateServerError(n, type);
    return n;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=nodeStackFrames.js.map