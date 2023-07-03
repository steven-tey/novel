"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DevAppPageNormalizer", {
    enumerable: true,
    get: function() {
        return DevAppPageNormalizer;
    }
});
const _absolutefilenamenormalizer = require("../../absolute-filename-normalizer");
class DevAppPageNormalizer extends _absolutefilenamenormalizer.AbsoluteFilenameNormalizer {
    constructor(appDir, extensions){
        super(appDir, extensions, "app");
    }
}

//# sourceMappingURL=app-page-normalizer.js.map