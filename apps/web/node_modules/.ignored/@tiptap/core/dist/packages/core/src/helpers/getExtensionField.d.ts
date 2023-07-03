import { AnyExtension, MaybeThisParameterType, RemoveThis } from '../types';
export declare function getExtensionField<T = any>(extension: AnyExtension, field: string, context?: Omit<MaybeThisParameterType<T>, 'parent'>): RemoveThis<T>;
