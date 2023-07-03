/**
 * Create error handler for renderers.
 * Tolerate dynamic server errors during prerendering so console
 * isn't spammed with unactionable errors
 */
export declare function createErrorHandler({ 
/**
 * Used for debugging
 */
_source, dev, isNextExport, errorLogger, capturedErrors, allCapturedErrors, }: {
    _source: string;
    dev?: boolean;
    isNextExport?: boolean;
    errorLogger?: (err: any) => Promise<void>;
    capturedErrors: Error[];
    allCapturedErrors?: Error[];
}): (err: any) => string;
