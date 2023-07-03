export declare let hydrationErrorWarning: string | undefined;
export declare let hydrationErrorComponentStack: string | undefined;
/**
 * Patch console.error to capture hydration errors.
 * If any of the knownHydrationWarnings are logged, store the message and component stack.
 * When the hydration runtime error is thrown, the message and component stack are added to the error.
 * This results in a more helpful error message in the error overlay.
 */
export declare function patchConsoleError(): void;
