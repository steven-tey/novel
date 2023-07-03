import { toNodeOutgoingHttpHeaders } from "../web/utils";
import { BaseNextRequest, BaseNextResponse } from "./index";
export class WebNextRequest extends BaseNextRequest {
    constructor(request){
        const url = new URL(request.url);
        super(request.method, url.href.slice(url.origin.length), request.clone().body);
        this.request = request;
        this.headers = {};
        for (const [name, value] of request.headers.entries()){
            this.headers[name] = value;
        }
    }
    async parseBody(_limit) {
        throw new Error("parseBody is not implemented in the web runtime");
    }
}
export class WebNextResponse extends BaseNextResponse {
    get sent() {
        return this._sent;
    }
    constructor(transformStream = new TransformStream()){
        super(transformStream.writable);
        this.transformStream = transformStream;
        this.headers = new Headers();
        this.textBody = undefined;
        this._sent = false;
        this.sendPromise = new Promise((resolve)=>{
            this.sendResolve = resolve;
        });
        this.response = this.sendPromise.then(()=>{
            return new Response(this.textBody ?? this.transformStream.readable, {
                headers: this.headers,
                status: this.statusCode,
                statusText: this.statusMessage
            });
        });
    }
    setHeader(name, value) {
        this.headers.delete(name);
        for (const val of Array.isArray(value) ? value : [
            value
        ]){
            this.headers.append(name, val);
        }
        return this;
    }
    removeHeader(name) {
        this.headers.delete(name);
        return this;
    }
    getHeaderValues(name) {
        var _this_getHeader;
        // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get#example
        return (_this_getHeader = this.getHeader(name)) == null ? void 0 : _this_getHeader.split(",").map((v)=>v.trimStart());
    }
    getHeader(name) {
        return this.headers.get(name) ?? undefined;
    }
    getHeaders() {
        return toNodeOutgoingHttpHeaders(this.headers);
    }
    hasHeader(name) {
        return this.headers.has(name);
    }
    appendHeader(name, value) {
        this.headers.append(name, value);
        return this;
    }
    body(value) {
        this.textBody = value;
        return this;
    }
    send() {
        var _this, _this_sendResolve;
        (_this_sendResolve = (_this = this).sendResolve) == null ? void 0 : _this_sendResolve.call(_this);
        this._sent = true;
    }
    toResponse() {
        return this.response;
    }
}

//# sourceMappingURL=web.js.map