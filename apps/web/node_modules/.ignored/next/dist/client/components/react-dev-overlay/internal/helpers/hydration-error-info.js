"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    hydrationErrorWarning: null,
    hydrationErrorComponentStack: null,
    patchConsoleError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    hydrationErrorWarning: function() {
        return hydrationErrorWarning;
    },
    hydrationErrorComponentStack: function() {
        return hydrationErrorComponentStack;
    },
    patchConsoleError: function() {
        return patchConsoleError;
    }
});
let hydrationErrorWarning;
let hydrationErrorComponentStack;
// https://github.com/facebook/react/blob/main/packages/react-dom/src/__tests__/ReactDOMHydrationDiff-test.js used as a reference
const knownHydrationWarnings = new Set([
    'Warning: Text content did not match. Server: "%s" Client: "%s"%s',
    "Warning: Expected server HTML to contain a matching <%s> in <%s>.%s",
    'Warning: Expected server HTML to contain a matching text node for "%s" in <%s>.%s',
    "Warning: Did not expect server HTML to contain a <%s> in <%s>.%s",
    'Warning: Did not expect server HTML to contain the text node "%s" in <%s>.%s'
]);
function patchConsoleError() {
    const prev = console.error;
    console.error = function(msg, serverContent, clientContent, componentStack) {
        if (knownHydrationWarnings.has(msg)) {
            hydrationErrorWarning = msg.replace("%s", serverContent).replace("%s", clientContent).replace("%s", "");
            hydrationErrorComponentStack = componentStack;
        }
        // @ts-expect-error argument is defined
        prev.apply(console, arguments);
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=hydration-error-info.js.map