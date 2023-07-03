"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    prefixes: null,
    wait: null,
    error: null,
    warn: null,
    ready: null,
    info: null,
    event: null,
    trace: null,
    warnOnce: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    prefixes: function() {
        return prefixes;
    },
    wait: function() {
        return wait;
    },
    error: function() {
        return error;
    },
    warn: function() {
        return warn;
    },
    ready: function() {
        return ready;
    },
    info: function() {
        return info;
    },
    event: function() {
        return event;
    },
    trace: function() {
        return trace;
    },
    warnOnce: function() {
        return warnOnce;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("../../lib/chalk"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const prefixes = {
    wait: "- " + _chalk.default.cyan("wait"),
    error: "- " + _chalk.default.red("error"),
    warn: "- " + _chalk.default.yellow("warn"),
    ready: "- " + _chalk.default.green("ready"),
    info: "- " + _chalk.default.cyan("info"),
    event: "- " + _chalk.default.magenta("event"),
    trace: "- " + _chalk.default.magenta("trace")
};
function wait(...message) {
    console.log(prefixes.wait, ...message);
}
function error(...message) {
    console.error(prefixes.error, ...message);
}
function warn(...message) {
    console.warn(prefixes.warn, ...message);
}
function ready(...message) {
    console.log(prefixes.ready, ...message);
}
function info(...message) {
    console.log(prefixes.info, ...message);
}
function event(...message) {
    console.log(prefixes.event, ...message);
}
function trace(...message) {
    console.log(prefixes.trace, ...message);
}
const warnOnceMessages = new Set();
function warnOnce(...message) {
    if (!warnOnceMessages.has(message[0])) {
        warnOnceMessages.add(message.join(" "));
        warn(...message);
    }
}

//# sourceMappingURL=log.js.map