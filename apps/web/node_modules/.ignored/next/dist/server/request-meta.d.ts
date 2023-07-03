/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { ParsedUrlQuery } from 'querystring';
import type { UrlWithParsedQuery } from 'url';
import type { BaseNextRequest } from './base-http';
import type { CloneableBody } from './body-streams';
import { RouteMatch } from './future/route-matches/route-match';
import { NEXT_RSC_UNION_QUERY } from '../client/components/app-router-headers';
export declare const NEXT_REQUEST_META: unique symbol;
export type NextIncomingMessage = (BaseNextRequest | IncomingMessage) & {
    [NEXT_REQUEST_META]?: RequestMeta;
};
export interface RequestMeta {
    __NEXT_INIT_QUERY?: ParsedUrlQuery;
    __NEXT_INIT_URL?: string;
    __NEXT_CLONABLE_BODY?: CloneableBody;
    __nextHadTrailingSlash?: boolean;
    /**
     * True when the request matched a locale domain that was configured in the
     * next.config.js file.
     */
    __nextIsLocaleDomain?: boolean;
    /**
     * True when the request had locale information stripped from the pathname
     * part of the URL.
     */
    __nextStrippedLocale?: boolean;
    _nextDidRewrite?: boolean;
    _nextHadBasePath?: boolean;
    _nextRewroteUrl?: string;
    _nextMiddlewareCookie?: string[];
    _protocol?: string;
    _nextDataNormalizing?: boolean;
    _nextMatch?: RouteMatch;
    _nextIncrementalCache?: any;
    _nextMinimalMode?: boolean;
}
/**
 * Gets the request metadata. If no key is provided, the entire metadata object
 * is returned.
 *
 * @param req the request to get the metadata from
 * @param key the key to get from the metadata (optional)
 * @returns the value for the key or the entire metadata object
 */
export declare function getRequestMeta(req: NextIncomingMessage, key?: undefined): RequestMeta;
export declare function getRequestMeta<K extends keyof RequestMeta>(req: NextIncomingMessage, key: K): RequestMeta[K];
/**
 * Sets the request metadata.
 *
 * @param req the request to set the metadata on
 * @param meta the metadata to set
 * @returns the mutated request metadata
 */
export declare function setRequestMeta(req: NextIncomingMessage, meta: RequestMeta): RequestMeta;
/**
 * Adds a value to the request metadata.
 *
 * @param request the request to mutate
 * @param key the key to set
 * @param value the value to set
 * @returns the mutated request metadata
 */
export declare function addRequestMeta<K extends keyof RequestMeta>(request: NextIncomingMessage, key: K, value: RequestMeta[K]): RequestMeta;
/**
 * Removes a key from the request metadata.
 *
 * @param request the request to mutate
 * @param key the key to remove
 * @returns the mutated request metadata
 */
export declare function removeRequestMeta<K extends keyof RequestMeta>(request: NextIncomingMessage, key: K): RequestMeta;
type NextQueryMetadata = {
    __nextNotFoundSrcPage?: string;
    __nextDefaultLocale?: string;
    __nextFallback?: 'true';
    /**
     * The locale that was inferred or explicitly set for the request.
     *
     * When this property is mutated, it's important to also update the request
     * metadata for `_nextInferredDefaultLocale` to ensure that the correct
     * behavior is applied.
     */
    __nextLocale?: string;
    /**
     * `1` when the request did not have a locale in the pathname part of the
     * URL but the default locale was inferred from either the domain or the
     * configuration.
     */
    __nextInferredLocaleFromDefault?: '1';
    __nextSsgPath?: string;
    _nextBubbleNoFallback?: '1';
    __nextDataReq?: '1';
    __nextCustomErrorRender?: '1';
    [NEXT_RSC_UNION_QUERY]?: string;
};
export type NextParsedUrlQuery = ParsedUrlQuery & NextQueryMetadata & {
    amp?: '1';
};
export interface NextUrlWithParsedQuery extends UrlWithParsedQuery {
    query: NextParsedUrlQuery;
}
export declare function getNextInternalQuery(query: NextParsedUrlQuery): NextQueryMetadata;
export {};
