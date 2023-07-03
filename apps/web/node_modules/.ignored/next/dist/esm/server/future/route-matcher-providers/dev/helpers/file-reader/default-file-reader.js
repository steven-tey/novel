import fs from "fs/promises";
import path from "path";
export class DefaultFileReader {
    async read(dir) {
        const pathnames = [];
        let directories = [
            dir
        ];
        while(directories.length > 0){
            // Load all the files in each directory at the same time.
            const results = await Promise.all(directories.map(async (directory)=>{
                let files;
                try {
                    files = await fs.readdir(directory, {
                        withFileTypes: true
                    });
                } catch (err) {
                    // This can only happen when the underlying directory was removed. If
                    // anything other than this error occurs, re-throw it.
                    if (err.code !== "ENOENT") throw err;
                    // The error occurred, so abandon reading this directory.
                    files = [];
                }
                return {
                    directory,
                    files
                };
            }));
            // Empty the directories, we'll fill it later if some of the files are
            // directories.
            directories = [];
            // For each result of directory scans...
            for (const { files , directory  } of results){
                // And for each file in it...
                for (const file of files){
                    // Handle each file.
                    const pathname = path.join(directory, file.name);
                    // If the file is a directory, then add it to the list of directories,
                    // they'll be scanned on a later pass.
                    if (file.isDirectory()) {
                        directories.push(pathname);
                    } else {
                        pathnames.push(pathname);
                    }
                }
            }
        }
        return pathnames;
    }
}

//# sourceMappingURL=default-file-reader.js.map