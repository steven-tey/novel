// Alias index file of next/server for edge runtime for tree-shaking purpose
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ImageResponse: null,
    NextRequest: null,
    NextResponse: null,
    userAgent: null,
    userAgentFromString: null,
    URLPattern: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ImageResponse: function() {
        return _imageresponse.default;
    },
    NextRequest: function() {
        return _nextrequest.default;
    },
    NextResponse: function() {
        return _nextresponse.default;
    },
    userAgent: function() {
        return _useragent.default;
    },
    userAgentFromString: function() {
        return _useragentfromstring.default;
    },
    URLPattern: function() {
        return _urlpattern.default;
    }
});
const _imageresponse = /*#__PURE__*/ _interop_require_default(require("./image-response"));
const _nextrequest = /*#__PURE__*/ _interop_require_default(require("./next-request"));
const _nextresponse = /*#__PURE__*/ _interop_require_default(require("./next-response"));
const _useragent = /*#__PURE__*/ _interop_require_default(require("./user-agent"));
const _useragentfromstring = /*#__PURE__*/ _interop_require_default(require("./user-agent-from-string"));
const _urlpattern = /*#__PURE__*/ _interop_require_default(require("./url-pattern"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map