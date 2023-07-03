import { MarkType } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
export declare function isMarkActive(state: EditorState, typeOrName: MarkType | string | null, attributes?: Record<string, any>): boolean;
