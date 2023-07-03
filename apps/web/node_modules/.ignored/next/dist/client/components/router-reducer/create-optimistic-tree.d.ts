import type { FlightRouterState } from '../../../server/app-render/types';
/**
 * Create optimistic version of router state based on the existing router state and segments.
 * This is used to allow rendering layout-routers up till the point where data is missing.
 */
export declare function createOptimisticTree(segments: string[], flightRouterState: FlightRouterState | null, parentRefetch: boolean): FlightRouterState;
