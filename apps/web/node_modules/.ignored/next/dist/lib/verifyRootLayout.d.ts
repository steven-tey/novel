export declare function verifyRootLayout({ dir, appDir, tsconfigPath, pagePath, pageExtensions, }: {
    dir: string;
    appDir: string;
    tsconfigPath: string;
    pagePath: string;
    pageExtensions: string[];
}): Promise<[boolean, string | undefined]>;
