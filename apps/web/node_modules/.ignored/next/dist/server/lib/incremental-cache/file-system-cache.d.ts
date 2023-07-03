import type { CacheHandler, CacheHandlerContext, CacheHandlerValue } from './';
import { CacheFs } from '../../../shared/lib/utils';
type FileSystemCacheContext = Omit<CacheHandlerContext, 'fs' | 'serverDistDir'> & {
    fs: CacheFs;
    serverDistDir: string;
};
export default class FileSystemCache implements CacheHandler {
    private fs;
    private flushToDisk?;
    private serverDistDir;
    private appDir;
    private tagsManifestPath?;
    private revalidatedTags;
    constructor(ctx: FileSystemCacheContext);
    private loadTagsManifest;
    setTags(key: string, tags: string[]): Promise<void>;
    revalidateTag(tag: string): Promise<void>;
    get(key: string, fetchCache?: boolean): Promise<CacheHandlerValue | null>;
    set(key: string, data: CacheHandlerValue['value']): Promise<void>;
    private getFsPath;
}
export {};
