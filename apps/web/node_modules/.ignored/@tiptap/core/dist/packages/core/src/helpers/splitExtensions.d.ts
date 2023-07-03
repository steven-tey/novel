import { Extension } from '../Extension';
import { Mark } from '../Mark';
import { Node } from '../Node';
import { Extensions } from '../types';
export declare function splitExtensions(extensions: Extensions): {
    baseExtensions: Extension<any, any>[];
    nodeExtensions: Node<any, any>[];
    markExtensions: Mark<any, any>[];
};
