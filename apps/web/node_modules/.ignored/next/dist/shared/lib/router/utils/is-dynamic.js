// Identify /[param]/ in route string
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isDynamicRoute", {
    enumerable: true,
    get: function() {
        return isDynamicRoute;
    }
});
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
}

//# sourceMappingURL=is-dynamic.js.map