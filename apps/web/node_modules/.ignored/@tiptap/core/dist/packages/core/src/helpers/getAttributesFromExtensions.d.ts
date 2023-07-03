import { ExtensionAttribute, Extensions } from '../types';
/**
 * Get a list of all extension attributes defined in `addAttribute` and `addGlobalAttribute`.
 * @param extensions List of extensions
 */
export declare function getAttributesFromExtensions(extensions: Extensions): ExtensionAttribute[];
