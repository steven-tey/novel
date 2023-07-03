"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return FileSystemCache;
    }
});
const _lrucache = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/lru-cache"));
const _path = /*#__PURE__*/ _interop_require_default(require("../../../shared/lib/isomorphic/path"));
const _utils = require("./utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let memoryCache;
let tagsManifest;
class FileSystemCache {
    constructor(ctx){
        this.fs = ctx.fs;
        this.flushToDisk = ctx.flushToDisk;
        this.serverDistDir = ctx.serverDistDir;
        this.appDir = !!ctx._appDir;
        this.revalidatedTags = ctx.revalidatedTags;
        if (ctx.maxMemoryCacheSize && !memoryCache) {
            memoryCache = new _lrucache.default({
                max: ctx.maxMemoryCacheSize,
                length ({ value  }) {
                    var _JSON_stringify;
                    if (!value) {
                        return 25;
                    } else if (value.kind === "REDIRECT") {
                        return JSON.stringify(value.props).length;
                    } else if (value.kind === "IMAGE") {
                        throw new Error("invariant image should not be incremental-cache");
                    } else if (value.kind === "FETCH") {
                        return JSON.stringify(value.data || "").length;
                    } else if (value.kind === "ROUTE") {
                        return value.body.length;
                    }
                    // rough estimate of size of cache value
                    return value.html.length + (((_JSON_stringify = JSON.stringify(value.pageData)) == null ? void 0 : _JSON_stringify.length) || 0);
                }
            });
        }
        if (this.serverDistDir && this.fs) {
            this.tagsManifestPath = _path.default.join(this.serverDistDir, "..", "cache", "fetch-cache", "tags-manifest.json");
            this.loadTagsManifest();
        }
    }
    loadTagsManifest() {
        if (!this.tagsManifestPath || !this.fs) return;
        try {
            tagsManifest = JSON.parse(this.fs.readFileSync(this.tagsManifestPath).toString("utf8"));
        } catch (err) {
            tagsManifest = {
                version: 1,
                items: {}
            };
        }
    }
    async setTags(key, tags) {
        this.loadTagsManifest();
        if (!tagsManifest || !this.tagsManifestPath) {
            return;
        }
        for (const tag of tags){
            const data = tagsManifest.items[tag] || {
                keys: []
            };
            if (!data.keys.includes(key)) {
                data.keys.push(key);
            }
            tagsManifest.items[tag] = data;
        }
        try {
            await this.fs.mkdir(_path.default.dirname(this.tagsManifestPath));
            await this.fs.writeFile(this.tagsManifestPath, JSON.stringify(tagsManifest || {}));
        } catch (err) {
            console.warn("Failed to update tags manifest.", err);
        }
    }
    async revalidateTag(tag) {
        // we need to ensure the tagsManifest is refreshed
        // since separate workers can be updating it at the same
        // time and we can't flush out of sync data
        this.loadTagsManifest();
        if (!tagsManifest || !this.tagsManifestPath) {
            return;
        }
        const data = tagsManifest.items[tag] || {
            keys: []
        };
        data.revalidatedAt = Date.now();
        tagsManifest.items[tag] = data;
        try {
            await this.fs.mkdir(_path.default.dirname(this.tagsManifestPath));
            await this.fs.writeFile(this.tagsManifestPath, JSON.stringify(tagsManifest || {}));
        } catch (err) {
            console.warn("Failed to update tags manifest.", err);
        }
    }
    async get(key, fetchCache) {
        var _data_value, _data_value1, _data_value2;
        let data = memoryCache == null ? void 0 : memoryCache.get(key);
        // let's check the disk for seed data
        if (!data && process.env.NEXT_RUNTIME !== "edge") {
            try {
                const { filePath  } = await this.getFsPath({
                    pathname: `${key}.body`,
                    appDir: true
                });
                const fileData = await this.fs.readFile(filePath);
                const { mtime  } = await this.fs.stat(filePath);
                const meta = JSON.parse((await this.fs.readFile(filePath.replace(/\.body$/, ".meta"))).toString("utf8"));
                const cacheEntry = {
                    lastModified: mtime.getTime(),
                    value: {
                        kind: "ROUTE",
                        body: fileData,
                        headers: meta.headers,
                        status: meta.status
                    }
                };
                return cacheEntry;
            } catch (_) {
            // no .meta data for the related key
            }
            try {
                const { filePath , isAppPath  } = await this.getFsPath({
                    pathname: fetchCache ? key : `${key}.html`,
                    fetchCache
                });
                const fileData = (await this.fs.readFile(filePath)).toString("utf-8");
                const { mtime  } = await this.fs.stat(filePath);
                if (fetchCache) {
                    const lastModified = mtime.getTime();
                    const parsedData = JSON.parse(fileData);
                    data = {
                        lastModified,
                        value: parsedData
                    };
                } else {
                    const pageData = isAppPath ? (await this.fs.readFile((await this.getFsPath({
                        pathname: `${key}.rsc`,
                        appDir: true
                    })).filePath)).toString("utf8") : JSON.parse((await this.fs.readFile((await this.getFsPath({
                        pathname: `${key}.json`,
                        appDir: false
                    })).filePath)).toString("utf8"));
                    let meta = {};
                    if (isAppPath) {
                        try {
                            meta = JSON.parse((await this.fs.readFile(filePath.replace(/\.html$/, ".meta"))).toString("utf-8"));
                        } catch (_) {}
                    }
                    data = {
                        lastModified: mtime.getTime(),
                        value: {
                            kind: "PAGE",
                            html: fileData,
                            pageData,
                            headers: meta.headers,
                            status: meta.status
                        }
                    };
                }
                if (data) {
                    memoryCache == null ? void 0 : memoryCache.set(key, data);
                }
            } catch (_) {
            // unable to get data from disk
            }
        }
        let cacheTags;
        if ((data == null ? void 0 : (_data_value = data.value) == null ? void 0 : _data_value.kind) === "PAGE") {
            var _data_value_headers;
            const tagsHeader = (_data_value_headers = data.value.headers) == null ? void 0 : _data_value_headers["x-next-cache-tags"];
            if (typeof tagsHeader === "string") {
                cacheTags = tagsHeader.split(",");
            }
        }
        if ((data == null ? void 0 : (_data_value1 = data.value) == null ? void 0 : _data_value1.kind) === "PAGE" && (cacheTags == null ? void 0 : cacheTags.length)) {
            this.loadTagsManifest();
            const derivedTags = (0, _utils.getDerivedTags)(cacheTags || []);
            const isStale = derivedTags.some((tag)=>{
                var _tagsManifest_items_tag;
                return ((_tagsManifest_items_tag = tagsManifest == null ? void 0 : tagsManifest.items[tag]) == null ? void 0 : _tagsManifest_items_tag.revalidatedAt) && (tagsManifest == null ? void 0 : tagsManifest.items[tag].revalidatedAt) >= ((data == null ? void 0 : data.lastModified) || Date.now());
            });
            if (isStale) {
                data.lastModified = -1;
            }
        }
        if (data && (data == null ? void 0 : (_data_value2 = data.value) == null ? void 0 : _data_value2.kind) === "FETCH") {
            this.loadTagsManifest();
            const innerData = data.value.data;
            const derivedTags = (0, _utils.getDerivedTags)(innerData.tags || []);
            const wasRevalidated = derivedTags.some((tag)=>{
                var _tagsManifest_items_tag;
                if (this.revalidatedTags.includes(tag)) {
                    return true;
                }
                return ((_tagsManifest_items_tag = tagsManifest == null ? void 0 : tagsManifest.items[tag]) == null ? void 0 : _tagsManifest_items_tag.revalidatedAt) && (tagsManifest == null ? void 0 : tagsManifest.items[tag].revalidatedAt) >= ((data == null ? void 0 : data.lastModified) || Date.now());
            });
            // When revalidate tag is called we don't return
            // stale data so it's updated right away
            if (wasRevalidated) {
                data = undefined;
            }
        }
        return data || null;
    }
    async set(key, data) {
        memoryCache == null ? void 0 : memoryCache.set(key, {
            value: data,
            lastModified: Date.now()
        });
        if (!this.flushToDisk) return;
        if ((data == null ? void 0 : data.kind) === "ROUTE") {
            const { filePath  } = await this.getFsPath({
                pathname: `${key}.body`,
                appDir: true
            });
            await this.fs.mkdir(_path.default.dirname(filePath));
            await this.fs.writeFile(filePath, data.body);
            await this.fs.writeFile(filePath.replace(/\.body$/, ".meta"), JSON.stringify({
                headers: data.headers,
                status: data.status
            }));
            return;
        }
        if ((data == null ? void 0 : data.kind) === "PAGE") {
            const isAppPath = typeof data.pageData === "string";
            const { filePath: htmlPath  } = await this.getFsPath({
                pathname: `${key}.html`,
                appDir: isAppPath
            });
            await this.fs.mkdir(_path.default.dirname(htmlPath));
            await this.fs.writeFile(htmlPath, data.html);
            await this.fs.writeFile((await this.getFsPath({
                pathname: `${key}.${isAppPath ? "rsc" : "json"}`,
                appDir: isAppPath
            })).filePath, isAppPath ? data.pageData : JSON.stringify(data.pageData));
            if (data.headers || data.status) {
                await this.fs.writeFile(htmlPath.replace(/\.html$/, ".meta"), JSON.stringify({
                    headers: data.headers,
                    status: data.status
                }));
            }
        } else if ((data == null ? void 0 : data.kind) === "FETCH") {
            const { filePath  } = await this.getFsPath({
                pathname: key,
                fetchCache: true
            });
            await this.fs.mkdir(_path.default.dirname(filePath));
            await this.fs.writeFile(filePath, JSON.stringify(data));
            await this.setTags(key, data.data.tags || []);
        }
    }
    async getFsPath({ pathname , appDir , fetchCache  }) {
        if (fetchCache) {
            // we store in .next/cache/fetch-cache so it can be persisted
            // across deploys
            return {
                filePath: _path.default.join(this.serverDistDir, "..", "cache", "fetch-cache", pathname),
                isAppPath: false
            };
        }
        let isAppPath = false;
        let filePath = _path.default.join(this.serverDistDir, "pages", pathname);
        if (!this.appDir || appDir === false) return {
            filePath,
            isAppPath
        };
        try {
            await this.fs.readFile(filePath);
            return {
                filePath,
                isAppPath
            };
        } catch (err) {
            return {
                filePath: _path.default.join(this.serverDistDir, "app", pathname),
                isAppPath: true
            };
        }
    }
}

//# sourceMappingURL=file-system-cache.js.map