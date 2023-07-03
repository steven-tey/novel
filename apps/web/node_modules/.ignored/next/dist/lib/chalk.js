"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
let chalk;
if (process.env.NEXT_RUNTIME === "edge") {
    chalk = require("./web/chalk").default;
} else {
    chalk = require("next/dist/compiled/chalk");
}
const _default = chalk;

//# sourceMappingURL=chalk.js.map