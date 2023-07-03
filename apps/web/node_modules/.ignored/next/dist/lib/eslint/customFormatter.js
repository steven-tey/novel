"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MessageSeverity: null,
    formatResults: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MessageSeverity: function() {
        return MessageSeverity;
    },
    formatResults: function() {
        return formatResults;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var MessageSeverity;
(function(MessageSeverity) {
    MessageSeverity[MessageSeverity["Warning"] = 1] = "Warning";
    MessageSeverity[MessageSeverity["Error"] = 2] = "Error";
})(MessageSeverity || (MessageSeverity = {}));
function pluginCount(messages) {
    let nextPluginWarningCount = 0;
    let nextPluginErrorCount = 0;
    for(let i = 0; i < messages.length; i++){
        const { severity , ruleId  } = messages[i];
        if (ruleId == null ? void 0 : ruleId.includes("@next/next")) {
            if (severity === 1) {
                nextPluginWarningCount += 1;
            } else {
                nextPluginErrorCount += 1;
            }
        }
    }
    return {
        nextPluginErrorCount,
        nextPluginWarningCount
    };
}
function formatMessage(dir, messages, filePath) {
    let fileName = _path.default.posix.normalize(_path.default.relative(dir, filePath).replace(/\\/g, "/"));
    if (!fileName.startsWith(".")) {
        fileName = "./" + fileName;
    }
    let output = "\n" + _chalk.default.cyan(fileName);
    for(let i = 0; i < messages.length; i++){
        const { message , severity , line , column , ruleId  } = messages[i];
        output = output + "\n";
        if (line && column) {
            output = output + _chalk.default.yellow(line.toString()) + ":" + _chalk.default.yellow(column.toString()) + "  ";
        }
        if (severity === 1) {
            output += _chalk.default.yellow.bold("Warning") + ": ";
        } else {
            output += _chalk.default.red.bold("Error") + ": ";
        }
        output += message;
        if (ruleId) {
            output += "  " + _chalk.default.gray.bold(ruleId);
        }
    }
    return output;
}
function formatResults(baseDir, results, format) {
    let totalNextPluginErrorCount = 0;
    let totalNextPluginWarningCount = 0;
    let resultsWithMessages = results.filter(({ messages  })=>{
        return messages == null ? void 0 : messages.length;
    });
    // Track number of Next.js plugin errors and warnings
    resultsWithMessages.forEach(({ messages  })=>{
        const res = pluginCount(messages);
        totalNextPluginErrorCount += res.nextPluginErrorCount;
        totalNextPluginWarningCount += res.nextPluginWarningCount;
    });
    // Use user defined formatter or Next.js's built-in custom formatter
    const output = format ? format(resultsWithMessages) : resultsWithMessages.map(({ messages , filePath  })=>formatMessage(baseDir, messages, filePath)).join("\n");
    return {
        output: output,
        outputWithMessages: resultsWithMessages.length > 0 ? output + `\n\n${_chalk.default.cyan("info")}  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules` : "",
        totalNextPluginErrorCount,
        totalNextPluginWarningCount
    };
}

//# sourceMappingURL=customFormatter.js.map