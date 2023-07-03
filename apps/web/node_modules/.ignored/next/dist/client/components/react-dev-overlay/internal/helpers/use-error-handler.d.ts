export type ErrorHandler = (error: Error) => void;
export declare const RuntimeErrorHandler: {
    hadRuntimeError: boolean;
};
export declare function useErrorHandler(handleOnUnhandledError: ErrorHandler, handleOnUnhandledRejection: ErrorHandler): void;
