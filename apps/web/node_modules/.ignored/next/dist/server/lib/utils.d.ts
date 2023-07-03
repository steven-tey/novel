import type arg from 'next/dist/compiled/arg/index.js';
export declare function printAndExit(message: string, code?: number): void;
export declare const getDebugPort: () => number;
export declare const genRouterWorkerExecArgv: (isNodeDebugging: boolean | 'brk') => Promise<string[]>;
export declare function getNodeOptionsWithoutInspect(): string;
export declare function getPort(args: arg.Result<arg.Spec>): number;
