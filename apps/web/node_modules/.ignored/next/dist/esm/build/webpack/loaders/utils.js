import { createHash } from "crypto";
import { RSC_MODULE_TYPES } from "../../../shared/lib/constants";
const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "ico",
    "svg"
];
const imageRegex = new RegExp(`\\.(${imageExtensions.join("|")})$`);
export function isClientComponentEntryModule(mod) {
    const rscInfo = mod.buildInfo.rsc;
    const hasClientDirective = rscInfo == null ? void 0 : rscInfo.isClientRef;
    const isActionLayerEntry = (rscInfo == null ? void 0 : rscInfo.actions) && (rscInfo == null ? void 0 : rscInfo.type) === RSC_MODULE_TYPES.client;
    return hasClientDirective || isActionLayerEntry || imageRegex.test(mod.resource);
}
export const regexCSS = /\.(css|scss|sass)(\?.*)?$/;
// This function checks if a module is able to emit CSS resources. You should
// never only rely on a single regex to do that.
export function isCSSMod(mod) {
    var _mod_loaders;
    return !!(mod.type === "css/mini-extract" || mod.resource && regexCSS.test(mod.resource) || ((_mod_loaders = mod.loaders) == null ? void 0 : _mod_loaders.some(({ loader  })=>loader.includes("next-style-loader/index.js") || loader.includes("mini-css-extract-plugin/loader.js") || loader.includes("@vanilla-extract/webpack-plugin/loader/"))));
}
export function getActions(mod) {
    var _mod_buildInfo, _mod_buildInfo_rsc;
    return (_mod_buildInfo = mod.buildInfo) == null ? void 0 : (_mod_buildInfo_rsc = _mod_buildInfo.rsc) == null ? void 0 : _mod_buildInfo_rsc.actions;
}
export function generateActionId(filePath, exportName) {
    return createHash("sha1").update(filePath + ":" + exportName).digest("hex");
}
export function encodeToBase64(obj) {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
}
export function decodeFromBase64(str) {
    return JSON.parse(Buffer.from(str, "base64").toString("utf8"));
}

//# sourceMappingURL=utils.js.map