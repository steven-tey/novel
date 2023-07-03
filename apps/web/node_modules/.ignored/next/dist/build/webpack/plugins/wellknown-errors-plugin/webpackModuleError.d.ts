import type { webpack } from 'next/dist/compiled/webpack/webpack';
import { SimpleWebpackError } from './simpleWebpackError';
export declare function getModuleBuildError(compiler: webpack.Compiler, compilation: webpack.Compilation, input: any): Promise<SimpleWebpackError | false>;
