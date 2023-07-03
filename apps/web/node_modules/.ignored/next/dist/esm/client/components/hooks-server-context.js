export const DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
export class DynamicServerError extends Error {
    constructor(type){
        super("Dynamic server usage: " + type);
        this.digest = DYNAMIC_ERROR_CODE;
    }
}

//# sourceMappingURL=hooks-server-context.js.map