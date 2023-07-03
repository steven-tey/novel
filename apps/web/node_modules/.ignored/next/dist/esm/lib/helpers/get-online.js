import { execSync } from "child_process";
import dns from "dns";
import url from "url";
function getProxy() {
    if (process.env.https_proxy) {
        return process.env.https_proxy;
    }
    try {
        const httpsProxy = execSync("npm config get https-proxy").toString().trim();
        return httpsProxy !== "null" ? httpsProxy : undefined;
    } catch (e) {
        return;
    }
}
export function getOnline() {
    return new Promise((resolve)=>{
        dns.lookup("registry.yarnpkg.com", (registryErr)=>{
            if (!registryErr) {
                return resolve(true);
            }
            const proxy = getProxy();
            if (!proxy) {
                return resolve(false);
            }
            const { hostname  } = url.parse(proxy);
            if (!hostname) {
                return resolve(false);
            }
            dns.lookup(hostname, (proxyErr)=>{
                resolve(proxyErr == null);
            });
        });
    });
}

//# sourceMappingURL=get-online.js.map