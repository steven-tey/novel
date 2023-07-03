export declare const DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
export declare class DynamicServerError extends Error {
    digest: typeof DYNAMIC_ERROR_CODE;
    constructor(type: string);
}
