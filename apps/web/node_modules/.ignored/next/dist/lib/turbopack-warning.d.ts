import { NextConfig } from '../server/config-shared';
export declare function validateTurboNextConfig({ dir, isCustomTurbopack, isDev, }: {
    allowRetry?: boolean;
    isCustomTurbopack?: boolean;
    dir: string;
    port: number;
    hostname?: string;
    isDev?: boolean;
}): Promise<NextConfig>;
