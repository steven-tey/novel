"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handleAction", {
    enumerable: true,
    get: function() {
        return handleAction;
    }
});
const _approuterheaders = require("../../client/components/app-router-headers");
const _notfound = require("../../client/components/not-found");
const _redirect = require("../../client/components/redirect");
const _renderresult = /*#__PURE__*/ _interop_require_default(require("../render-result"));
const _flightrenderresult = require("./flight-render-result");
const _utils = require("../lib/server-ipc/utils");
const _requestcookies = require("../web/spec-extension/adapters/request-cookies");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function nodeToWebReadableStream(nodeReadable) {
    if (process.env.NEXT_RUNTIME !== "edge") {
        const { Readable  } = require("stream");
        if ("toWeb" in Readable && typeof Readable.toWeb === "function") {
            return Readable.toWeb(nodeReadable);
        }
        return new ReadableStream({
            start (controller) {
                nodeReadable.on("data", (chunk)=>{
                    controller.enqueue(chunk);
                });
                nodeReadable.on("end", ()=>{
                    controller.close();
                });
                nodeReadable.on("error", (error)=>{
                    controller.error(error);
                });
            }
        });
    } else {
        throw new Error("Invalid runtime");
    }
}
function formDataFromSearchQueryString(query) {
    const searchParams = new URLSearchParams(query);
    const formData = new FormData();
    for (const [key, value] of searchParams){
        formData.append(key, value);
    }
    return formData;
}
function nodeHeadersToRecord(headers) {
    const record = {};
    for (const [key, value] of Object.entries(headers)){
        if (value !== undefined) {
            record[key] = Array.isArray(value) ? value.join(", ") : `${value}`;
        }
    }
    return record;
}
function getForwardedHeaders(req, res) {
    // Get request headers and cookies
    const requestHeaders = req.headers;
    const requestCookies = requestHeaders["cookie"] ?? "";
    // Get response headers and Set-Cookie header
    const responseHeaders = res.getHeaders();
    const rawSetCookies = responseHeaders["set-cookie"];
    const setCookies = (Array.isArray(rawSetCookies) ? rawSetCookies : [
        rawSetCookies
    ]).map((setCookie)=>{
        // remove the suffixes like 'HttpOnly' and 'SameSite'
        const [cookie] = `${setCookie}`.split(";");
        return cookie;
    });
    // Merge request and response headers
    const mergedHeaders = (0, _utils.filterReqHeaders)({
        ...nodeHeadersToRecord(requestHeaders),
        ...nodeHeadersToRecord(responseHeaders)
    });
    // Merge cookies
    const mergedCookies = requestCookies.split("; ").concat(setCookies).join("; ");
    // Update the 'cookie' header with the merged cookies
    mergedHeaders["cookie"] = mergedCookies;
    // Remove headers that should not be forwarded
    delete mergedHeaders["transfer-encoding"];
    return new Headers(mergedHeaders);
}
function fetchIPv4v6(url, init, v6 = false) {
    const hostname = url.hostname;
    if (!v6 && hostname === "localhost") {
        url.hostname = "127.0.0.1";
    }
    return fetch(url, init).catch((err)=>{
        if (err.code === "ECONNREFUSED" && !v6) {
            return fetchIPv4v6(url, init, true);
        }
        throw err;
    });
}
async function addRevalidationHeader(res, { staticGenerationStore , requestStore  }) {
    var _staticGenerationStore_revalidatedTags;
    await Promise.all(staticGenerationStore.pendingRevalidates || []);
    // If a tag was revalidated, the client router needs to invalidate all the
    // client router cache as they may be stale. And if a path was revalidated, the
    // client needs to invalidate all subtrees below that path.
    // To keep the header size small, we use a tuple of
    // [[revalidatedPaths], isTagRevalidated ? 1 : 0, isCookieRevalidated ? 1 : 0]
    // instead of a JSON object.
    // TODO-APP: Currently the prefetch cache doesn't have subtree information,
    // so we need to invalidate the entire cache if a path was revalidated.
    // TODO-APP: Currently paths are treated as tags, so the second element of the tuple
    // is always empty.
    const isTagRevalidated = ((_staticGenerationStore_revalidatedTags = staticGenerationStore.revalidatedTags) == null ? void 0 : _staticGenerationStore_revalidatedTags.length) ? 1 : 0;
    const isCookieRevalidated = (0, _requestcookies.getModifiedCookieValues)(requestStore.mutableCookies).length ? 1 : 0;
    res.setHeader("x-action-revalidated", JSON.stringify([
        [],
        isTagRevalidated,
        isCookieRevalidated
    ]));
}
async function createRedirectRenderResult(req, res, redirectUrl, staticGenerationStore) {
    res.setHeader("x-action-redirect", redirectUrl);
    // if we're redirecting to a relative path, we'll try to stream the response
    if (redirectUrl.startsWith("/")) {
        var _staticGenerationStore_incrementalCache;
        const forwardedHeaders = getForwardedHeaders(req, res);
        forwardedHeaders.set(_approuterheaders.RSC, "1");
        const host = req.headers["host"];
        const proto = ((_staticGenerationStore_incrementalCache = staticGenerationStore.incrementalCache) == null ? void 0 : _staticGenerationStore_incrementalCache.requestProtocol) || "https";
        const fetchUrl = new URL(`${proto}://${host}${redirectUrl}`);
        if (staticGenerationStore.revalidatedTags) {
            var _staticGenerationStore_incrementalCache1, _staticGenerationStore_incrementalCache_prerenderManifest, _staticGenerationStore_incrementalCache_prerenderManifest_preview;
            forwardedHeaders.set("x-next-revalidated-tags", staticGenerationStore.revalidatedTags.join(","));
            forwardedHeaders.set("x-next-revalidate-tag-token", ((_staticGenerationStore_incrementalCache1 = staticGenerationStore.incrementalCache) == null ? void 0 : (_staticGenerationStore_incrementalCache_prerenderManifest = _staticGenerationStore_incrementalCache1.prerenderManifest) == null ? void 0 : (_staticGenerationStore_incrementalCache_prerenderManifest_preview = _staticGenerationStore_incrementalCache_prerenderManifest.preview) == null ? void 0 : _staticGenerationStore_incrementalCache_prerenderManifest_preview.previewModeId) || "");
        }
        try {
            const headResponse = await fetchIPv4v6(fetchUrl, {
                method: "HEAD",
                headers: forwardedHeaders,
                next: {
                    // @ts-ignore
                    internal: 1
                }
            });
            if (headResponse.headers.get("content-type") === _approuterheaders.RSC_CONTENT_TYPE_HEADER) {
                const response = await fetchIPv4v6(fetchUrl, {
                    method: "GET",
                    headers: forwardedHeaders,
                    next: {
                        // @ts-ignore
                        internal: 1
                    }
                });
                // copy the headers from the redirect response to the response we're sending
                for (const [key, value] of response.headers){
                    if (!_utils.forbiddenHeaders.includes(key)) {
                        res.setHeader(key, value);
                    }
                }
                return new _flightrenderresult.FlightRenderResult(response.body);
            }
        } catch (err) {
            // we couldn't stream the redirect response, so we'll just do a normal redirect
            console.error(`failed to get redirect response`, err);
        }
    }
    return new _renderresult.default(JSON.stringify({}));
}
async function handleAction({ req , res , ComponentMod , pathname , serverActionsManifest , generateFlight , staticGenerationStore , requestStore , serverActionsBodySizeLimit  }) {
    let actionId = req.headers[_approuterheaders.ACTION.toLowerCase()];
    const contentType = req.headers["content-type"];
    const isURLEncodedAction = req.method === "POST" && contentType === "application/x-www-form-urlencoded";
    const isMultipartAction = req.method === "POST" && (contentType == null ? void 0 : contentType.startsWith("multipart/form-data"));
    const isFetchAction = actionId !== undefined && typeof actionId === "string" && req.method === "POST";
    if (isFetchAction || isURLEncodedAction || isMultipartAction) {
        let bound = [];
        const workerName = "app" + pathname;
        const serverModuleMap = new Proxy({}, {
            get: (_, id)=>{
                return {
                    id: serverActionsManifest[process.env.NEXT_RUNTIME === "edge" ? "edge" : "node"][id].workers[workerName],
                    name: id,
                    chunks: []
                };
            }
        });
        const { actionAsyncStorage  } = ComponentMod;
        let actionResult;
        try {
            await actionAsyncStorage.run({
                isAction: true
            }, async ()=>{
                if (process.env.NEXT_RUNTIME === "edge") {
                    // Use react-server-dom-webpack/server.edge
                    const { decodeReply , decodeAction  } = ComponentMod;
                    const webRequest = req;
                    if (!webRequest.body) {
                        throw new Error("invariant: Missing request body.");
                    }
                    if (isMultipartAction) {
                        // TODO-APP: Add streaming support
                        const formData = await webRequest.request.formData();
                        if (isFetchAction) {
                            bound = await decodeReply(formData, serverModuleMap);
                        } else {
                            const action = await decodeAction(formData, serverModuleMap);
                            await action();
                            // Skip the fetch path
                            return;
                        }
                    } else {
                        let actionData = "";
                        const reader = webRequest.body.getReader();
                        while(true){
                            const { done , value  } = await reader.read();
                            if (done) {
                                break;
                            }
                            actionData += new TextDecoder().decode(value);
                        }
                        if (isURLEncodedAction) {
                            const formData = formDataFromSearchQueryString(actionData);
                            bound = await decodeReply(formData, serverModuleMap);
                        } else {
                            bound = await decodeReply(actionData, serverModuleMap);
                        }
                    }
                } else {
                    // Use react-server-dom-webpack/server.node which supports streaming
                    const { decodeReply , decodeReplyFromBusboy , decodeAction  } = require(`react-server-dom-webpack/server.node`);
                    if (isMultipartAction) {
                        if (isFetchAction) {
                            const busboy = require("busboy");
                            const bb = busboy({
                                headers: req.headers
                            });
                            req.pipe(bb);
                            bound = await decodeReplyFromBusboy(bb, serverModuleMap);
                        } else {
                            // React doesn't yet publish a busboy version of decodeAction
                            // so we polyfill the parsing of FormData.
                            const UndiciRequest = require("next/dist/compiled/undici").Request;
                            const fakeRequest = new UndiciRequest("http://localhost", {
                                method: "POST",
                                headers: {
                                    "Content-Type": req.headers["content-type"]
                                },
                                body: nodeToWebReadableStream(req),
                                duplex: "half"
                            });
                            const formData = await fakeRequest.formData();
                            const action = await decodeAction(formData, serverModuleMap);
                            await action();
                            // Skip the fetch path
                            return;
                        }
                    } else {
                        const { parseBody  } = require("../api-utils/node");
                        let actionData;
                        try {
                            actionData = await parseBody(req, serverActionsBodySizeLimit ?? "1mb") || "";
                        } catch (e) {
                            if (e && e.statusCode === 413) {
                                // Exceeded the size limit
                                e.message = e.message + "\nTo configure the body size limit for Server Actions, see: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#size-limitation";
                            }
                            throw e;
                        }
                        if (isURLEncodedAction) {
                            const formData = formDataFromSearchQueryString(actionData);
                            bound = await decodeReply(formData, serverModuleMap);
                        } else {
                            bound = await decodeReply(actionData, serverModuleMap);
                        }
                    }
                }
                // actions.js
                // app/page.js
                //   action woker1
                //     appRender1
                // app/foo/page.js
                //   action worker2
                //     appRender
                // / -> fire action -> POST / -> appRender1 -> modId for the action file
                // /foo -> fire action -> POST /foo -> appRender2 -> modId for the action file
                const actionModId = serverActionsManifest[process.env.NEXT_RUNTIME === "edge" ? "edge" : "node"][actionId].workers[workerName];
                const actionHandler = ComponentMod.__next_app__.require(actionModId)[actionId];
                const returnVal = await actionHandler.apply(null, bound);
                // For form actions, we need to continue rendering the page.
                if (isFetchAction) {
                    await addRevalidationHeader(res, {
                        staticGenerationStore,
                        requestStore
                    });
                    actionResult = await generateFlight({
                        actionResult: Promise.resolve(returnVal),
                        // if the page was not revalidated, we can skip the rendering the flight tree
                        skipFlight: !staticGenerationStore.pathWasRevalidated
                    });
                }
            });
            return actionResult;
        } catch (err) {
            if ((0, _redirect.isRedirectError)(err)) {
                const redirectUrl = (0, _redirect.getURLFromRedirectError)(err);
                // if it's a fetch action, we don't want to mess with the status code
                // and we'll handle it on the client router
                await addRevalidationHeader(res, {
                    staticGenerationStore,
                    requestStore
                });
                if (isFetchAction) {
                    return createRedirectRenderResult(req, res, redirectUrl, staticGenerationStore);
                }
                if (err.mutableCookies) {
                    const headers = new Headers();
                    // If there were mutable cookies set, we need to set them on the
                    // response.
                    if ((0, _requestcookies.appendMutableCookies)(headers, err.mutableCookies)) {
                        res.setHeader("set-cookie", Array.from(headers.values()));
                    }
                }
                res.setHeader("Location", redirectUrl);
                res.statusCode = 303;
                return new _renderresult.default("");
            } else if ((0, _notfound.isNotFoundError)(err)) {
                res.statusCode = 404;
                await addRevalidationHeader(res, {
                    staticGenerationStore,
                    requestStore
                });
                if (isFetchAction) {
                    const promise = Promise.reject(err);
                    try {
                        await promise;
                    } catch (_) {}
                    return generateFlight({
                        skipFlight: false,
                        actionResult: promise,
                        asNotFound: true
                    });
                }
                return "not-found";
            }
            if (isFetchAction) {
                res.statusCode = 500;
                await Promise.all(staticGenerationStore.pendingRevalidates || []);
                const promise = Promise.reject(err);
                try {
                    await promise;
                } catch (_) {}
                return generateFlight({
                    actionResult: promise,
                    // if the page was not revalidated, we can skip the rendering the flight tree
                    skipFlight: !staticGenerationStore.pathWasRevalidated
                });
            }
            throw err;
        }
    }
}

//# sourceMappingURL=action-handler.js.map