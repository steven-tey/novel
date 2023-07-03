"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "detectLocaleCookie", {
    enumerable: true,
    get: function() {
        return detectLocaleCookie;
    }
});
function detectLocaleCookie(req, locales) {
    const { NEXT_LOCALE  } = req.cookies || {};
    return NEXT_LOCALE ? locales.find((locale)=>NEXT_LOCALE.toLowerCase() === locale.toLowerCase()) : undefined;
}

//# sourceMappingURL=detect-locale-cookie.js.map