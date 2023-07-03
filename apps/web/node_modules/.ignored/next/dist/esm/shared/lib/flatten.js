/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first. Stolen from Ramda.
 */ export function flatten(list) {
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