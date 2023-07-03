import React, { use } from "react";
import { useFlightResponse } from "./use-flight-response";
/**
 * Create a component that renders the Flight stream.
 * This is only used for renderToHTML, the Flight response does not need additional wrappers.
 */ export function createServerComponentRenderer(ComponentToRender, ComponentMod, { transformStream , clientReferenceManifest , serverContexts , rscChunks  }, serverComponentsErrorHandler, nonce) {
    // We need to expose the bundled `require` API globally for
    // react-server-dom-webpack. This is a hack until we find a better way.
    if (ComponentMod.__next_app__) {
        // @ts-ignore
        globalThis.__next_require__ = ComponentMod.__next_app__.require;
        // @ts-ignore
        globalThis.__next_chunk_load__ = ComponentMod.__next_app__.loadChunk;
    }
    let RSCStream;
    const createRSCStream = (props)=>{
        if (!RSCStream) {
            RSCStream = ComponentMod.renderToReadableStream(/*#__PURE__*/ React.createElement(ComponentToRender, props), clientReferenceManifest.clientModules, {
                context: serverContexts,
                onError: serverComponentsErrorHandler
            });
        }
        return RSCStream;
    };
    const flightResponseRef = {
        current: null
    };
    const writable = transformStream.writable;
    return function ServerComponentWrapper(props) {
        const reqStream = createRSCStream(props);
        const response = useFlightResponse(writable, reqStream, clientReferenceManifest, rscChunks, flightResponseRef, nonce);
        return use(response);
    };
}

//# sourceMappingURL=create-server-components-renderer.js.map