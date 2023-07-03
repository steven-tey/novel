/**
 * Get external stylesheet link hrefs based on server CSS manifest.
 */ export function getCssInlinedLinkTags(clientReferenceManifest, filePath, injectedCSS, collectNewCSSImports) {
    const filePathWithoutExt = filePath.replace(/\.[^.]+$/, "");
    const chunks = new Set();
    const entryCSSFiles = clientReferenceManifest.entryCSSFiles[filePathWithoutExt];
    if (entryCSSFiles) {
        for (const file of entryCSSFiles){
            if (!injectedCSS.has(file)) {
                if (collectNewCSSImports) {
                    injectedCSS.add(file);
                }
                chunks.add(file);
            }
        }
    }
    return [
        ...chunks
    ];
}

//# sourceMappingURL=get-css-inlined-link-tags.js.map