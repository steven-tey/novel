"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    serveStatic: null,
    getContentType: null,
    getExtension: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    serveStatic: function() {
        return serveStatic;
    },
    getContentType: function() {
        return getContentType;
    },
    getExtension: function() {
        return getExtension;
    }
});
const _send = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/send"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// TODO: Remove this once "send" has updated the "mime", or next.js use custom version of "mime"
// Although "mime" has already add avif in version 2.4.7, "send" is still using mime@1.6.0
_send.default.mime.define({
    "image/avif": [
        "avif"
    ]
});
function serveStatic(req, res, path) {
    return new Promise((resolve, reject)=>{
        (0, _send.default)(req, path).on("directory", ()=>{
            // We don't allow directories to be read.
            const err = new Error("No directory access");
            err.code = "ENOENT";
            reject(err);
        }).on("error", reject).pipe(res).on("finish", resolve);
    });
}
function getContentType(extWithoutDot) {
    const { mime  } = _send.default;
    if ("getType" in mime) {
        // 2.0
        return mime.getType(extWithoutDot);
    }
    // 1.0
    return mime.lookup(extWithoutDot);
}
function getExtension(contentType) {
    const { mime  } = _send.default;
    if ("getExtension" in mime) {
        // 2.0
        return mime.getExtension(contentType);
    }
    // 1.0
    return mime.extension(contentType);
}

//# sourceMappingURL=serve-static.js.map