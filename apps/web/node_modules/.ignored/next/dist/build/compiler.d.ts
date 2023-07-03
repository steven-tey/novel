import { webpack } from 'next/dist/compiled/webpack/webpack';
import { Span } from '../trace';
export type CompilerResult = {
    errors: webpack.StatsError[];
    warnings: webpack.StatsError[];
    stats: webpack.Stats | undefined;
};
export declare function runCompiler(config: webpack.Configuration, { runWebpackSpan, inputFileSystem, }: {
    runWebpackSpan: Span;
    inputFileSystem?: any;
}): Promise<[result: CompilerResult, inputFileSystem?: any]>;
