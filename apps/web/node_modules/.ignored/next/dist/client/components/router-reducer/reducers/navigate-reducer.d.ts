import { Mutable, NavigateAction, ReadonlyReducerState, ReducerState } from '../router-reducer-types';
export declare function handleExternalUrl(state: ReadonlyReducerState, mutable: Mutable, url: string, pendingPush: boolean): import("../router-reducer-types").AppRouterState;
export declare function navigateReducer(state: ReadonlyReducerState, action: NavigateAction): ReducerState;
