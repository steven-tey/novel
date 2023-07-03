/**
 * filepath   export      module key
 * "file"     '*'         "file"
 * "file"     ''          "file#"
 * "file"     '<named>'   "file#<named>"
 *
 * @param filepath file path to the module
 * @param exports '' | '*' | '<named>'
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getClientReferenceModuleKey: null,
    isClientReference: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getClientReferenceModuleKey: function() {
        return getClientReferenceModuleKey;
    },
    isClientReference: function() {
        return isClientReference;
    }
});
function getClientReferenceModuleKey(filepath, exportName) {
    return exportName === "*" ? filepath : filepath + "#" + exportName;
}
function isClientReference(reference) {
    return (reference == null ? void 0 : reference.$$typeof) === Symbol.for("react.client.reference");
}

//# sourceMappingURL=client-reference.js.map