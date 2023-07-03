import { Extensions, JSONContent, TextSerializer } from '../types';
export declare function generateText(doc: JSONContent, extensions: Extensions, options?: {
    blockSeparator?: string;
    textSerializers?: Record<string, TextSerializer>;
}): string;
