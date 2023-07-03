/// <reference types="node" />
import type { AsyncLocalStorage } from 'async_hooks';
export interface ActionStore {
    readonly isAction?: boolean;
    readonly isAppRoute?: boolean;
}
export type ActionAsyncStorage = AsyncLocalStorage<ActionStore>;
export declare const actionAsyncStorage: ActionAsyncStorage;
