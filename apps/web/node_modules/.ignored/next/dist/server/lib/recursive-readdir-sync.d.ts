/**
 * Recursively read directory
 * Returns array holding all relative paths
 */
export declare function recursiveReadDirSync(
/** The directory to read */
dir: string, 
/** This doesn't have to be provided, it's used for the recursion */
arr?: string[], 
/** Used to replace the initial path, only the relative path is left, it's faster than path.relative. */
rootDir?: string): string[];
