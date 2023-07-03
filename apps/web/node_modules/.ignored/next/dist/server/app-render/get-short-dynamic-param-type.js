"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getShortDynamicParamType", {
    enumerable: true,
    get: function() {
        return getShortDynamicParamType;
    }
});
function getShortDynamicParamType(type) {
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