import { Node as ProseMirrorNode, NodeType } from '@tiptap/pm/model';
import { Editor } from '../Editor';
import { InputRule, InputRuleFinder } from '../InputRule';
import { ExtendedRegExpMatchArray } from '../types';
/**
 * Build an input rule for automatically wrapping a textblock when a
 * given string is typed. When using a regular expresion you’ll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 *
 * `type` is the type of node to wrap in.
 *
 * By default, if there’s a node with the same type above the newly
 * wrapped node, the rule will try to join those
 * two nodes. You can pass a join predicate, which takes a regular
 * expression match and the node before the wrapped node, and can
 * return a boolean to indicate whether a join should happen.
 */
export declare function wrappingInputRule(config: {
    find: InputRuleFinder;
    type: NodeType;
    keepMarks?: boolean;
    keepAttributes?: boolean;
    editor?: Editor;
    getAttributes?: Record<string, any> | ((match: ExtendedRegExpMatchArray) => Record<string, any>) | false | null;
    joinPredicate?: (match: ExtendedRegExpMatchArray, node: ProseMirrorNode) => boolean;
}): InputRule;
