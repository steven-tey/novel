"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "flatReaddir", {
    enumerable: true,
    get: function() {
        return flatReaddir;
    }
});
const _path = require("path");
const _nonnullable = require("./non-nullable");
const _fs = require("fs");
async function flatReaddir(dir, includes) {
    const dirents = await _fs.promises.readdir(dir, {
        withFileTypes: true
    });
    const result = await Promise.all(dirents.map(async (part)=>{
        const absolutePath = (0, _path.join)(dir, part.name);
        if (part.isSymbolicLink()) {
            const stats = await _fs.promises.stat(absolutePath);
            if (stats.isDirectory()) {
                return null;
            }
        }
        if (part.isDirectory() || !includes.some((include)=>include.test(part.name))) {
            return null;
        }
        return absolutePath;
    }));
    return result.filter(_nonnullable.nonNullable);
}

//# sourceMappingURL=flat-readdir.js.map