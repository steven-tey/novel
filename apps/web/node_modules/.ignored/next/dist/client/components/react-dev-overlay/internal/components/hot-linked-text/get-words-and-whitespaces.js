// Returns true if the given character is a whitespace character, false otherwise.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getWordsAndWhitespaces", {
    enumerable: true,
    get: function() {
        return getWordsAndWhitespaces;
    }
});
function isWhitespace(char) {
    return char === " " || char === "\n" || char === "	" || char === "\r";
}
function getWordsAndWhitespaces(text) {
    const wordsAndWhitespaces = [];
    let current = "";
    let currentIsWhitespace = false;
    for (const char of text){
        if (current.length === 0) {
            current += char;
            currentIsWhitespace = isWhitespace(char);
            continue;
        }
        const nextIsWhitespace = isWhitespace(char);
        if (currentIsWhitespace === nextIsWhitespace) {
            current += char;
        } else {
            wordsAndWhitespaces.push(current);
            current = char;
            currentIsWhitespace = nextIsWhitespace;
        }
    }
    if (current.length > 0) {
        wordsAndWhitespaces.push(current);
    }
    return wordsAndWhitespaces;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=get-words-and-whitespaces.js.map