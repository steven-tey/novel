import type { ResolveOptions } from 'enhanced-resolve';
export declare const globSync: (patterns: string | readonly string[], options?: import("globby").Options | undefined) => string[];
export declare const defaultConditionNames: string[];
export declare const defaultExtensions: string[];
export declare const defaultExtensionAlias: {
    '.js': string[];
    '.jsx': string[];
    '.cjs': string[];
    '.mjs': string[];
};
export declare const defaultMainFields: string[];
export declare const interfaceVersion = 2;
export interface TsResolverOptions extends Omit<ResolveOptions, 'fileSystem' | 'useSyncFileSystemCalls'> {
    alwaysTryTypes?: boolean;
    project?: string[] | string;
    extensions?: string[];
}
export declare function resolve(source: string, file: string, options?: TsResolverOptions | null): {
    found: boolean;
    path?: string | null;
};
