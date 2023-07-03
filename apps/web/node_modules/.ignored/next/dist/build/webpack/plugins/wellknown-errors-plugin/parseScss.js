"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getScssError", {
    enumerable: true,
    get: function() {
        return getScssError;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
const _simpleWebpackError = require("./simpleWebpackError");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const chalk = new _chalk.default.constructor({
    enabled: true
});
const regexScssError = /SassError: (.+)\n\s+on line (\d+) [\s\S]*?>> (.+)\n\s*(-+)\^$/m;
function getScssError(fileName, fileContent, err) {
    if (err.name !== "SassError") {
        return false;
    }
    const res = regexScssError.exec(err.message);
    if (res) {
        const [, reason, _lineNumer, backupFrame, columnString] = res;
        const lineNumber = Math.max(1, parseInt(_lineNumer, 10));
        const column = (columnString == null ? void 0 : columnString.length) ?? 1;
        let frame;
        if (fileContent) {
            try {
                const { codeFrameColumns  } = require("next/dist/compiled/babel/code-frame");
                frame = codeFrameColumns(fileContent, {
                    start: {
                        line: lineNumber,
                        column
                    }
                }, {
                    forceColor: true
                });
            } catch  {}
        }
        return new _simpleWebpackError.SimpleWebpackError(`${chalk.cyan(fileName)}:${chalk.yellow(lineNumber.toString())}:${chalk.yellow(column.toString())}`, chalk.red.bold("Syntax error").concat(`: ${reason}\n\n${frame ?? backupFrame}`));
    }
    return false;
}

//# sourceMappingURL=parseScss.js.map