"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isBlockedPage: null,
    cleanAmpPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isBlockedPage: function() {
        return isBlockedPage;
    },
    cleanAmpPath: function() {
        return cleanAmpPath;
    }
});
const _constants = require("../shared/lib/constants");
function isBlockedPage(pathname) {
    return _constants.BLOCKED_PAGES.includes(pathname);
}
function cleanAmpPath(pathname) {
    if (pathname.match(/\?amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/\?amp=(y|yes|true|1)&?/, "?");
    }
    if (pathname.match(/&amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/&amp=(y|yes|true|1)/, "");
    }
    pathname = pathname.replace(/\?$/, "");
    return pathname;
}

//# sourceMappingURL=utils.js.map