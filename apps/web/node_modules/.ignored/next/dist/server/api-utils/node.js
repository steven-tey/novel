"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    tryGetPreviewData: null,
    parseBody: null,
    apiResolver: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    tryGetPreviewData: function() {
        return tryGetPreviewData;
    },
    parseBody: function() {
        return parseBody;
    },
    apiResolver: function() {
        return apiResolver;
    }
});
const _ = require(".");
const _bytes = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/bytes"));
const _etag = require("../lib/etag");
const _sendpayload = require("../send-payload");
const _stream = require("stream");
const _contenttype = require("next/dist/compiled/content-type");
const _iserror = /*#__PURE__*/ _interop_require_default(require("../../lib/is-error"));
const _utils = require("../../shared/lib/utils");
const _interopdefault = require("../../lib/interop-default");
const _index = require("./index");
const _tracer = require("../lib/trace/tracer");
const _constants = require("../lib/trace/constants");
const _cookies = require("../web/spec-extension/cookies");
const _headers = require("../web/spec-extension/adapters/headers");
const _constants1 = require("../../lib/constants");
const _invokerequest = require("../lib/server-ipc/invoke-request");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function tryGetPreviewData(req, res, options) {
    var _cookies_get, _cookies_get1;
    // if an On-Demand revalidation is being done preview mode
    // is disabled
    if (options && (0, _.checkIsOnDemandRevalidate)(req, options).isOnDemandRevalidate) {
        return false;
    }
    // Read cached preview data if present
    // TODO: use request metadata instead of a symbol
    if (_index.SYMBOL_PREVIEW_DATA in req) {
        return req[_index.SYMBOL_PREVIEW_DATA];
    }
    const headers = _headers.HeadersAdapter.from(req.headers);
    const cookies = new _cookies.RequestCookies(headers);
    const previewModeId = (_cookies_get = cookies.get(_index.COOKIE_NAME_PRERENDER_BYPASS)) == null ? void 0 : _cookies_get.value;
    const tokenPreviewData = (_cookies_get1 = cookies.get(_index.COOKIE_NAME_PRERENDER_DATA)) == null ? void 0 : _cookies_get1.value;
    // Case: preview mode cookie set but data cookie is not set
    if (previewModeId && !tokenPreviewData && previewModeId === options.previewModeId) {
        // This is "Draft Mode" which doesn't use
        // previewData, so we return an empty object
        // for backwards compat with "Preview Mode".
        const data = {};
        Object.defineProperty(req, _index.SYMBOL_PREVIEW_DATA, {
            value: data,
            enumerable: false
        });
        return data;
    }
    // Case: neither cookie is set.
    if (!previewModeId && !tokenPreviewData) {
        return false;
    }
    // Case: one cookie is set, but not the other.
    if (!previewModeId || !tokenPreviewData) {
        (0, _index.clearPreviewData)(res);
        return false;
    }
    // Case: preview session is for an old build.
    if (previewModeId !== options.previewModeId) {
        (0, _index.clearPreviewData)(res);
        return false;
    }
    let encryptedPreviewData;
    try {
        const jsonwebtoken = require("next/dist/compiled/jsonwebtoken");
        encryptedPreviewData = jsonwebtoken.verify(tokenPreviewData, options.previewModeSigningKey);
    } catch  {
        // TODO: warn
        (0, _index.clearPreviewData)(res);
        return false;
    }
    const { decryptWithSecret  } = require("../crypto-utils");
    const decryptedPreviewData = decryptWithSecret(Buffer.from(options.previewModeEncryptionKey), encryptedPreviewData.data);
    try {
        // TODO: strict runtime type checking
        const data = JSON.parse(decryptedPreviewData);
        // Cache lookup
        Object.defineProperty(req, _index.SYMBOL_PREVIEW_DATA, {
            value: data,
            enumerable: false
        });
        return data;
    } catch  {
        return false;
    }
}
/**
 * Parse `JSON` and handles invalid `JSON` strings
 * @param str `JSON` string
 */ function parseJson(str) {
    if (str.length === 0) {
        // special-case empty json body, as it's a common client-side mistake
        return {};
    }
    try {
        return JSON.parse(str);
    } catch (e) {
        throw new _index.ApiError(400, "Invalid JSON");
    }
}
async function parseBody(req, limit) {
    let contentType;
    try {
        contentType = (0, _contenttype.parse)(req.headers["content-type"] || "text/plain");
    } catch  {
        contentType = (0, _contenttype.parse)("text/plain");
    }
    const { type , parameters  } = contentType;
    const encoding = parameters.charset || "utf-8";
    let buffer;
    try {
        const getRawBody = require("next/dist/compiled/raw-body");
        buffer = await getRawBody(req, {
            encoding,
            limit
        });
    } catch (e) {
        if ((0, _iserror.default)(e) && e.type === "entity.too.large") {
            throw new _index.ApiError(413, `Body exceeded ${limit} limit`);
        } else {
            throw new _index.ApiError(400, "Invalid body");
        }
    }
    const body = buffer.toString();
    if (type === "application/json" || type === "application/ld+json") {
        return parseJson(body);
    } else if (type === "application/x-www-form-urlencoded") {
        const qs = require("querystring");
        return qs.decode(body);
    } else {
        return body;
    }
}
function getMaxContentLength(responseLimit) {
    if (responseLimit && typeof responseLimit !== "boolean") {
        return _bytes.default.parse(responseLimit);
    }
    return _index.RESPONSE_LIMIT_DEFAULT;
}
/**
 * Send `any` body to response
 * @param req request object
 * @param res response object
 * @param body of response
 */ function sendData(req, res, body) {
    if (body === null || body === undefined) {
        res.end();
        return;
    }
    // strip irrelevant headers/body
    if (res.statusCode === 204 || res.statusCode === 304) {
        res.removeHeader("Content-Type");
        res.removeHeader("Content-Length");
        res.removeHeader("Transfer-Encoding");
        if (process.env.NODE_ENV === "development" && body) {
            console.warn(`A body was attempted to be set with a 204 statusCode for ${req.url}, this is invalid and the body was ignored.\n` + `See more info here https://nextjs.org/docs/messages/invalid-api-status-body`);
        }
        res.end();
        return;
    }
    const contentType = res.getHeader("Content-Type");
    if (body instanceof _stream.Stream) {
        if (!contentType) {
            res.setHeader("Content-Type", "application/octet-stream");
        }
        body.pipe(res);
        return;
    }
    const isJSONLike = [
        "object",
        "number",
        "boolean"
    ].includes(typeof body);
    const stringifiedBody = isJSONLike ? JSON.stringify(body) : body;
    const etag = (0, _etag.generateETag)(stringifiedBody);
    if ((0, _sendpayload.sendEtagResponse)(req, res, etag)) {
        return;
    }
    if (Buffer.isBuffer(body)) {
        if (!contentType) {
            res.setHeader("Content-Type", "application/octet-stream");
        }
        res.setHeader("Content-Length", body.length);
        res.end(body);
        return;
    }
    if (isJSONLike) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.setHeader("Content-Length", Buffer.byteLength(stringifiedBody));
    res.end(stringifiedBody);
}
/**
 * Send `JSON` object
 * @param res response object
 * @param jsonBody of data
 */ function sendJson(res, jsonBody) {
    // Set header to application/json
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // Use send to handle request
    res.send(JSON.stringify(jsonBody));
}
function isValidData(str) {
    return typeof str === "string" && str.length >= 16;
}
function setDraftMode(res, options) {
    if (!isValidData(options.previewModeId)) {
        throw new Error("invariant: invalid previewModeId");
    }
    const expires = options.enable ? undefined : new Date(0);
    // To delete a cookie, set `expires` to a date in the past:
    // https://tools.ietf.org/html/rfc6265#section-4.1.1
    // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
    const { serialize  } = require("next/dist/compiled/cookie");
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(_index.COOKIE_NAME_PRERENDER_BYPASS, options.previewModeId, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            expires
        })
    ]);
    return res;
}
function setPreviewData(res, data, options) {
    if (!isValidData(options.previewModeId)) {
        throw new Error("invariant: invalid previewModeId");
    }
    if (!isValidData(options.previewModeEncryptionKey)) {
        throw new Error("invariant: invalid previewModeEncryptionKey");
    }
    if (!isValidData(options.previewModeSigningKey)) {
        throw new Error("invariant: invalid previewModeSigningKey");
    }
    const jsonwebtoken = require("next/dist/compiled/jsonwebtoken");
    const { encryptWithSecret  } = require("../crypto-utils");
    const payload = jsonwebtoken.sign({
        data: encryptWithSecret(Buffer.from(options.previewModeEncryptionKey), JSON.stringify(data))
    }, options.previewModeSigningKey, {
        algorithm: "HS256",
        ...options.maxAge !== undefined ? {
            expiresIn: options.maxAge
        } : undefined
    });
    // limit preview mode cookie to 2KB since we shouldn't store too much
    // data here and browsers drop cookies over 4KB
    if (payload.length > 2048) {
        throw new Error(`Preview data is limited to 2KB currently, reduce how much data you are storing as preview data to continue`);
    }
    const { serialize  } = require("next/dist/compiled/cookie");
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(_index.COOKIE_NAME_PRERENDER_BYPASS, options.previewModeId, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            ...options.maxAge !== undefined ? {
                maxAge: options.maxAge
            } : undefined,
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }),
        serialize(_index.COOKIE_NAME_PRERENDER_DATA, payload, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            ...options.maxAge !== undefined ? {
                maxAge: options.maxAge
            } : undefined,
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        })
    ]);
    return res;
}
async function revalidate(urlPath, opts, req, context) {
    if (typeof urlPath !== "string" || !urlPath.startsWith("/")) {
        throw new Error(`Invalid urlPath provided to revalidate(), must be a path e.g. /blog/post-1, received ${urlPath}`);
    }
    const revalidateHeaders = {
        [_constants1.PRERENDER_REVALIDATE_HEADER]: context.previewModeId,
        ...opts.unstable_onlyGenerated ? {
            [_constants1.PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER]: "1"
        } : {}
    };
    const allowedRevalidateHeaderKeys = [
        ...context.allowedRevalidateHeaderKeys || [],
        ...context.trustHostHeader ? [
            "cookie",
            "x-vercel-protection-bypass"
        ] : []
    ];
    for (const key of Object.keys(req.headers)){
        if (allowedRevalidateHeaderKeys.includes(key)) {
            revalidateHeaders[key] = req.headers[key];
        }
    }
    try {
        if (context.trustHostHeader) {
            const res = await fetch(`https://${req.headers.host}${urlPath}`, {
                method: "HEAD",
                headers: revalidateHeaders
            });
            // we use the cache header to determine successful revalidate as
            // a non-200 status code can be returned from a successful revalidate
            // e.g. notFound: true returns 404 status code but is successful
            const cacheHeader = res.headers.get("x-vercel-cache") || res.headers.get("x-nextjs-cache");
            if ((cacheHeader == null ? void 0 : cacheHeader.toUpperCase()) !== "REVALIDATED" && !(res.status === 404 && opts.unstable_onlyGenerated)) {
                throw new Error(`Invalid response ${res.status}`);
            }
        } else if (context.revalidate) {
            // We prefer to use the IPC call if running under the workers mode.
            const ipcPort = process.env.__NEXT_PRIVATE_ROUTER_IPC_PORT;
            if (ipcPort) {
                const ipcKey = process.env.__NEXT_PRIVATE_ROUTER_IPC_KEY;
                const res = await (0, _invokerequest.invokeRequest)(`http://${context.hostname}:${ipcPort}?key=${ipcKey}&method=revalidate&args=${encodeURIComponent(JSON.stringify([
                    {
                        urlPath,
                        revalidateHeaders,
                        opts
                    }
                ]))}`, {
                    method: "GET",
                    headers: {}
                });
                const chunks = [];
                for await (const chunk of res){
                    if (chunk) {
                        chunks.push(chunk);
                    }
                }
                const body = Buffer.concat(chunks).toString();
                const result = JSON.parse(body);
                if (result.err) {
                    throw new Error(result.err.message);
                }
                return;
            }
            await context.revalidate({
                urlPath,
                revalidateHeaders,
                opts
            });
        } else {
            throw new Error(`Invariant: required internal revalidate method not passed to api-utils`);
        }
    } catch (err) {
        throw new Error(`Failed to revalidate ${urlPath}: ${(0, _iserror.default)(err) ? err.message : err}`);
    }
}
async function apiResolver(req, res, query, resolverModule, apiContext, propagateError, dev, page) {
    const apiReq = req;
    const apiRes = res;
    try {
        var _config_api, _config_api1, _config_api2, _getTracer_getRootSpanAttributes;
        if (!resolverModule) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
        }
        const config = resolverModule.config || {};
        const bodyParser = ((_config_api = config.api) == null ? void 0 : _config_api.bodyParser) !== false;
        const responseLimit = ((_config_api1 = config.api) == null ? void 0 : _config_api1.responseLimit) ?? true;
        const externalResolver = ((_config_api2 = config.api) == null ? void 0 : _config_api2.externalResolver) || false;
        // Parsing of cookies
        (0, _index.setLazyProp)({
            req: apiReq
        }, "cookies", (0, _index.getCookieParser)(req.headers));
        // Parsing query string
        apiReq.query = query;
        // Parsing preview data
        (0, _index.setLazyProp)({
            req: apiReq
        }, "previewData", ()=>tryGetPreviewData(req, res, apiContext));
        // Checking if preview mode is enabled
        (0, _index.setLazyProp)({
            req: apiReq
        }, "preview", ()=>apiReq.previewData !== false ? true : undefined);
        // Set draftMode to the same value as preview
        (0, _index.setLazyProp)({
            req: apiReq
        }, "draftMode", ()=>apiReq.preview);
        // Parsing of body
        if (bodyParser && !apiReq.body) {
            apiReq.body = await parseBody(apiReq, config.api && config.api.bodyParser && config.api.bodyParser.sizeLimit ? config.api.bodyParser.sizeLimit : "1mb");
        }
        let contentLength = 0;
        const maxContentLength = getMaxContentLength(responseLimit);
        const writeData = apiRes.write;
        const endResponse = apiRes.end;
        apiRes.write = (...args)=>{
            contentLength += Buffer.byteLength(args[0] || "");
            return writeData.apply(apiRes, args);
        };
        apiRes.end = (...args)=>{
            if (args.length && typeof args[0] !== "function") {
                contentLength += Buffer.byteLength(args[0] || "");
            }
            if (responseLimit && contentLength >= maxContentLength) {
                console.warn(`API response for ${req.url} exceeds ${_bytes.default.format(maxContentLength)}. API Routes are meant to respond quickly. https://nextjs.org/docs/messages/api-routes-response-size-limit`);
            }
            return endResponse.apply(apiRes, args);
        };
        apiRes.status = (statusCode)=>(0, _index.sendStatusCode)(apiRes, statusCode);
        apiRes.send = (data)=>sendData(apiReq, apiRes, data);
        apiRes.json = (data)=>sendJson(apiRes, data);
        apiRes.redirect = (statusOrUrl, url)=>(0, _index.redirect)(apiRes, statusOrUrl, url);
        apiRes.setDraftMode = (options = {
            enable: true
        })=>setDraftMode(apiRes, Object.assign({}, apiContext, options));
        apiRes.setPreviewData = (data, options = {})=>setPreviewData(apiRes, data, Object.assign({}, apiContext, options));
        apiRes.clearPreviewData = (options = {})=>(0, _index.clearPreviewData)(apiRes, options);
        apiRes.revalidate = (urlPath, opts)=>revalidate(urlPath, opts || {}, req, apiContext);
        const resolver = (0, _interopdefault.interopDefault)(resolverModule);
        let wasPiped = false;
        if (process.env.NODE_ENV !== "production") {
            // listen for pipe event and don't show resolve warning
            res.once("pipe", ()=>wasPiped = true);
        }
        (_getTracer_getRootSpanAttributes = (0, _tracer.getTracer)().getRootSpanAttributes()) == null ? void 0 : _getTracer_getRootSpanAttributes.set("next.route", page);
        // Call API route method
        const apiRouteResult = await (0, _tracer.getTracer)().trace(_constants.NodeSpan.runHandler, {
            spanName: `executing api route (pages) ${page}`
        }, ()=>resolver(req, res));
        if (process.env.NODE_ENV !== "production") {
            if (typeof apiRouteResult !== "undefined") {
                if (apiRouteResult instanceof Response) {
                    throw new Error('API route returned a Response object in the Node.js runtime, this is not supported. Please use `runtime: "edge"` instead: https://nextjs.org/docs/api-routes/edge-api-routes');
                }
                console.warn(`API handler should not return a value, received ${typeof apiRouteResult}.`);
            }
            if (!externalResolver && !(0, _utils.isResSent)(res) && !wasPiped) {
                console.warn(`API resolved without sending a response for ${req.url}, this may result in stalled requests.`);
            }
        }
    } catch (err) {
        if (err instanceof _index.ApiError) {
            (0, _index.sendError)(apiRes, err.statusCode, err.message);
        } else {
            if (dev) {
                if ((0, _iserror.default)(err)) {
                    err.page = page;
                }
                throw err;
            }
            console.error(err);
            if (propagateError) {
                throw err;
            }
            (0, _index.sendError)(apiRes, 500, "Internal Server Error");
        }
    }
}

//# sourceMappingURL=node.js.map