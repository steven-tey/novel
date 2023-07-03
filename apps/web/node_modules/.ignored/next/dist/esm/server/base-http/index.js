import { PERMANENT_REDIRECT_STATUS } from "../../shared/lib/constants";
import { getCookieParser } from "../api-utils";
export class BaseNextRequest {
    constructor(method, url, body){
        this.method = method;
        this.url = url;
        this.body = body;
    }
    // Utils implemented using the abstract methods above
    get cookies() {
        if (this._cookies) return this._cookies;
        return this._cookies = getCookieParser(this.headers)();
    }
}
export class BaseNextResponse {
    constructor(destination){
        this.destination = destination;
    }
    // Utils implemented using the abstract methods above
    redirect(destination, statusCode) {
        this.setHeader("Location", destination);
        this.statusCode = statusCode;
        // Since IE11 doesn't support the 308 header add backwards
        // compatibility using refresh header
        if (statusCode === PERMANENT_REDIRECT_STATUS) {
            this.setHeader("Refresh", `0;url=${destination}`);
        }
        return this;
    }
}

//# sourceMappingURL=index.js.map