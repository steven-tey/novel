/// <reference types="node" />
import { IncomingMessage } from 'http';
export declare const invokeRequest: (targetUrl: string, requestInit: {
    headers: IncomingMessage['headers'];
    method: IncomingMessage['method'];
}, readableBody?: import('stream').Readable) => Promise<IncomingMessage>;
