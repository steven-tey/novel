"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchInlineAsset", {
    enumerable: true,
    get: function() {
        return fetchInlineAsset;
    }
});
const _fs = require("fs");
const _bodystreams = require("../../body-streams");
const _path = require("path");
async function fetchInlineAsset(options) {
    var _options_assets;
    const inputString = String(options.input);
    if (!inputString.startsWith("blob:")) {
        return;
    }
    const hash = inputString.replace("blob:", "");
    const asset = (_options_assets = options.assets) == null ? void 0 : _options_assets.find((x)=>x.name === hash);
    if (!asset) {
        return;
    }
    const filePath = (0, _path.resolve)(options.distDir, asset.filePath);
    const fileIsReadable = await _fs.promises.access(filePath).then(()=>true, ()=>false);
    if (fileIsReadable) {
        const readStream = (0, _fs.createReadStream)(filePath);
        return new options.context.Response((0, _bodystreams.requestToBodyStream)(options.context, Uint8Array, readStream));
    }
}

//# sourceMappingURL=fetch-inline-assets.js.map