import type { I18NConfig } from '../../config-shared';
import type { RequestData } from '../types';
import { NextURL } from '../next-url';
import { RequestCookies } from './cookies';
export declare const INTERNALS: unique symbol;
export declare class NextRequest extends Request {
    [INTERNALS]: {
        cookies: RequestCookies;
        geo: RequestData['geo'];
        ip?: string;
        url: string;
        nextUrl: NextURL;
    };
    constructor(input: URL | RequestInfo, init?: RequestInit);
    get cookies(): RequestCookies;
    get geo(): {
        city?: string | undefined;
        country?: string | undefined;
        region?: string | undefined;
        latitude?: string | undefined;
        longitude?: string | undefined;
    } | undefined;
    get ip(): string | undefined;
    get nextUrl(): NextURL;
    /**
     * @deprecated
     * `page` has been deprecated in favour of `URLPattern`.
     * Read more: https://nextjs.org/docs/messages/middleware-request-page
     */
    get page(): void;
    /**
     * @deprecated
     * `ua` has been removed in favour of \`userAgent\` function.
     * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
     */
    get ua(): void;
    get url(): string;
}
export interface RequestInit extends globalThis.RequestInit {
    geo?: {
        city?: string;
        country?: string;
        region?: string;
    };
    ip?: string;
    nextConfig?: {
        basePath?: string;
        i18n?: I18NConfig | null;
        trailingSlash?: boolean;
    };
    signal?: AbortSignal;
}
