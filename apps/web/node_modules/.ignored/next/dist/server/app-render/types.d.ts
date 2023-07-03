/// <reference types="react" />
import type { LoadComponentsReturnType } from '../load-components';
import type { ServerRuntime, SizeLimit } from '../../../types';
import { NextConfigComplete } from '../../server/config-shared';
import type { ClientReferenceManifest } from '../../build/webpack/plugins/flight-manifest-plugin';
import type { NextFontManifest } from '../../build/webpack/plugins/next-font-manifest-plugin';
import zod from 'zod';
export type DynamicParamTypes = 'catchall' | 'optional-catchall' | 'dynamic';
declare const dynamicParamTypesSchema: zod.ZodEnum<["c", "oc", "d"]>;
/**
 * c = catchall
 * oc = optional catchall
 * d = dynamic
 */
export type DynamicParamTypesShort = zod.infer<typeof dynamicParamTypesSchema>;
declare const segmentSchema: zod.ZodUnion<[zod.ZodString, zod.ZodTuple<[zod.ZodString, zod.ZodString, zod.ZodEnum<["c", "oc", "d"]>], null>]>;
/**
 * Segment in the router state.
 */
export type Segment = zod.infer<typeof segmentSchema>;
export declare const flightRouterStateSchema: zod.ZodType<FlightRouterState>;
/**
 * Router state
 */
export type FlightRouterState = [
    segment: Segment,
    parallelRoutes: {
        [parallelRouterKey: string]: FlightRouterState;
    },
    url?: string | null,
    refresh?: 'refetch' | null,
    isRootLayout?: boolean
];
/**
 * Individual Flight response path
 */
export type FlightSegmentPath = any[] | [
    segment: Segment,
    parallelRouterKey: string,
    segment: Segment,
    parallelRouterKey: string,
    segment: Segment,
    parallelRouterKey: string
];
export type FlightDataPath = any[] | [
    ...FlightSegmentPath[],
    Segment,
    FlightRouterState,
    React.ReactNode | null,
    // Can be null during prefetch if there's no loading component
    React.ReactNode | null
];
/**
 * The Flight response data
 */
export type FlightData = Array<FlightDataPath> | string;
export type ActionResult = Promise<any>;
export type NextFlightResponse = [buildId: string, flightData: FlightData];
export type ActionFlightResponse = [
    ActionResult,
    [
        buildId: NextFlightResponse[0],
        flightData: NextFlightResponse[1] | null
    ]
];
/**
 * Property holding the current subTreeData.
 */
export type ChildProp = {
    /**
     * Null indicates that the tree is partial
     */
    current: React.ReactNode | null;
    segment: Segment;
};
export type RenderOptsPartial = {
    err?: Error | null;
    dev?: boolean;
    buildId: string;
    clientReferenceManifest?: ClientReferenceManifest;
    supportsDynamicHTML: boolean;
    runtime?: ServerRuntime;
    serverComponents?: boolean;
    assetPrefix?: string;
    nextFontManifest?: NextFontManifest;
    isBot?: boolean;
    incrementalCache?: import('../lib/incremental-cache').IncrementalCache;
    isRevalidate?: boolean;
    nextExport?: boolean;
    nextConfigOutput?: 'standalone' | 'export';
    appDirDevErrorLogger?: (err: any) => Promise<void>;
    originalPathname?: string;
    isDraftMode?: boolean;
    deploymentId?: string;
    loadConfig?: (phase: string, dir: string, customConfig?: object | null, rawConfig?: boolean, silent?: boolean) => Promise<NextConfigComplete>;
    serverActionsBodySizeLimit?: SizeLimit;
};
export type RenderOpts = LoadComponentsReturnType & RenderOptsPartial;
export {};
