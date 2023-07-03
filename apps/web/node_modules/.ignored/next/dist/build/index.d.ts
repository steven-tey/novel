import '../lib/setup-exception-listeners';
import { __ApiPreviewProps } from '../server/api-utils';
export type SsgRoute = {
    initialRevalidateSeconds: number | false;
    srcRoute: string | null;
    dataRoute: string | null;
    initialStatus?: number;
    initialHeaders?: Record<string, string>;
};
export type DynamicSsgRoute = {
    routeRegex: string;
    fallback: string | null | false;
    dataRoute: string | null;
    dataRouteRegex: string | null;
};
export type PrerenderManifest = {
    version: 4;
    routes: {
        [route: string]: SsgRoute;
    };
    dynamicRoutes: {
        [route: string]: DynamicSsgRoute;
    };
    notFoundRoutes: string[];
    preview: __ApiPreviewProps;
};
export default function build(dir: string, reactProductionProfiling: boolean | undefined, debugOutput: boolean | undefined, runLint: boolean | undefined, noMangling: boolean | undefined, appDirOnly: boolean | undefined, turboNextBuild: boolean | undefined, turboNextBuildRoot: null | undefined, buildMode: 'default' | 'experimental-compile' | 'experimental-generate'): Promise<void>;
