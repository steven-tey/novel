import { CacheStates } from "../../../shared/lib/app-router-context";
import { createHrefFromUrl } from "./create-href-from-url";
import { fillLazyItemsTillLeafWithHead } from "./fill-lazy-items-till-leaf-with-head";
import { extractPathFromFlightRouterState } from "./compute-changed-path";
export function createInitialRouterState(param) {
    let { buildId , initialTree , children , initialCanonicalUrl , initialParallelRoutes , isServer , location , initialHead  } = param;
    const cache = {
        status: CacheStates.READY,
        data: null,
        subTreeData: children,
        // The cache gets seeded during the first render. `initialParallelRoutes` ensures the cache from the first render is there during the second render.
        parallelRoutes: isServer ? new Map() : initialParallelRoutes
    };
    // When the cache hasn't been seeded yet we fill the cache with the head.
    if (initialParallelRoutes === null || initialParallelRoutes.size === 0) {
        fillLazyItemsTillLeafWithHead(cache, undefined, initialTree, initialHead);
    }
    var // the || operator is intentional, the pathname can be an empty string
    _ref;
    return {
        buildId,
        tree: initialTree,
        cache,
        prefetchCache: new Map(),
        pushRef: {
            pendingPush: false,
            mpaNavigation: false
        },
        focusAndScrollRef: {
            apply: false,
            hashFragment: null,
            segmentPaths: []
        },
        canonicalUrl: // location.href is read as the initial value for canonicalUrl in the browser
        // This is safe to do as canonicalUrl can't be rendered, it's only used to control the history updates in the useEffect further down in this file.
        location ? createHrefFromUrl(location) : initialCanonicalUrl,
        nextUrl: (_ref = extractPathFromFlightRouterState(initialTree) || (location == null ? void 0 : location.pathname)) != null ? _ref : null
    };
}

//# sourceMappingURL=create-initial-router-state.js.map