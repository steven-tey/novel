import type { Config } from '@jest/types';
import type { NextConfig, ExperimentalConfig } from '../../server/config-shared';
type TransformerConfig = Config.TransformerConfig[1];
export interface JestTransformerConfig extends TransformerConfig {
    jsConfig: any;
    resolvedBaseUrl?: string;
    pagesDir?: string;
    hasServerComponents?: boolean;
    isEsmProject: boolean;
    modularizeImports?: NextConfig['modularizeImports'];
    swcPlugins: ExperimentalConfig['swcPlugins'];
    compilerOptions: NextConfig['compiler'];
}
export {};
