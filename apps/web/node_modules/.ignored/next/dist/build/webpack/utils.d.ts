import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare function traverseModules(compilation: webpack.Compilation, callback: (mod: any, chunk: webpack.Chunk, chunkGroup: (typeof compilation.chunkGroups)[0], modId: string | number) => any, filterChunkGroup?: (chunkGroup: webpack.ChunkGroup) => boolean): void;
export declare function forEachEntryModule(compilation: any, callback: ({ name, entryModule }: {
    name: string;
    entryModule: any;
}) => void): void;
