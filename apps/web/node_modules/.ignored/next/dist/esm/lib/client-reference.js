/**
 * filepath   export      module key
 * "file"     '*'         "file"
 * "file"     ''          "file#"
 * "file"     '<named>'   "file#<named>"
 *
 * @param filepath file path to the module
 * @param exports '' | '*' | '<named>'
 */ export function getClientReferenceModuleKey(filepath, exportName) {
    return exportName === "*" ? filepath : filepath + "#" + exportName;
}
export function isClientReference(reference) {
    return (reference == null ? void 0 : reference.$$typeof) === Symbol.for("react.client.reference");
}

//# sourceMappingURL=client-reference.js.map