"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BaseNextRequest: null,
    BaseNextResponse: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BaseNextRequest: function() {
        return BaseNextRequest;
    },
    BaseNextResponse: function() {
        return BaseNextResponse;
    }
});
const _constants = require("../../shared/lib/constants");
const _apiutils = require("../api-utils");
class BaseNextRequest {
    constructor(method, url, body){
        this.method = method;
        this.url = url;
        this.body = body;
    }
    // Utils implemented using the abstract methods above
    get cookies() {
        if (this._cookies) return this._cookies;
        return this._cookies = (0, _apiutils.getCookieParser)(this.headers)();
    }
}
class BaseNextResponse {
    constructor(destination){
        this.destination = destination;
    }
    // Utils implemented using the abstract methods above
    redirect(destination, statusCode) {
        this.setHeader("Location", destination);
        this.statusCode = statusCode;
        // Since IE11 doesn't support the 308 header add backwards
        // compatibility using refresh header
        if (statusCode === _constants.PERMANENT_REDIRECT_STATUS) {
            this.setHeader("Refresh", `0;url=${destination}`);
        }
        return this;
    }
}

//# sourceMappingURL=index.js.map