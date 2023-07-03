import { MaybeReturnType } from '../types';
/**
 * Optionally calls `value` as a function.
 * Otherwise it is returned directly.
 * @param value Function or any value.
 * @param context Optional context to bind to function.
 * @param props Optional props to pass to function.
 */
export declare function callOrReturn<T>(value: T, context?: any, ...props: any[]): MaybeReturnType<T>;
