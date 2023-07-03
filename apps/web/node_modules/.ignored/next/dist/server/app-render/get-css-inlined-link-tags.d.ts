import { ClientReferenceManifest } from '../../build/webpack/plugins/flight-manifest-plugin';
/**
 * Get external stylesheet link hrefs based on server CSS manifest.
 */
export declare function getCssInlinedLinkTags(clientReferenceManifest: ClientReferenceManifest, filePath: string, injectedCSS: Set<string>, collectNewCSSImports?: boolean): string[];
