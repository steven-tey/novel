import Router from '../shared/lib/router/router';
import type { NextRouter } from '../shared/lib/router/router';
type SingletonRouterBase = {
    router: Router | null;
    readyCallbacks: Array<() => any>;
    ready(cb: () => any): void;
};
export { Router };
export type { NextRouter };
export type SingletonRouter = SingletonRouterBase & NextRouter;
declare const routerEvents: readonly ["routeChangeStart", "beforeHistoryChange", "routeChangeComplete", "routeChangeError", "hashChangeStart", "hashChangeComplete"];
export type RouterEvent = (typeof routerEvents)[number];
declare const _default: SingletonRouter;
export default _default;
export { default as withRouter } from './with-router';
export declare function useRouter(): NextRouter;
