/// <reference types="node" />
/// <reference types="node" />
import type { ServerResponse, IncomingMessage } from 'http';
import type { Writable, Readable } from 'stream';
import type { SizeLimit } from 'next/types';
import { NextApiRequestCookies, SYMBOL_CLEARED_COOKIES } from '../api-utils';
import { NEXT_REQUEST_META, RequestMeta } from '../request-meta';
import { BaseNextRequest, BaseNextResponse } from './index';
import { OutgoingHttpHeaders } from 'node:http';
type Req = IncomingMessage & {
    [NEXT_REQUEST_META]?: RequestMeta;
    cookies?: NextApiRequestCookies;
};
export declare class NodeNextRequest extends BaseNextRequest<Readable> {
    private _req;
    headers: import("http").IncomingHttpHeaders;
    [NEXT_REQUEST_META]: RequestMeta;
    get originalRequest(): Req;
    set originalRequest(value: Req);
    constructor(_req: Req);
    parseBody(limit: SizeLimit): Promise<any>;
}
export declare class NodeNextResponse extends BaseNextResponse<Writable> {
    private _res;
    private textBody;
    [SYMBOL_CLEARED_COOKIES]?: boolean;
    get originalResponse(): ServerResponse<IncomingMessage> & {
        [SYMBOL_CLEARED_COOKIES]?: boolean | undefined;
    };
    constructor(_res: ServerResponse & {
        [SYMBOL_CLEARED_COOKIES]?: boolean;
    });
    get sent(): boolean;
    get statusCode(): number;
    set statusCode(value: number);
    get statusMessage(): string;
    set statusMessage(value: string);
    setHeader(name: string, value: string | string[]): this;
    removeHeader(name: string): this;
    getHeaderValues(name: string): string[] | undefined;
    hasHeader(name: string): boolean;
    getHeader(name: string): string | undefined;
    getHeaders(): OutgoingHttpHeaders;
    appendHeader(name: string, value: string): this;
    body(value: string): this;
    send(): void;
}
export {};
