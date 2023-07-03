// Identify /[param]/ in route string
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
export function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
}

//# sourceMappingURL=is-dynamic.js.map