/**
 * filepath   export      module key
 * "file"     '*'         "file"
 * "file"     ''          "file#"
 * "file"     '<named>'   "file#<named>"
 *
 * @param filepath file path to the module
 * @param exports '' | '*' | '<named>'
 */
export declare function getClientReferenceModuleKey(filepath: string, exportName: string): string;
export declare function isClientReference(reference: any): boolean;
