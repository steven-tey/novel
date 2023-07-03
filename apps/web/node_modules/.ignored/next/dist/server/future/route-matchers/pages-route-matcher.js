"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PagesRouteMatcher: null,
    PagesLocaleRouteMatcher: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PagesRouteMatcher: function() {
        return PagesRouteMatcher;
    },
    PagesLocaleRouteMatcher: function() {
        return PagesLocaleRouteMatcher;
    }
});
const _localeroutematcher = require("./locale-route-matcher");
const _routematcher = require("./route-matcher");
class PagesRouteMatcher extends _routematcher.RouteMatcher {
}
class PagesLocaleRouteMatcher extends _localeroutematcher.LocaleRouteMatcher {
}

//# sourceMappingURL=pages-route-matcher.js.map