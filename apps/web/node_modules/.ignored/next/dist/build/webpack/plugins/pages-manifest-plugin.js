"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    edgeServerPages: null,
    nodeServerPages: null,
    edgeServerAppPaths: null,
    nodeServerAppPaths: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    edgeServerPages: function() {
        return edgeServerPages;
    },
    nodeServerPages: function() {
        return nodeServerPages;
    },
    edgeServerAppPaths: function() {
        return edgeServerAppPaths;
    },
    nodeServerAppPaths: function() {
        return nodeServerAppPaths;
    },
    // This plugin creates a pages-manifest.json from page entrypoints.
    // This is used for mapping paths like `/` to `.next/server/static/<buildid>/pages/index.js` when doing SSR
    // It's also used by next export to provide defaultPathMap
    default: function() {
        return PagesManifestPlugin;
    }
});
const _webpack = require("next/dist/compiled/webpack/webpack");
const _constants = require("../../../shared/lib/constants");
const _getroutefromentrypoint = /*#__PURE__*/ _interop_require_default(require("../../../server/get-route-from-entrypoint"));
const _normalizepathsep = require("../../../shared/lib/page-path/normalize-path-sep");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let edgeServerPages = {};
let nodeServerPages = {};
let edgeServerAppPaths = {};
let nodeServerAppPaths = {};
class PagesManifestPlugin {
    constructor({ dev , isEdgeRuntime , appDirEnabled  }){
        this.dev = dev;
        this.isEdgeRuntime = isEdgeRuntime;
        this.appDirEnabled = appDirEnabled;
    }
    createAssets(compilation, assets) {
        const entrypoints = compilation.entrypoints;
        const pages = {};
        const appPaths = {};
        for (const entrypoint of entrypoints.values()){
            const pagePath = (0, _getroutefromentrypoint.default)(entrypoint.name, this.appDirEnabled);
            if (!pagePath) {
                continue;
            }
            const files = entrypoint.getFiles().filter((file)=>!file.includes("webpack-runtime") && !file.includes("webpack-api-runtime") && file.endsWith(".js"));
            // Skip entries which are empty
            if (!files.length) {
                continue;
            }
            // Write filename, replace any backslashes in path (on windows) with forwardslashes for cross-platform consistency.
            let file = files[files.length - 1];
            if (!this.dev) {
                if (!this.isEdgeRuntime) {
                    file = file.slice(3);
                }
            }
            file = (0, _normalizepathsep.normalizePathSep)(file);
            if (entrypoint.name.startsWith("app/")) {
                appPaths[pagePath] = file;
            } else {
                pages[pagePath] = file;
            }
        }
        // This plugin is used by both the Node server and Edge server compilers,
        // we need to merge both pages to generate the full manifest.
        if (this.isEdgeRuntime) {
            edgeServerPages = pages;
            edgeServerAppPaths = appPaths;
        } else {
            nodeServerPages = pages;
            nodeServerAppPaths = appPaths;
        }
        assets[`${!this.dev && !this.isEdgeRuntime ? "../" : ""}` + _constants.PAGES_MANIFEST] = new _webpack.sources.RawSource(JSON.stringify({
            ...edgeServerPages,
            ...nodeServerPages
        }, null, 2));
        if (this.appDirEnabled) {
            assets[`${!this.dev && !this.isEdgeRuntime ? "../" : ""}` + _constants.APP_PATHS_MANIFEST] = new _webpack.sources.RawSource(JSON.stringify({
                ...edgeServerAppPaths,
                ...nodeServerAppPaths
            }, null, 2));
        }
    }
    apply(compiler) {
        compiler.hooks.make.tap("NextJsPagesManifest", (compilation)=>{
            compilation.hooks.processAssets.tap({
                name: "NextJsPagesManifest",
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>{
                this.createAssets(compilation, assets);
            });
        });
    }
}

//# sourceMappingURL=pages-manifest-plugin.js.map