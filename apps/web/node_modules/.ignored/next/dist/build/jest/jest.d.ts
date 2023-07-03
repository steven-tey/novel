import type { Config } from '@jest/types';
export default function nextJest(options?: {
    dir?: string;
}): (customJestConfig?: Config.InitialProjectOptions | (() => Promise<Config.InitialProjectOptions>)) => () => Promise<Config.InitialProjectOptions>;
