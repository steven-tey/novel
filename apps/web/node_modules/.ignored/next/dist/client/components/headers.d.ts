import { type ReadonlyRequestCookies } from '../../server/web/spec-extension/adapters/request-cookies';
import { DraftMode } from './draft-mode';
export declare function headers(): import("../../server/web/spec-extension/adapters/headers").ReadonlyHeaders;
export declare function cookies(): ReadonlyRequestCookies;
export declare function draftMode(): DraftMode;
