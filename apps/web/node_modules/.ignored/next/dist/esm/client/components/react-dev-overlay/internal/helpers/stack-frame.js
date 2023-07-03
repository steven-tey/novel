export function getOriginalStackFrame(source, type, errorMessage) {
    var _source_file, _source_file1;
    async function _getOriginalStackFrame() {
        var /* collapsed */ _source_file, _body_originalStackFrame, _body_originalStackFrame_file;
        const params = new URLSearchParams();
        params.append("isServer", String(type === "server"));
        params.append("isEdgeServer", String(type === "edge-server"));
        params.append("isAppDirectory", "true");
        params.append("errorMessage", errorMessage);
        for(const key in source){
            var _source_key;
            params.append(key, ((_source_key = source[key]) != null ? _source_key : "").toString());
        }
        const controller = new AbortController();
        const tm = setTimeout(()=>controller.abort(), 3000);
        const res = await self.fetch((process.env.__NEXT_ROUTER_BASEPATH || "") + "/__nextjs_original-stack-frame?" + params.toString(), {
            signal: controller.signal
        }).finally(()=>{
            clearTimeout(tm);
        });
        if (!res.ok || res.status === 204) {
            return Promise.reject(new Error(await res.text()));
        }
        const body = await res.json();
        var _ref;
        return {
            error: false,
            reason: null,
            external: false,
            expanded: !Boolean((_ref = ((_source_file = source.file) == null ? void 0 : _source_file.includes("node_modules")) || ((_body_originalStackFrame = body.originalStackFrame) == null ? void 0 : (_body_originalStackFrame_file = _body_originalStackFrame.file) == null ? void 0 : _body_originalStackFrame_file.includes("node_modules"))) != null ? _ref : true),
            sourceStackFrame: source,
            originalStackFrame: body.originalStackFrame,
            originalCodeFrame: body.originalCodeFrame || null,
            sourcePackage: body.sourcePackage
        };
    }
    if (!(((_source_file = source.file) == null ? void 0 : _source_file.startsWith("webpack-internal:")) || ((_source_file1 = source.file) == null ? void 0 : _source_file1.startsWith("file:")))) {
        return Promise.resolve({
            error: false,
            reason: null,
            external: true,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        });
    }
    var _err_message, _ref;
    return _getOriginalStackFrame().catch((err)=>{
        return {
            error: true,
            reason: (_ref = (_err_message = err == null ? void 0 : err.message) != null ? _err_message : err == null ? void 0 : err.toString()) != null ? _ref : "Unknown Error",
            external: false,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        };
    });
}
export function getOriginalStackFrames(frames, type, errorMessage) {
    return Promise.all(frames.map((frame)=>getOriginalStackFrame(frame, type, errorMessage)));
}
export function getFrameSource(frame) {
    let str = "";
    try {
        var _globalThis_location;
        const u = new URL(frame.file);
        // Strip the origin for same-origin scripts.
        if (typeof globalThis !== "undefined" && ((_globalThis_location = globalThis.location) == null ? void 0 : _globalThis_location.origin) !== u.origin) {
            // URLs can be valid without an `origin`, so long as they have a
            // `protocol`. However, `origin` is preferred.
            if (u.origin === "null") {
                str += u.protocol;
            } else {
                str += u.origin;
            }
        }
        // Strip query string information as it's typically too verbose to be
        // meaningful.
        str += u.pathname;
        str += " ";
    } catch (e) {
        str += (frame.file || "(unknown)") + " ";
    }
    if (frame.lineNumber != null) {
        if (frame.column != null) {
            str += "(" + frame.lineNumber + ":" + frame.column + ") ";
        } else {
            str += "(" + frame.lineNumber + ") ";
        }
    }
    return str.slice(0, -1);
}

//# sourceMappingURL=stack-frame.js.map