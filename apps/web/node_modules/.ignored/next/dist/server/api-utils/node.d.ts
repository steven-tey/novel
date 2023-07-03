/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { SizeLimit } from 'next/types';
import { __ApiPreviewProps } from '.';
import type { BaseNextRequest, BaseNextResponse } from '../base-http';
import type { PreviewData } from 'next/types';
export declare function tryGetPreviewData(req: IncomingMessage | BaseNextRequest | Request, res: ServerResponse | BaseNextResponse, options: __ApiPreviewProps): PreviewData;
/**
 * Parse incoming message like `json` or `urlencoded`
 * @param req request object
 */
export declare function parseBody(req: IncomingMessage, limit: SizeLimit): Promise<any>;
type ApiContext = __ApiPreviewProps & {
    trustHostHeader?: boolean;
    allowedRevalidateHeaderKeys?: string[];
    hostname?: string;
    revalidate?: (config: {
        urlPath: string;
        revalidateHeaders: {
            [key: string]: string | string[];
        };
        opts: {
            unstable_onlyGenerated?: boolean;
        };
    }) => Promise<any>;
};
export declare function apiResolver(req: IncomingMessage, res: ServerResponse, query: any, resolverModule: any, apiContext: ApiContext, propagateError: boolean, dev?: boolean, page?: string): Promise<void>;
export {};
