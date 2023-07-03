import type { HTTP_METHOD } from '../../../../web/http';
import type { AppRouteHandlers } from '../module';
/**
 * Gets all the method names for handlers that are not considered static.
 *
 * @param handlers the handlers from the userland module
 * @returns the method names that are not considered static or false if all
 *          methods are static
 */
export declare function getNonStaticMethods(handlers: AppRouteHandlers): ReadonlyArray<HTTP_METHOD> | false;
