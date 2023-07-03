"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    encodeText: null,
    decodeText: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    encodeText: function() {
        return encodeText;
    },
    decodeText: function() {
        return decodeText;
    }
});
function encodeText(input) {
    return new TextEncoder().encode(input);
}
function decodeText(input, textDecoder) {
    return textDecoder.decode(input, {
        stream: true
    });
}

//# sourceMappingURL=encode-decode.js.map