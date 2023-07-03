import type { CacheHandler, CacheHandlerContext, CacheHandlerValue } from './';
export default class FetchCache implements CacheHandler {
    private headers;
    private cacheEndpoint?;
    private debug;
    private revalidatedTags;
    constructor(ctx: CacheHandlerContext);
    revalidateTag(tag: string): Promise<void>;
    get(key: string, fetchCache?: boolean, fetchUrl?: string, fetchIdx?: number): Promise<CacheHandlerValue | null>;
    set(key: string, data: CacheHandlerValue['value'], fetchCache?: boolean, fetchUrl?: string, fetchIdx?: number): Promise<void>;
}
