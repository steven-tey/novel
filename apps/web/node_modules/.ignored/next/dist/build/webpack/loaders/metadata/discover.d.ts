import type { CollectingMetadata } from './types';
import { MetadataResolver } from '../next-app-loader';
export declare function createStaticMetadataFromRoute(resolvedDir: string, { segment, metadataResolver, isRootLayoutOrRootPage, pageExtensions, basePath, }: {
    segment: string;
    metadataResolver: MetadataResolver;
    isRootLayoutOrRootPage: boolean;
    pageExtensions: string[];
    basePath: string;
}): Promise<CollectingMetadata | null>;
export declare function createMetadataExportsCode(metadata: Awaited<ReturnType<typeof createStaticMetadataFromRoute>>): string;
