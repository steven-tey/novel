import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Selection } from '@tiptap/pm/state';
import { FocusPosition } from '../types';
export declare function resolveFocusPosition(doc: ProseMirrorNode, position?: FocusPosition): Selection | null;
