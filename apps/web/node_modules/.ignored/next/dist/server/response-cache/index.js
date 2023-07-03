"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return ResponseCache;
    }
});
0 && __export(require("./types"));
const _renderresult = /*#__PURE__*/ _interop_require_default(require("../render-result"));
_export_star(require("./types"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class ResponseCache {
    constructor(minimalMode){
        this.pendingResponses = new Map();
        this.minimalMode = minimalMode;
    }
    get(key, responseGenerator, context) {
        var _this_previousCacheItem;
        const { incrementalCache  } = context;
        // ensure on-demand revalidate doesn't block normal requests
        const pendingResponseKey = key ? `${key}-${context.isOnDemandRevalidate ? "1" : "0"}` : null;
        const pendingResponse = pendingResponseKey ? this.pendingResponses.get(pendingResponseKey) : null;
        if (pendingResponse) {
            return pendingResponse;
        }
        let resolver = ()=>{};
        let rejecter = ()=>{};
        const promise = new Promise((resolve, reject)=>{
            resolver = resolve;
            rejecter = reject;
        });
        if (pendingResponseKey) {
            this.pendingResponses.set(pendingResponseKey, promise);
        }
        let resolved = false;
        const resolve = (cacheEntry)=>{
            if (pendingResponseKey) {
                // Ensure all reads from the cache get the latest value.
                this.pendingResponses.set(pendingResponseKey, Promise.resolve(cacheEntry));
            }
            if (!resolved) {
                resolved = true;
                resolver(cacheEntry);
            }
        };
        // we keep the previous cache entry around to leverage
        // when the incremental cache is disabled in minimal mode
        if (pendingResponseKey && this.minimalMode && ((_this_previousCacheItem = this.previousCacheItem) == null ? void 0 : _this_previousCacheItem.key) === pendingResponseKey && this.previousCacheItem.expiresAt > Date.now()) {
            resolve(this.previousCacheItem.entry);
            this.pendingResponses.delete(pendingResponseKey);
            return promise;
        }
        (async ()=>{
            let cachedResponse = null;
            try {
                cachedResponse = key && !this.minimalMode ? await incrementalCache.get(key) : null;
                if (cachedResponse && !context.isOnDemandRevalidate) {
                    var _cachedResponse_value, _cachedResponse_value1;
                    if (((_cachedResponse_value = cachedResponse.value) == null ? void 0 : _cachedResponse_value.kind) === "FETCH") {
                        throw new Error(`invariant: unexpected cachedResponse of kind fetch in response cache`);
                    }
                    resolve({
                        isStale: cachedResponse.isStale,
                        revalidate: cachedResponse.curRevalidate,
                        value: ((_cachedResponse_value1 = cachedResponse.value) == null ? void 0 : _cachedResponse_value1.kind) === "PAGE" ? {
                            kind: "PAGE",
                            html: _renderresult.default.fromStatic(cachedResponse.value.html),
                            pageData: cachedResponse.value.pageData,
                            headers: cachedResponse.value.headers,
                            status: cachedResponse.value.status
                        } : cachedResponse.value
                    });
                    if (!cachedResponse.isStale || context.isPrefetch) {
                        // The cached value is still valid, so we don't need
                        // to update it yet.
                        return;
                    }
                }
                const cacheEntry = await responseGenerator(resolved, cachedResponse);
                const resolveValue = cacheEntry === null ? null : {
                    ...cacheEntry,
                    isMiss: !cachedResponse
                };
                // for on-demand revalidate wait to resolve until cache is set
                if (!context.isOnDemandRevalidate) {
                    resolve(resolveValue);
                }
                if (key && cacheEntry && typeof cacheEntry.revalidate !== "undefined") {
                    if (this.minimalMode) {
                        this.previousCacheItem = {
                            key: pendingResponseKey || key,
                            entry: cacheEntry,
                            expiresAt: Date.now() + 1000
                        };
                    } else {
                        var _cacheEntry_value;
                        await incrementalCache.set(key, ((_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) === "PAGE" ? {
                            kind: "PAGE",
                            html: cacheEntry.value.html.toUnchunkedString(),
                            pageData: cacheEntry.value.pageData,
                            headers: cacheEntry.value.headers,
                            status: cacheEntry.value.status
                        } : cacheEntry.value, cacheEntry.revalidate);
                    }
                } else {
                    this.previousCacheItem = undefined;
                }
                if (context.isOnDemandRevalidate) {
                    resolve(resolveValue);
                }
            } catch (err) {
                // when a getStaticProps path is erroring we automatically re-set the
                // existing cache under a new expiration to prevent non-stop retrying
                if (cachedResponse && key) {
                    await incrementalCache.set(key, cachedResponse.value, Math.min(Math.max(cachedResponse.revalidate || 3, 3), 30));
                }
                // while revalidating in the background we can't reject as
                // we already resolved the cache entry so log the error here
                if (resolved) {
                    console.error(err);
                } else {
                    rejecter(err);
                }
            } finally{
                if (pendingResponseKey) {
                    this.pendingResponses.delete(pendingResponseKey);
                }
            }
        })();
        return promise;
    }
}

//# sourceMappingURL=index.js.map