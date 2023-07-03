import type { webpack } from 'next/dist/compiled/webpack/webpack';
import { MiddlewareConfig } from '../../../analysis/get-page-static-info';
type RouteLoaderOptionsInput = {
    page: string;
    pages: {
        [page: string]: string;
    };
    preferredRegion: string | string[] | undefined;
    absolutePagePath: string;
    middlewareConfig: MiddlewareConfig;
};
/**
 * The options for the route loader.
 */
type RouteLoaderOptions = {
    /**
     * The page name for this particular route.
     */
    page: string;
    /**
     * The preferred region for this route.
     */
    preferredRegion: string | string[] | undefined;
    /**
     * The absolute path to the userland page file.
     */
    absolutePagePath: string;
    absoluteAppPath: string;
    absoluteDocumentPath: string;
    middlewareConfigBase64: string;
};
/**
 * Returns the loader entry for a given page.
 *
 * @param options the options to create the loader entry
 * @returns the encoded loader entry
 */
export declare function getRouteLoaderEntry(options: RouteLoaderOptionsInput): string;
/**
 * Handles the `next-route-loader` options.
 * @returns the loader definition function
 */
declare const loader: webpack.LoaderDefinitionFunction<RouteLoaderOptions>;
export default loader;
