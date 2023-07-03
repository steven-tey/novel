import { getModuleBuildInfo } from "./get-module-build-info";
import { stringifyRequest } from "../stringify-request";
import { MIDDLEWARE_LOCATION_REGEXP } from "../../../lib/constants";
// matchers can have special characters that break the loader params
// parsing so we base64 encode/decode the string
export function encodeMatchers(matchers) {
    return Buffer.from(JSON.stringify(matchers)).toString("base64");
}
export function decodeMatchers(encodedMatchers) {
    return JSON.parse(Buffer.from(encodedMatchers, "base64").toString());
}
export default function middlewareLoader() {
    const { absolutePagePath , page , rootDir , matchers: encodedMatchers , preferredRegion , middlewareConfig: middlewareConfigBase64  } = this.getOptions();
    const matchers = encodedMatchers ? decodeMatchers(encodedMatchers) : undefined;
    const stringifiedPagePath = stringifyRequest(this, absolutePagePath);
    const middlewareConfig = JSON.parse(Buffer.from(middlewareConfigBase64, "base64").toString());
    const buildInfo = getModuleBuildInfo(this._module);
    buildInfo.nextEdgeMiddleware = {
        matchers,
        page: page.replace(new RegExp(`/${MIDDLEWARE_LOCATION_REGEXP}$`), "") || "/"
    };
    buildInfo.rootDir = rootDir;
    buildInfo.route = {
        page,
        absolutePagePath,
        preferredRegion,
        middlewareConfig
    };
    return `
        import 'next/dist/esm/server/web/globals'
        import { adapter } from 'next/dist/esm/server/web/adapter'
        import * as _mod from ${stringifiedPagePath}

        const mod = { ..._mod }
        const handler = mod.middleware || mod.default

        if (typeof handler !== 'function') {
          throw new Error('The Middleware "pages${page}" must export a \`middleware\` or a \`default\` function');
        }

        export default function (opts) {
          return adapter({
            ...opts,
            page: ${JSON.stringify(page)},
            handler,
          })
        }
    `;
}

//# sourceMappingURL=next-middleware-loader.js.map