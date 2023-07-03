"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getOnline", {
    enumerable: true,
    get: function() {
        return getOnline;
    }
});
const _child_process = require("child_process");
const _dns = /*#__PURE__*/ _interop_require_default(require("dns"));
const _url = /*#__PURE__*/ _interop_require_default(require("url"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getProxy() {
    if (process.env.https_proxy) {
        return process.env.https_proxy;
    }
    try {
        const httpsProxy = (0, _child_process.execSync)("npm config get https-proxy").toString().trim();
        return httpsProxy !== "null" ? httpsProxy : undefined;
    } catch (e) {
        return;
    }
}
function getOnline() {
    return new Promise((resolve)=>{
        _dns.default.lookup("registry.yarnpkg.com", (registryErr)=>{
            if (!registryErr) {
                return resolve(true);
            }
            const proxy = getProxy();
            if (!proxy) {
                return resolve(false);
            }
            const { hostname  } = _url.default.parse(proxy);
            if (!hostname) {
                return resolve(false);
            }
            _dns.default.lookup(hostname, (proxyErr)=>{
                resolve(proxyErr == null);
            });
        });
    });
}

//# sourceMappingURL=get-online.js.map