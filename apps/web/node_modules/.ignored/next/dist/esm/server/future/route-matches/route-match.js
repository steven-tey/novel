/**
 * Checks if the route match is the specified route match kind. This can also
 * be used to coerce the match type. Note that for situations where multiple
 * route match types are associated with a given route kind this function will
 * not validate it at runtime.
 *
 * @param match the match to check
 * @param kind the kind to check against
 * @returns true if the route match is of the specified kind
 */ export function isRouteMatch(match, kind) {
    return match.definition.kind === kind;
}
/**
 * Converts the query into params.
 *
 * @param query the query to convert to params
 * @returns the params
 */ export function parsedUrlQueryToParams(query) {
    const params = {};
    for (const [key, value] of Object.entries(query)){
        if (typeof value === "undefined") continue;
        params[key] = value;
    }
    return params;
}

//# sourceMappingURL=route-match.js.map