import type { NextMiddleware, RequestData, FetchEventResult } from './types';
export type AdapterOptions = {
    handler: NextMiddleware;
    page: string;
    request: RequestData;
    IncrementalCache?: typeof import('../lib/incremental-cache').IncrementalCache;
};
export declare function adapter(params: AdapterOptions): Promise<FetchEventResult>;
