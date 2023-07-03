"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPagePaths", {
    enumerable: true,
    get: function() {
        return getPagePaths;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _denormalizepagepath = require("./denormalize-page-path");
const _flatten = require("../flatten");
const _path = /*#__PURE__*/ _interop_require_default._(require("../isomorphic/path"));
function getPagePaths(normalizedPagePath, extensions, isAppDir) {
    const page = (0, _denormalizepagepath.denormalizePagePath)(normalizedPagePath);
    return (0, _flatten.flatten)(extensions.map((extension)=>{
        const appPage = page + "." + extension;
        const folderIndexPage = _path.default.join(page, "index." + extension);
        if (!normalizedPagePath.endsWith("/index")) {
            return isAppDir ? [
                appPage
            ] : [
                page + "." + extension,
                folderIndexPage
            ];
        }
        return [
            isAppDir ? appPage : folderIndexPage
        ];
    }));
}

//# sourceMappingURL=get-page-paths.js.map