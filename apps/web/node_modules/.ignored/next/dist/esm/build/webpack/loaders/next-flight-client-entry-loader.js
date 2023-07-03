import { RSC_MODULE_TYPES } from "../../../shared/lib/constants";
import { getModuleBuildInfo } from "./get-module-build-info";
import { regexCSS } from "./utils";
export default function transformSource() {
    let { modules , server  } = this.getOptions();
    const isServer = server === "true";
    if (!Array.isArray(modules)) {
        modules = modules ? [
            modules
        ] : [];
    }
    const requests = modules;
    const code = requests// Filter out CSS files in the SSR compilation
    .filter((request)=>isServer ? !regexCSS.test(request) : true).map((request)=>`import(/* webpackMode: "eager" */ ${JSON.stringify(request)})`).join(";\n");
    const buildInfo = getModuleBuildInfo(this._module);
    buildInfo.rsc = {
        type: RSC_MODULE_TYPES.client
    };
    return code;
}

//# sourceMappingURL=next-flight-client-entry-loader.js.map