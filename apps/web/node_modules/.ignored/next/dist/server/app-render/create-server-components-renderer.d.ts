/// <reference types="react" />
import type { RenderOpts } from './types';
import { createErrorHandler } from './create-error-handler';
/**
 * Create a component that renders the Flight stream.
 * This is only used for renderToHTML, the Flight response does not need additional wrappers.
 */
export declare function createServerComponentRenderer<Props>(ComponentToRender: (props: Props) => any, ComponentMod: {
    renderToReadableStream: any;
    __next_app__?: {
        require: any;
        loadChunk: any;
    };
}, { transformStream, clientReferenceManifest, serverContexts, rscChunks, }: {
    transformStream: TransformStream<Uint8Array, Uint8Array>;
    clientReferenceManifest: NonNullable<RenderOpts['clientReferenceManifest']>;
    serverContexts: Array<[
        ServerContextName: string,
        JSONValue: Object | number | string
    ]>;
    rscChunks: Uint8Array[];
}, serverComponentsErrorHandler: ReturnType<typeof createErrorHandler>, nonce?: string): (props: Props) => JSX.Element;
