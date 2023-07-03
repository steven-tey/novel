import { ParseRule } from '@tiptap/pm/model';
import { ExtensionAttribute } from '../types';
/**
 * This function merges extension attributes into parserule attributes (`attrs` or `getAttrs`).
 * Cancels when `getAttrs` returned `false`.
 * @param parseRule ProseMirror ParseRule
 * @param extensionAttributes List of attributes to inject
 */
export declare function injectExtensionAttributesToParseRule(parseRule: ParseRule, extensionAttributes: ExtensionAttribute[]): ParseRule;
