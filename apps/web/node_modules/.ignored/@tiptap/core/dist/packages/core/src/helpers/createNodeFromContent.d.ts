import { Fragment, Node as ProseMirrorNode, ParseOptions, Schema } from '@tiptap/pm/model';
import { Content } from '../types';
export declare type CreateNodeFromContentOptions = {
    slice?: boolean;
    parseOptions?: ParseOptions;
};
export declare function createNodeFromContent(content: Content, schema: Schema, options?: CreateNodeFromContentOptions): ProseMirrorNode | Fragment;
