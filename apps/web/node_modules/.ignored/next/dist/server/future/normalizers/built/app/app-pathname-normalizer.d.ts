import { Normalizers } from '../../normalizers';
import { Normalizer } from '../../normalizer';
export declare class AppPathnameNormalizer extends Normalizers {
    constructor();
    normalize(page: string): string;
}
export declare class DevAppPathnameNormalizer extends Normalizers {
    constructor(pageNormalizer: Normalizer);
    normalize(filename: string): string;
}
