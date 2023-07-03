"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNonStaticMethods", {
    enumerable: true,
    get: function() {
        return getNonStaticMethods;
    }
});
const NON_STATIC_METHODS = [
    "OPTIONS",
    "POST",
    "PUT",
    "DELETE",
    "PATCH"
];
function getNonStaticMethods(handlers) {
    // We can currently only statically optimize if only GET/HEAD are used as
    // prerender can't be used conditionally based on the method currently.
    const methods = NON_STATIC_METHODS.filter((method)=>handlers[method]);
    if (methods.length === 0) return false;
    return methods;
}

//# sourceMappingURL=get-non-static-methods.js.map