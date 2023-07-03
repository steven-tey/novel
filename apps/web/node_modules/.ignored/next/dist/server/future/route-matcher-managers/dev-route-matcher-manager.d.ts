import { RouteKind } from '../route-kind';
import { RouteMatch } from '../route-matches/route-match';
import { RouteDefinition } from '../route-definitions/route-definition';
import { DefaultRouteMatcherManager } from './default-route-matcher-manager';
import { MatchOptions, RouteMatcherManager } from './route-matcher-manager';
import { RouteMatcher } from '../route-matchers/route-matcher';
export interface RouteEnsurer {
    ensure(match: RouteMatch): Promise<void>;
}
export declare class DevRouteMatcherManager extends DefaultRouteMatcherManager {
    private readonly production;
    private readonly ensurer;
    private readonly dir;
    constructor(production: RouteMatcherManager, ensurer: RouteEnsurer, dir: string);
    test(pathname: string, options: MatchOptions): Promise<boolean>;
    protected validate(pathname: string, matcher: RouteMatcher, options: MatchOptions): RouteMatch | null;
    matchAll(pathname: string, options: MatchOptions): AsyncGenerator<RouteMatch<RouteDefinition<RouteKind>>, null, undefined>;
    reload(): Promise<void>;
}
