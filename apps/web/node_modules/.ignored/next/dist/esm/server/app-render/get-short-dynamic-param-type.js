/**
 * Shorten the dynamic param in order to make it smaller when transmitted to the browser.
 */ export function getShortDynamicParamType(type) {
    switch(type){
        case "catchall":
            return "c";
        case "optional-catchall":
            return "oc";
        case "dynamic":
            return "d";
        default:
            throw new Error("Unknown dynamic param type");
    }
}

//# sourceMappingURL=get-short-dynamic-param-type.js.map