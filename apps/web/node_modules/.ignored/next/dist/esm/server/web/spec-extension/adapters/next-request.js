import { getRequestMeta } from "../../../request-meta";
import { fromNodeOutgoingHttpHeaders } from "../../utils";
import { NextRequest } from "../request";
export function signalFromNodeRequest(request) {
    const { errored  } = request;
    if (errored) return AbortSignal.abort(errored);
    const controller = new AbortController();
    request.on("error", (e)=>{
        controller.abort(e);
    });
    return controller.signal;
}
export class NextRequestAdapter {
    static fromBaseNextRequest(request) {
        // TODO: look at refining this check
        if ("request" in request && request.request) {
            return NextRequestAdapter.fromWebNextRequest(request);
        }
        return NextRequestAdapter.fromNodeNextRequest(request);
    }
    static fromNodeNextRequest(request) {
        // HEAD and GET requests can not have a body.
        let body = null;
        if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
            // @ts-expect-error - this is handled by undici, when streams/web land use it instead
            body = request.body;
        }
        let url;
        if (request.url.startsWith("http")) {
            url = new URL(request.url);
        } else {
            // Grab the full URL from the request metadata.
            const base = getRequestMeta(request, "__NEXT_INIT_URL");
            if (!base || !base.startsWith("http")) {
                // Because the URL construction relies on the fact that the URL provided
                // is absolute, we need to provide a base URL. We can't use the request
                // URL because it's relative, so we use a dummy URL instead.
                url = new URL(request.url, "http://n");
            } else {
                url = new URL(request.url, base);
            }
        }
        return new NextRequest(url, {
            body,
            method: request.method,
            headers: fromNodeOutgoingHttpHeaders(request.headers),
            // @ts-expect-error - see https://github.com/whatwg/fetch/pull/1457
            duplex: "half",
            signal: signalFromNodeRequest(request.originalRequest)
        });
    }
    static fromWebNextRequest(request) {
        // HEAD and GET requests can not have a body.
        let body = null;
        if (request.method !== "GET" && request.method !== "HEAD") {
            body = request.body;
        }
        return new NextRequest(request.url, {
            body,
            method: request.method,
            headers: fromNodeOutgoingHttpHeaders(request.headers),
            // @ts-expect-error - see https://github.com/whatwg/fetch/pull/1457
            duplex: "half",
            signal: request.request.signal
        });
    }
}

//# sourceMappingURL=next-request.js.map