import { promises } from "fs";
import { join } from "path";
/**
 * Recursively read directory
 * Returns array holding all relative paths
 */ export async function recursiveReadDir(/** Directory to read */ dir, /** Filter for the file path */ filter, /** Filter for the file path */ ignore, ignorePart, /** This doesn't have to be provided, it's used for the recursion */ arr = [], /** Used to replace the initial path, only the relative path is left, it's faster than path.relative. */ rootDir = dir) {
    const result = await promises.readdir(dir, {
        withFileTypes: true
    });
    await Promise.all(result.map(async (part)=>{
        const absolutePath = join(dir, part.name);
        const relativePath = absolutePath.replace(rootDir, "");
        if (ignore && ignore(absolutePath)) return;
        if (ignorePart && ignorePart(part.name)) return;
        // readdir does not follow symbolic links
        // if part is a symbolic link, follow it using stat
        let isDirectory = part.isDirectory();
        if (part.isSymbolicLink()) {
            const stats = await promises.stat(absolutePath);
            isDirectory = stats.isDirectory();
        }
        if (isDirectory) {
            await recursiveReadDir(absolutePath, filter, ignore, ignorePart, arr, rootDir);
            return;
        }
        if (!filter(absolutePath)) {
            return;
        }
        arr.push(relativePath);
    }));
    return arr.sort();
}

//# sourceMappingURL=recursive-readdir.js.map