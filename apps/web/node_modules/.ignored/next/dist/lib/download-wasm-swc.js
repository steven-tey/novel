"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "downloadWasmSwc", {
    enumerable: true,
    get: function() {
        return downloadWasmSwc;
    }
});
const _os = /*#__PURE__*/ _interop_require_default(require("os"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../build/output/log"));
const _tar = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/tar"));
const _fileexists = require("./file-exists");
const _getregistry = require("./helpers/get-registry");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const { fetch  } = require("next/dist/compiled/undici");
const { WritableStream  } = require("node:stream/web");
const MAX_VERSIONS_TO_CACHE = 5;
async function downloadWasmSwc(version, wasmDirectory, variant = "nodejs") {
    const pkgName = `@next/swc-wasm-${variant}`;
    const tarFileName = `${pkgName.substring(6)}-${version}.tgz`;
    const outputDirectory = _path.default.join(wasmDirectory, pkgName);
    if (await (0, _fileexists.fileExists)(outputDirectory)) {
        // if the package is already downloaded a different
        // failure occurred than not being present
        return;
    }
    // get platform specific cache directory adapted from playwright's handling
    // https://github.com/microsoft/playwright/blob/7d924470d397975a74a19184c136b3573a974e13/packages/playwright-core/src/utils/registry.ts#L141
    const cacheDirectory = await (async ()=>{
        let result;
        const envDefined = process.env["NEXT_SWC_PATH"];
        if (envDefined) {
            result = envDefined;
        } else {
            let systemCacheDirectory;
            if (process.platform === "linux") {
                systemCacheDirectory = process.env.XDG_CACHE_HOME || _path.default.join(_os.default.homedir(), ".cache");
            } else if (process.platform === "darwin") {
                systemCacheDirectory = _path.default.join(_os.default.homedir(), "Library", "Caches");
            } else if (process.platform === "win32") {
                systemCacheDirectory = process.env.LOCALAPPDATA || _path.default.join(_os.default.homedir(), "AppData", "Local");
            } else {
                /// Attempt to use generic tmp location for un-handled platform
                if (!systemCacheDirectory) {
                    for (const dir of [
                        _path.default.join(_os.default.homedir(), ".cache"),
                        _path.default.join(_os.default.tmpdir())
                    ]){
                        if (await (0, _fileexists.fileExists)(dir)) {
                            systemCacheDirectory = dir;
                            break;
                        }
                    }
                }
                if (!systemCacheDirectory) {
                    console.error(new Error("Unsupported platform: " + process.platform));
                    process.exit(0);
                }
            }
            result = _path.default.join(systemCacheDirectory, "next-swc");
        }
        if (!_path.default.isAbsolute(result)) {
            // It is important to resolve to the absolute path:
            //   - for unzipping to work correctly;
            //   - so that registry directory matches between installation and execution.
            // INIT_CWD points to the root of `npm/yarn install` and is probably what
            // the user meant when typing the relative path.
            result = _path.default.resolve(process.env["INIT_CWD"] || process.cwd(), result);
        }
        return result;
    })();
    await _fs.default.promises.mkdir(outputDirectory, {
        recursive: true
    });
    const extractFromTar = async ()=>{
        await _tar.default.x({
            file: _path.default.join(cacheDirectory, tarFileName),
            cwd: outputDirectory,
            strip: 1
        });
    };
    if (!await (0, _fileexists.fileExists)(_path.default.join(cacheDirectory, tarFileName))) {
        _log.info("Downloading WASM swc package...");
        await _fs.default.promises.mkdir(cacheDirectory, {
            recursive: true
        });
        const tempFile = _path.default.join(cacheDirectory, `${tarFileName}.temp-${Date.now()}`);
        const registry = (0, _getregistry.getRegistry)();
        await fetch(`${registry}${pkgName}/-/${tarFileName}`).then((res)=>{
            const { ok , body  } = res;
            if (!ok) {
                throw new Error(`request failed with status ${res.status}`);
            }
            if (!body) {
                throw new Error("request failed with empty body");
            }
            const cacheWriteStream = _fs.default.createWriteStream(tempFile);
            return body.pipeTo(new WritableStream({
                write (chunk) {
                    cacheWriteStream.write(chunk);
                },
                close () {
                    cacheWriteStream.close();
                }
            }));
        });
        await _fs.default.promises.rename(tempFile, _path.default.join(cacheDirectory, tarFileName));
    }
    await extractFromTar();
    const cacheFiles = await _fs.default.promises.readdir(cacheDirectory);
    if (cacheFiles.length > MAX_VERSIONS_TO_CACHE) {
        cacheFiles.sort((a, b)=>{
            if (a.length < b.length) return -1;
            return a.localeCompare(b);
        });
        // prune oldest versions in cache
        for(let i = 0; i++; i < cacheFiles.length - MAX_VERSIONS_TO_CACHE){
            await _fs.default.promises.unlink(_path.default.join(cacheDirectory, cacheFiles[i])).catch(()=>{});
        }
    }
}

//# sourceMappingURL=download-wasm-swc.js.map