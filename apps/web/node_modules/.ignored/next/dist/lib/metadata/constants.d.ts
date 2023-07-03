import type { Viewport } from './types/extra-types';
import type { Icons } from './types/metadata-types';
export declare const ViewPortKeys: {
    [k in keyof Viewport]: string;
};
export declare const IconKeys: (keyof Icons)[];
