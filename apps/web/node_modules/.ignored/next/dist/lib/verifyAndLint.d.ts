import { Telemetry } from '../telemetry/storage';
export declare function verifyAndLint(dir: string, cacheLocation: string, configLintDirs: string[] | undefined, enableWorkerThreads: boolean | undefined, telemetry: Telemetry, hasAppDir: boolean): Promise<void>;
