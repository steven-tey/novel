import type ws from 'next/dist/compiled/ws';
import type { webpack } from 'next/dist/compiled/webpack/webpack';
import type { NextConfigComplete } from '../config-shared';
import { CompilerNameValues, COMPILER_INDEXES } from '../../shared/lib/constants';
import { RouteMatch } from '../future/route-matches/route-match';
import { RouteKind } from '../future/route-kind';
declare const COMPILER_KEYS: CompilerNameValues[];
/**
 * format: {compiler type}@{page type}@{page path}
 * e.g. client@pages@/index
 * e.g. server@app@app/page
 *
 * This guarantees the uniqueness for each page, to avoid conflicts between app/ and pages/
 */
export declare function getEntryKey(compilerType: CompilerNameValues, pageBundleType: 'app' | 'pages' | 'root', page: string): string;
export declare const ADDED: unique symbol;
export declare const BUILDING: unique symbol;
export declare const BUILT: unique symbol;
interface EntryType {
    /**
     * Tells if a page is scheduled to be disposed.
     */
    dispose?: boolean;
    /**
     * Timestamp with the last time the page was active.
     */
    lastActiveTime?: number;
    /**
     * Page build status.
     */
    status?: typeof ADDED | typeof BUILDING | typeof BUILT;
    /**
     * Path to the page file relative to the dist folder with no extension.
     * For example: `pages/about/index`
     */
    bundlePath: string;
    /**
     * Webpack request to create a dependency for.
     */
    request: string;
}
export declare const enum EntryTypes {
    ENTRY = 0,
    CHILD_ENTRY = 1
}
interface Entry extends EntryType {
    type: EntryTypes.ENTRY;
    /**
     * The absolute page to the page file. Used for detecting if the file was removed. For example:
     * `/Users/Rick/project/pages/about/index.js`
     */
    absolutePagePath: string;
    /**
     * All parallel pages that match the same entry, for example:
     * ['/parallel/@bar/nested/@a/page', '/parallel/@bar/nested/@b/page', '/parallel/@foo/nested/@a/page', '/parallel/@foo/nested/@b/page']
     */
    appPaths: ReadonlyArray<string> | null;
}
interface ChildEntry extends EntryType {
    type: EntryTypes.CHILD_ENTRY;
    /**
     * Which parent entries use this childEntry.
     */
    parentEntries: Set<string>;
    /**
     * The absolute page to the entry file. Used for detecting if the file was removed. For example:
     * `/Users/Rick/project/app/about/layout.js`
     */
    absoluteEntryFilePath?: string;
}
declare const entriesMap: Map<string, {
    /**
     * The key composed of the compiler name and the page. For example:
     * `edge-server/about`
     */
    [entryName: string]: Entry | ChildEntry;
}>;
export declare const getEntries: (dir: string) => NonNullable<ReturnType<(typeof entriesMap)['get']>>;
export declare const getInvalidator: (dir: string) => Invalidator | undefined;
declare class Invalidator {
    private multiCompiler;
    private building;
    private rebuildAgain;
    constructor(multiCompiler: webpack.MultiCompiler);
    shouldRebuildAll(): boolean;
    invalidate(compilerKeys?: typeof COMPILER_KEYS): void;
    startBuilding(compilerKey: keyof typeof COMPILER_INDEXES): void;
    doneBuilding(compilerKeys?: typeof COMPILER_KEYS): void;
    willRebuild(compilerKey: keyof typeof COMPILER_INDEXES): boolean;
}
export declare function onDemandEntryHandler({ maxInactiveAge, multiCompiler, nextConfig, pagesBufferLength, pagesDir, rootDir, appDir, }: {
    maxInactiveAge: number;
    multiCompiler: webpack.MultiCompiler;
    nextConfig: NextConfigComplete;
    pagesBufferLength: number;
    pagesDir?: string;
    rootDir: string;
    appDir?: string;
}): {
    ensurePage({ page, clientOnly, appPaths, match, }: {
        page: string;
        clientOnly: boolean;
        appPaths?: readonly string[] | null | undefined;
        match?: RouteMatch<import("../future/route-definitions/route-definition").RouteDefinition<RouteKind>> | undefined;
    }): Promise<void>;
    onHMR(client: ws, getHmrServerError: () => Error | null): void;
};
export {};
