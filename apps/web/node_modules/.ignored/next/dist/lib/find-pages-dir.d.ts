export declare const existsSync: (f: string) => boolean;
export declare function findDir(dir: string, name: 'pages' | 'app'): string | null;
export declare function findPagesDir(dir: string, isAppDirEnabled: boolean): {
    pagesDir: string | undefined;
    appDir: string | undefined;
};
