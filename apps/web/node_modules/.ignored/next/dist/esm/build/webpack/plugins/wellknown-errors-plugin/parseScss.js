import Chalk from "next/dist/compiled/chalk";
import { SimpleWebpackError } from "./simpleWebpackError";
const chalk = new Chalk.constructor({
    enabled: true
});
const regexScssError = /SassError: (.+)\n\s+on line (\d+) [\s\S]*?>> (.+)\n\s*(-+)\^$/m;
export function getScssError(fileName, fileContent, err) {
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
        return new SimpleWebpackError(`${chalk.cyan(fileName)}:${chalk.yellow(lineNumber.toString())}:${chalk.yellow(column.toString())}`, chalk.red.bold("Syntax error").concat(`: ${reason}\n\n${frame ?? backupFrame}`));
    }
    return false;
}

//# sourceMappingURL=parseScss.js.map