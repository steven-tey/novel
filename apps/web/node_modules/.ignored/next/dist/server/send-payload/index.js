"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    setRevalidateHeaders: null,
    sendEtagResponse: null,
    sendRenderResult: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    setRevalidateHeaders: function() {
        return _revalidateheaders.setRevalidateHeaders;
    },
    sendEtagResponse: function() {
        return sendEtagResponse;
    },
    sendRenderResult: function() {
        return sendRenderResult;
    }
});
const _utils = require("../../shared/lib/utils");
const _etag = require("../lib/etag");
const _fresh = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/fresh"));
const _revalidateheaders = require("./revalidate-headers");
const _approuterheaders = require("../../client/components/app-router-headers");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function sendEtagResponse(req, res, etag) {
    if (etag) {
        /**
     * The server generating a 304 response MUST generate any of the
     * following header fields that would have been sent in a 200 (OK)
     * response to the same request: Cache-Control, Content-Location, Date,
     * ETag, Expires, and Vary. https://tools.ietf.org/html/rfc7232#section-4.1
     */ res.setHeader("ETag", etag);
    }
    if ((0, _fresh.default)(req.headers, {
        etag
    })) {
        res.statusCode = 304;
        res.end();
        return true;
    }
    return false;
}
async function sendRenderResult({ req , res , result , type , generateEtags , poweredByHeader , options  }) {
    if ((0, _utils.isResSent)(res)) {
        return;
    }
    if (poweredByHeader && type === "html") {
        res.setHeader("X-Powered-By", "Next.js");
    }
    if (options != null) {
        (0, _revalidateheaders.setRevalidateHeaders)(res, options);
    }
    const payload = result.isDynamic ? null : await result.toUnchunkedString();
    if (payload !== null) {
        const etag = generateEtags ? (0, _etag.generateETag)(payload) : undefined;
        if (sendEtagResponse(req, res, etag)) {
            return;
        }
    }
    if (!res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", result.contentType ? result.contentType : type === "rsc" ? _approuterheaders.RSC_CONTENT_TYPE_HEADER : type === "json" ? "application/json" : "text/html; charset=utf-8");
    }
    if (payload) {
        res.setHeader("Content-Length", Buffer.byteLength(payload));
    }
    if (req.method === "HEAD") {
        res.end(null);
    } else if (payload !== null) {
        res.end(payload);
    } else {
        await result.pipe(res);
    }
}

//# sourceMappingURL=index.js.map