import { NodeType } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
export declare function isNodeActive(state: EditorState, typeOrName: NodeType | string | null, attributes?: Record<string, any>): boolean;
