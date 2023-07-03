/**
 * This is a TypeScript language service plugin for Next.js app directory,
 * it provides the following features:
 *
 * - Warns about disallowed React APIs in server components.
 * - Warns about disallowed layout and page exports.
 * - Autocompletion for entry configurations.
 * - Hover hint and docs for entry configurations.
 */ import { init, getIsClientEntry, isAppEntryFile, isDefaultFunctionExport, isPositionInsideNode, getSource, isInsideApp } from "./utils";
import { NEXT_TS_ERRORS } from "./constant";
import entryConfig from "./rules/config";
import serverLayer from "./rules/server";
import entryDefault from "./rules/entry";
import clientBoundary from "./rules/client-boundary";
import metadata from "./rules/metadata";
import errorEntry from "./rules/error";
export const createTSPlugin = ({ typescript: ts  })=>{
    function create(info) {
        init({
            ts,
            info
        });
        // Set up decorator object
        const proxy = Object.create(null);
        for (let k of Object.keys(info.languageService)){
            const x = info.languageService[k];
            proxy[k] = (...args)=>x.apply(info.languageService, args);
        }
        // Auto completion
        proxy.getCompletionsAtPosition = (fileName, position, options)=>{
            let prior = info.languageService.getCompletionsAtPosition(fileName, position, options) || {
                isGlobalCompletion: false,
                isMemberCompletion: false,
                isNewIdentifierLocation: false,
                entries: []
            };
            if (!isAppEntryFile(fileName)) return prior;
            // If it's a server entry.
            if (!getIsClientEntry(fileName)) {
                // Remove specified entries from completion list
                prior.entries = serverLayer.filterCompletionsAtPosition(prior.entries);
                // Provide autocompletion for metadata fields
                prior = metadata.filterCompletionsAtPosition(fileName, position, options, prior);
            }
            // Add auto completions for export configs.
            entryConfig.addCompletionsAtPosition(fileName, position, prior);
            const source = getSource(fileName);
            if (!source) return prior;
            ts.forEachChild(source, (node)=>{
                // Auto completion for default export function's props.
                if (isPositionInsideNode(position, node) && isDefaultFunctionExport(node)) {
                    prior.entries.push(...entryDefault.getCompletionsAtPosition(fileName, node, position));
                }
            });
            return prior;
        };
        // Show auto completion details
        proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data)=>{
            const entryCompletionEntryDetails = entryConfig.getCompletionEntryDetails(entryName, data);
            if (entryCompletionEntryDetails) return entryCompletionEntryDetails;
            const metadataCompletionEntryDetails = metadata.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
            if (metadataCompletionEntryDetails) return metadataCompletionEntryDetails;
            return info.languageService.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
        };
        // Quick info
        proxy.getQuickInfoAtPosition = (fileName, position)=>{
            const prior = info.languageService.getQuickInfoAtPosition(fileName, position);
            if (!isAppEntryFile(fileName)) return prior;
            // Remove type suggestions for disallowed APIs in server components.
            if (!getIsClientEntry(fileName)) {
                const definitions = info.languageService.getDefinitionAtPosition(fileName, position);
                if (definitions && serverLayer.hasDisallowedReactAPIDefinition(definitions)) {
                    return;
                }
                const metadataInfo = metadata.getQuickInfoAtPosition(fileName, position);
                if (metadataInfo) return metadataInfo;
            }
            const overriden = entryConfig.getQuickInfoAtPosition(fileName, position);
            if (overriden) return overriden;
            return prior;
        };
        // Show errors for disallowed imports
        proxy.getSemanticDiagnostics = (fileName)=>{
            const prior = info.languageService.getSemanticDiagnostics(fileName);
            const source = getSource(fileName);
            if (!source) return prior;
            let isClientEntry = false;
            const isAppEntry = isAppEntryFile(fileName);
            try {
                isClientEntry = getIsClientEntry(fileName, true);
            } catch (e) {
                prior.push({
                    file: source,
                    category: ts.DiagnosticCategory.Error,
                    code: NEXT_TS_ERRORS.MISPLACED_CLIENT_ENTRY,
                    ...e
                });
                isClientEntry = false;
            }
            if (isInsideApp(fileName)) {
                const errorDiagnostic = errorEntry.getSemanticDiagnostics(source, isClientEntry);
                prior.push(...errorDiagnostic);
            }
            ts.forEachChild(source, (node)=>{
                var _node_modifiers, _node_modifiers1;
                if (ts.isImportDeclaration(node)) {
                    // import ...
                    if (isAppEntry) {
                        if (!isClientEntry) {
                            // Check if it has valid imports in the server layer
                            const diagnostics = serverLayer.getSemanticDiagnosticsForImportDeclaration(source, node);
                            prior.push(...diagnostics);
                        }
                    }
                } else if (ts.isVariableStatement(node) && ((_node_modifiers = node.modifiers) == null ? void 0 : _node_modifiers.some((m)=>m.kind === ts.SyntaxKind.ExportKeyword))) {
                    // export const ...
                    if (isAppEntry) {
                        // Check if it has correct option exports
                        const diagnostics = entryConfig.getSemanticDiagnosticsForExportVariableStatement(source, node);
                        const metadataDiagnostics = isClientEntry ? metadata.getSemanticDiagnosticsForExportVariableStatementInClientEntry(fileName, node) : metadata.getSemanticDiagnosticsForExportVariableStatement(fileName, node);
                        prior.push(...diagnostics, ...metadataDiagnostics);
                    }
                    if (isClientEntry) {
                        prior.push(...clientBoundary.getSemanticDiagnosticsForExportVariableStatement(source, node));
                    }
                } else if (isDefaultFunctionExport(node)) {
                    // export default function ...
                    if (isAppEntry) {
                        const diagnostics = entryDefault.getSemanticDiagnostics(fileName, source, node);
                        prior.push(...diagnostics);
                    }
                    if (isClientEntry) {
                        prior.push(...clientBoundary.getSemanticDiagnosticsForFunctionExport(source, node));
                    }
                } else if (ts.isFunctionDeclaration(node) && ((_node_modifiers1 = node.modifiers) == null ? void 0 : _node_modifiers1.some((m)=>m.kind === ts.SyntaxKind.ExportKeyword))) {
                    // export function ...
                    if (isAppEntry) {
                        const metadataDiagnostics = isClientEntry ? metadata.getSemanticDiagnosticsForExportVariableStatementInClientEntry(fileName, node) : metadata.getSemanticDiagnosticsForExportVariableStatement(fileName, node);
                        prior.push(...metadataDiagnostics);
                    }
                    if (isClientEntry) {
                        prior.push(...clientBoundary.getSemanticDiagnosticsForFunctionExport(source, node));
                    }
                } else if (ts.isExportDeclaration(node)) {
                    // export { ... }
                    if (isAppEntry) {
                        const metadataDiagnostics = isClientEntry ? metadata.getSemanticDiagnosticsForExportDeclarationInClientEntry(fileName, node) : metadata.getSemanticDiagnosticsForExportDeclaration(fileName, node);
                        prior.push(...metadataDiagnostics);
                    }
                }
            });
            return prior;
        };
        // Get definition and link for specific node
        proxy.getDefinitionAndBoundSpan = (fileName, position)=>{
            if (isAppEntryFile(fileName) && !getIsClientEntry(fileName)) {
                const metadataDefinition = metadata.getDefinitionAndBoundSpan(fileName, position);
                if (metadataDefinition) return metadataDefinition;
            }
            return info.languageService.getDefinitionAndBoundSpan(fileName, position);
        };
        return proxy;
    }
    return {
        create
    };
};

//# sourceMappingURL=index.js.map