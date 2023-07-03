import type { FlightRouterState, FlightData } from '../../../server/app-render/types';
import { PrefetchKind } from './router-reducer-types';
type FetchServerResponseResult = [
    flightData: FlightData,
    canonicalUrlOverride: URL | undefined
];
/**
 * Fetch the flight data for the provided url. Takes in the current router state to decide what to render server-side.
 */
export declare function fetchServerResponse(url: URL, flightRouterState: FlightRouterState, nextUrl: string | null, currentBuildId: string, prefetchKind?: PrefetchKind): Promise<FetchServerResponseResult>;
export {};
