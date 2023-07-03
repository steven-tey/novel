import '../server/require-hook';
import { NextConfigComplete } from '../server/config-shared';
import { Span } from '../trace';
export declare class ExportError extends Error {
    code: string;
}
export interface ExportOptions {
    outdir: string;
    isInvokedFromCli: boolean;
    hasAppDir: boolean;
    silent?: boolean;
    threads?: number;
    debugOutput?: boolean;
    pages?: string[];
    buildExport: boolean;
    statusMessage?: string;
    exportPageWorker?: typeof import('./worker').default;
    exportAppPageWorker?: typeof import('./worker').default;
    endWorker?: () => Promise<void>;
    nextConfig?: NextConfigComplete;
    hasOutdirFromCli?: boolean;
}
export default function exportApp(dir: string, options: ExportOptions, span: Span): Promise<void>;
