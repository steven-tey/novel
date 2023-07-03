"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "flatten", {
    enumerable: true,
    get: function() {
        return flatten;
    }
});
function flatten(list) {
    let jlen, j, value, idx = 0, result = [];
    while(idx < list.length){
        if (Array.isArray(list[idx])) {
            value = flatten(list[idx]);
            j = 0;
            jlen = value.length;
            while(j < jlen){
                result[result.length] = value[j];
                j += 1;
            }
        } else {
            result[result.length] = list[idx];
        }
        idx += 1;
    }
    return result;
}

//# sourceMappingURL=flatten.js.map