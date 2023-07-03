import { Span } from '../../../trace';
import { webpack } from 'next/dist/compiled/webpack/webpack';
import { NextConfigComplete } from '../../../server/config-shared';
export interface TurbotraceAction {
    action: 'print' | 'annotate';
    input: string[];
    contextDirectory: string;
    processCwd: string;
    logLevel?: NonNullable<NextConfigComplete['experimental']['turbotrace']>['logLevel'];
    showAll?: boolean;
    memoryLimit?: number;
}
export interface TurbotraceContext {
    entriesTrace?: {
        action: TurbotraceAction;
        appDir: string;
        outputPath: string;
        depModArray: string[];
        entryNameMap: Map<string, string>;
    };
    chunksTrace?: {
        action: TurbotraceAction;
        outputPath: string;
    };
}
export declare class TraceEntryPointsPlugin implements webpack.WebpackPluginInstance {
    turbotraceContext: TurbotraceContext;
    private rootDir;
    private appDir;
    private pagesDir;
    private appDirEnabled?;
    private tracingRoot;
    private entryTraces;
    private traceIgnores;
    private esmExternals?;
    private turbotrace?;
    private chunksToTrace;
    constructor({ rootDir, appDir, pagesDir, appDirEnabled, traceIgnores, esmExternals, outputFileTracingRoot, turbotrace, }: {
        rootDir: string;
        appDir: string | undefined;
        pagesDir: string | undefined;
        appDirEnabled?: boolean;
        traceIgnores?: string[];
        outputFileTracingRoot?: string;
        esmExternals?: NextConfigComplete['experimental']['esmExternals'];
        turbotrace?: NextConfigComplete['experimental']['turbotrace'];
    });
    createTraceAssets(compilation: any, assets: any, span: Span, readlink: any, stat: any): Promise<void>;
    tapfinishModules(compilation: webpack.Compilation, traceEntrypointsPluginSpan: Span, doResolve: (request: string, parent: string, job: import('@vercel/nft/out/node-file-trace').Job, isEsmRequested: boolean) => Promise<string>, readlink: any, stat: any): void;
    apply(compiler: webpack.Compiler): void;
}
