/**
 * Removes duplicated values within an array.
 * Supports numbers, strings and objects.
 */
export declare function removeDuplicates<T>(array: T[], by?: {
    (value: any, replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): string;
    (value: any, replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
}): T[];
