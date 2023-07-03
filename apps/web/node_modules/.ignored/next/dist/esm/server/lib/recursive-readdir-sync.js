import fs from "fs";
import { join } from "path";
/**
 * Recursively read directory
 * Returns array holding all relative paths
 */ export function recursiveReadDirSync(/** The directory to read */ dir, /** This doesn't have to be provided, it's used for the recursion */ arr = [], /** Used to replace the initial path, only the relative path is left, it's faster than path.relative. */ rootDir = dir) {
    const result = fs.readdirSync(dir);
    result.forEach((part)=>{
        const absolutePath = join(dir, part);
        const pathStat = fs.statSync(absolutePath);
        if (pathStat.isDirectory()) {
            recursiveReadDirSync(absolutePath, arr, rootDir);
            return;
        }
        arr.push(absolutePath.replace(rootDir, ""));
    });
    return arr;
}

//# sourceMappingURL=recursive-readdir-sync.js.map