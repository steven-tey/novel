import { Node as ProseMirrorNode, ParseOptions, Schema } from '@tiptap/pm/model';
import { Content } from '../types';
export declare function createDocument(content: Content, schema: Schema, parseOptions?: ParseOptions): ProseMirrorNode;
