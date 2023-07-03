/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import RenderResult from '../render-result';
import { setRevalidateHeaders } from './revalidate-headers';
export type PayloadOptions = {
    private: true;
} | {
    private: boolean;
    stateful: true;
} | {
    private: boolean;
    stateful: false;
    revalidate: number | false;
};
export { setRevalidateHeaders };
export declare function sendEtagResponse(req: IncomingMessage, res: ServerResponse, etag: string | undefined): boolean;
export declare function sendRenderResult({ req, res, result, type, generateEtags, poweredByHeader, options, }: {
    req: IncomingMessage;
    res: ServerResponse;
    result: RenderResult;
    type: 'html' | 'json' | 'rsc';
    generateEtags: boolean;
    poweredByHeader: boolean;
    options?: PayloadOptions;
}): Promise<void>;
