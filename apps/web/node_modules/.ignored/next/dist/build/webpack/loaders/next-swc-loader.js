/*
Copyright (c) 2017 The swc Project Developers

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without
limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    pitch: null,
    default: null,
    raw: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    pitch: function() {
        return pitch;
    },
    default: function() {
        return swcLoader;
    },
    raw: function() {
        return raw;
    }
});
const _swc = require("../../swc");
const _options = require("../../swc/options");
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
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
async function loaderTransform(parentTrace, source, inputSourceMap) {
    var _nextConfig_experimental;
    // Make the loader async
    const filename = this.resourcePath;
    let loaderOptions = this.getOptions() || {};
    const { isServer , rootDir , pagesDir , appDir , hasReactRefresh , nextConfig , jsConfig , supportedBrowsers , swcCacheDir , hasServerComponents , isServerLayer  } = loaderOptions;
    const isPageFile = filename.startsWith(pagesDir);
    const relativeFilePathFromRoot = _path.default.relative(rootDir, filename);
    const swcOptions = (0, _options.getLoaderSWCOptions)({
        pagesDir,
        appDir,
        filename,
        isServer,
        isPageFile,
        development: this.mode === "development",
        hasReactRefresh,
        modularizeImports: nextConfig == null ? void 0 : nextConfig.modularizeImports,
        swcPlugins: nextConfig == null ? void 0 : (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.swcPlugins,
        compilerOptions: nextConfig == null ? void 0 : nextConfig.compiler,
        jsConfig,
        supportedBrowsers,
        swcCacheDir,
        relativeFilePathFromRoot,
        hasServerComponents,
        isServerLayer
    });
    const programmaticOptions = {
        ...swcOptions,
        filename,
        inputSourceMap: inputSourceMap ? JSON.stringify(inputSourceMap) : undefined,
        // Set the default sourcemap behavior based on Webpack's mapping flag,
        sourceMaps: this.sourceMap,
        inlineSourcesContent: this.sourceMap,
        // Ensure that Webpack will get a full absolute path in the sourcemap
        // so that it can properly map the module back to its internal cached
        // modules.
        sourceFileName: filename
    };
    if (!programmaticOptions.inputSourceMap) {
        delete programmaticOptions.inputSourceMap;
    }
    // auto detect development mode
    if (this.mode && programmaticOptions.jsc && programmaticOptions.jsc.transform && programmaticOptions.jsc.transform.react && !Object.prototype.hasOwnProperty.call(programmaticOptions.jsc.transform.react, "development")) {
        programmaticOptions.jsc.transform.react.development = this.mode === "development";
    }
    const swcSpan = parentTrace.traceChild("next-swc-transform");
    return swcSpan.traceAsyncFn(()=>(0, _swc.transform)(source, programmaticOptions).then((output)=>{
            if (output.eliminatedPackages && this.eliminatedPackages) {
                for (const pkg of JSON.parse(output.eliminatedPackages)){
                    this.eliminatedPackages.add(pkg);
                }
            }
            return [
                output.code,
                output.map ? JSON.parse(output.map) : undefined
            ];
        }));
}
const EXCLUDED_PATHS = /[\\/](cache[\\/][^\\/]+\.zip[\\/]node_modules|__virtual__)[\\/]/g;
function pitch() {
    const callback = this.async();
    (async ()=>{
        let loaderOptions = this.getOptions() || {};
        if (// TODO: investigate swc file reading in PnP mode?
        !process.versions.pnp && loaderOptions.fileReading && !EXCLUDED_PATHS.test(this.resourcePath) && this.loaders.length - 1 === this.loaderIndex && (0, _path.isAbsolute)(this.resourcePath) && !await (0, _swc.isWasm)()) {
            const loaderSpan = this.currentTraceSpan.traceChild("next-swc-loader");
            this.addDependency(this.resourcePath);
            return loaderSpan.traceAsyncFn(()=>loaderTransform.call(this, loaderSpan));
        }
    })().then((r)=>{
        if (r) return callback(null, ...r);
        callback();
    }, callback);
}
function swcLoader(inputSource, inputSourceMap) {
    const loaderSpan = this.currentTraceSpan.traceChild("next-swc-loader");
    const callback = this.async();
    loaderSpan.traceAsyncFn(()=>loaderTransform.call(this, loaderSpan, inputSource, inputSourceMap)).then(([transformedSource, outputSourceMap])=>{
        callback(null, transformedSource, outputSourceMap || inputSourceMap);
    }, (err)=>{
        callback(err);
    });
}
const raw = true;

//# sourceMappingURL=next-swc-loader.js.map