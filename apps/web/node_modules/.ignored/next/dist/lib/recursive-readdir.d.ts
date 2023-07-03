/**
 * Recursively read directory
 * Returns array holding all relative paths
 */
export declare function recursiveReadDir(
/** Directory to read */
dir: string, 
/** Filter for the file path */
filter: (absoluteFilePath: string) => boolean, 
/** Filter for the file path */
ignore?: (absoluteFilePath: string) => boolean, ignorePart?: (partName: string) => boolean, 
/** This doesn't have to be provided, it's used for the recursion */
arr?: string[], 
/** Used to replace the initial path, only the relative path is left, it's faster than path.relative. */
rootDir?: string): Promise<string[]>;
