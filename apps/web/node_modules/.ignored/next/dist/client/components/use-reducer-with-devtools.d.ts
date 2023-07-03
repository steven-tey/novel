import type { reducer } from './router-reducer/router-reducer';
import type { ReducerAction, Dispatch } from 'react';
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}
declare function useReducerWithReduxDevtoolsImpl(fn: typeof reducer, initialState: ReturnType<typeof reducer>): [
    ReturnType<typeof reducer>,
    Dispatch<ReducerAction<typeof reducer>>,
    () => void
];
export declare const useReducerWithReduxDevtools: typeof useReducerWithReduxDevtoolsImpl;
export {};
