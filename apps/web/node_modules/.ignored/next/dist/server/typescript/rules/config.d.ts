import type tsModule from 'typescript/lib/tsserverlibrary';
declare const config: {
    addCompletionsAtPosition(fileName: string, position: number, prior: tsModule.WithMetadata<tsModule.CompletionInfo>): void;
    getQuickInfoAtPosition(fileName: string, position: number): tsModule.QuickInfo | undefined;
    getCompletionEntryDetails(entryName: string, data: tsModule.CompletionEntryData): {
        name: string;
        kind: tsModule.ScriptElementKind;
        kindModifiers: tsModule.ScriptElementKindModifier;
        displayParts: never[];
        documentation: {
            kind: string;
            text: string;
        }[];
    } | undefined;
    getSemanticDiagnosticsForExportVariableStatement(source: tsModule.SourceFile, node: tsModule.VariableStatement): tsModule.Diagnostic[];
};
export default config;
