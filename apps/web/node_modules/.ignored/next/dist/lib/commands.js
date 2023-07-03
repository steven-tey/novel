"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "commands", {
    enumerable: true,
    get: function() {
        return commands;
    }
});
const commands = {
    build: ()=>Promise.resolve(require("../cli/next-build").nextBuild),
    start: ()=>Promise.resolve(require("../cli/next-start").nextStart),
    export: ()=>Promise.resolve(require("../cli/next-export").nextExport),
    dev: ()=>Promise.resolve(require("../cli/next-dev").nextDev),
    lint: ()=>Promise.resolve(require("../cli/next-lint").nextLint),
    telemetry: ()=>Promise.resolve(require("../cli/next-telemetry").nextTelemetry),
    info: ()=>Promise.resolve(require("../cli/next-info").nextInfo),
    "experimental-compile": ()=>Promise.resolve(require("../cli/next-build").nextBuild),
    "experimental-generate": ()=>Promise.resolve(require("../cli/next-build").nextBuild)
};

//# sourceMappingURL=commands.js.map