"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "recursiveReadDirSync", {
    enumerable: true,
    get: function() {
        return recursiveReadDirSync;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = require("path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function recursiveReadDirSync(/** The directory to read */ dir, /** This doesn't have to be provided, it's used for the recursion */ arr = [], /** Used to replace the initial path, only the relative path is left, it's faster than path.relative. */ rootDir = dir) {
    const result = _fs.default.readdirSync(dir);
    result.forEach((part)=>{
        const absolutePath = (0, _path.join)(dir, part);
        const pathStat = _fs.default.statSync(absolutePath);
        if (pathStat.isDirectory()) {
            recursiveReadDirSync(absolutePath, arr, rootDir);
            return;
        }
        arr.push(absolutePath.replace(rootDir, ""));
    });
    return arr;
}

//# sourceMappingURL=recursive-readdir-sync.js.map