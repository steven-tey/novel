"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    streamToBufferedResult: null,
    readableStreamTee: null,
    chainStreams: null,
    streamFromArray: null,
    streamToString: null,
    createBufferedTransformStream: null,
    createInsertedHTMLStream: null,
    renderToInitialStream: null,
    createDeferredSuffixStream: null,
    createInlineDataStream: null,
    createSuffixStream: null,
    createRootLayoutValidatorStream: null,
    continueFromInitialStream: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    streamToBufferedResult: function() {
        return streamToBufferedResult;
    },
    readableStreamTee: function() {
        return readableStreamTee;
    },
    chainStreams: function() {
        return chainStreams;
    },
    streamFromArray: function() {
        return streamFromArray;
    },
    streamToString: function() {
        return streamToString;
    },
    createBufferedTransformStream: function() {
        return createBufferedTransformStream;
    },
    createInsertedHTMLStream: function() {
        return createInsertedHTMLStream;
    },
    renderToInitialStream: function() {
        return renderToInitialStream;
    },
    createDeferredSuffixStream: function() {
        return createDeferredSuffixStream;
    },
    createInlineDataStream: function() {
        return createInlineDataStream;
    },
    createSuffixStream: function() {
        return createSuffixStream;
    },
    createRootLayoutValidatorStream: function() {
        return createRootLayoutValidatorStream;
    },
    continueFromInitialStream: function() {
        return continueFromInitialStream;
    }
});
const _nonnullable = require("../../lib/non-nullable");
const _tracer = require("../lib/trace/tracer");
const _constants = require("../lib/trace/constants");
const _encodedecode = require("./encode-decode");
const queueTask = process.env.NEXT_RUNTIME === "edge" ? globalThis.setTimeout : setImmediate;
const streamToBufferedResult = async (renderResult)=>{
    const renderChunks = [];
    const textDecoder = new TextDecoder();
    const writable = {
        write (chunk) {
            renderChunks.push((0, _encodedecode.decodeText)(chunk, textDecoder));
        },
        end () {},
        destroy () {}
    };
    await renderResult.pipe(writable);
    return renderChunks.join("");
};
function readableStreamTee(readable) {
    const transformStream = new TransformStream();
    const transformStream2 = new TransformStream();
    const writer = transformStream.writable.getWriter();
    const writer2 = transformStream2.writable.getWriter();
    const reader = readable.getReader();
    function read() {
        reader.read().then(({ done , value  })=>{
            if (done) {
                writer.close();
                writer2.close();
                return;
            }
            writer.write(value);
            writer2.write(value);
            read();
        });
    }
    read();
    return [
        transformStream.readable,
        transformStream2.readable
    ];
}
function chainStreams(streams) {
    const { readable , writable  } = new TransformStream();
    let promise = Promise.resolve();
    for(let i = 0; i < streams.length; ++i){
        promise = promise.then(()=>streams[i].pipeTo(writable, {
                preventClose: i + 1 < streams.length
            }));
    }
    return readable;
}
function streamFromArray(strings) {
    // Note: we use a TransformStream here instead of instantiating a ReadableStream
    // because the built-in ReadableStream polyfill runs strings through TextEncoder.
    const { readable , writable  } = new TransformStream();
    const writer = writable.getWriter();
    strings.forEach((str)=>writer.write((0, _encodedecode.encodeText)(str)));
    writer.close();
    return readable;
}
async function streamToString(stream) {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let bufferedString = "";
    while(true){
        const { done , value  } = await reader.read();
        if (done) {
            return bufferedString;
        }
        bufferedString += (0, _encodedecode.decodeText)(value, textDecoder);
    }
}
function createBufferedTransformStream(transform = (v)=>v) {
    let bufferedString = "";
    let pendingFlush = null;
    const flushBuffer = (controller)=>{
        if (!pendingFlush) {
            pendingFlush = new Promise((resolve)=>{
                setTimeout(async ()=>{
                    const buffered = await transform(bufferedString);
                    controller.enqueue((0, _encodedecode.encodeText)(buffered));
                    bufferedString = "";
                    pendingFlush = null;
                    resolve();
                }, 0);
            });
        }
        return pendingFlush;
    };
    const textDecoder = new TextDecoder();
    return new TransformStream({
        transform (chunk, controller) {
            bufferedString += (0, _encodedecode.decodeText)(chunk, textDecoder);
            flushBuffer(controller);
        },
        flush () {
            if (pendingFlush) {
                return pendingFlush;
            }
        }
    });
}
function createInsertedHTMLStream(getServerInsertedHTML) {
    return new TransformStream({
        async transform (chunk, controller) {
            const insertedHTMLChunk = (0, _encodedecode.encodeText)(await getServerInsertedHTML());
            controller.enqueue(insertedHTMLChunk);
            controller.enqueue(chunk);
        }
    });
}
function renderToInitialStream({ ReactDOMServer , element , streamOptions  }) {
    return (0, _tracer.getTracer)().trace(_constants.AppRenderSpan.renderToReadableStream, async ()=>ReactDOMServer.renderToReadableStream(element, streamOptions));
}
function createHeadInsertionTransformStream(insert) {
    let inserted = false;
    let freezing = false;
    const textDecoder = new TextDecoder();
    return new TransformStream({
        async transform (chunk, controller) {
            // While react is flushing chunks, we don't apply insertions
            if (freezing) {
                controller.enqueue(chunk);
                return;
            }
            const insertion = await insert();
            if (inserted) {
                controller.enqueue((0, _encodedecode.encodeText)(insertion));
                controller.enqueue(chunk);
                freezing = true;
            } else {
                const content = (0, _encodedecode.decodeText)(chunk, textDecoder);
                const index = content.indexOf("</head>");
                if (index !== -1) {
                    const insertedHeadContent = content.slice(0, index) + insertion + content.slice(index);
                    controller.enqueue((0, _encodedecode.encodeText)(insertedHeadContent));
                    freezing = true;
                    inserted = true;
                }
            }
            if (!inserted) {
                controller.enqueue(chunk);
            } else {
                queueTask(()=>{
                    freezing = false;
                });
            }
        },
        async flush (controller) {
            // Check before closing if there's anything remaining to insert.
            const insertion = await insert();
            if (insertion) {
                controller.enqueue((0, _encodedecode.encodeText)(insertion));
            }
        }
    });
}
function createDeferredSuffixStream(suffix) {
    let suffixFlushed = false;
    let suffixFlushTask = null;
    return new TransformStream({
        transform (chunk, controller) {
            controller.enqueue(chunk);
            if (!suffixFlushed && suffix) {
                suffixFlushed = true;
                suffixFlushTask = new Promise((res)=>{
                    // NOTE: streaming flush
                    // Enqueue suffix part before the major chunks are enqueued so that
                    // suffix won't be flushed too early to interrupt the data stream
                    setTimeout(()=>{
                        controller.enqueue((0, _encodedecode.encodeText)(suffix));
                        res();
                    });
                });
            }
        },
        flush (controller) {
            if (suffixFlushTask) return suffixFlushTask;
            if (!suffixFlushed && suffix) {
                suffixFlushed = true;
                controller.enqueue((0, _encodedecode.encodeText)(suffix));
            }
        }
    });
}
function createInlineDataStream(dataStream) {
    let dataStreamFinished = null;
    return new TransformStream({
        transform (chunk, controller) {
            controller.enqueue(chunk);
            if (!dataStreamFinished) {
                const dataStreamReader = dataStream.getReader();
                // NOTE: streaming flush
                // We are buffering here for the inlined data stream because the
                // "shell" stream might be chunkenized again by the underlying stream
                // implementation, e.g. with a specific high-water mark. To ensure it's
                // the safe timing to pipe the data stream, this extra tick is
                // necessary.
                dataStreamFinished = new Promise((res)=>setTimeout(async ()=>{
                        try {
                            while(true){
                                const { done , value  } = await dataStreamReader.read();
                                if (done) {
                                    return res();
                                }
                                controller.enqueue(value);
                            }
                        } catch (err) {
                            controller.error(err);
                        }
                        res();
                    }, 0));
            }
        },
        flush () {
            if (dataStreamFinished) {
                return dataStreamFinished;
            }
        }
    });
}
function createSuffixStream(suffix) {
    let foundSuffix = false;
    const textDecoder = new TextDecoder();
    // Remove suffix from the stream, and enqueue it back in flush
    return new TransformStream({
        transform (chunk, controller) {
            if (!suffix || foundSuffix) {
                return controller.enqueue(chunk);
            }
            const content = (0, _encodedecode.decodeText)(chunk, textDecoder);
            if (content.endsWith(suffix)) {
                foundSuffix = true;
                const contentWithoutSuffix = content.slice(0, -suffix.length);
                controller.enqueue((0, _encodedecode.encodeText)(contentWithoutSuffix));
            } else {
                controller.enqueue(chunk);
            }
        },
        flush (controller) {
            if (suffix) {
                controller.enqueue((0, _encodedecode.encodeText)(suffix));
            }
        }
    });
}
function createRootLayoutValidatorStream(assetPrefix = "", getTree) {
    let foundHtml = false;
    let foundBody = false;
    const textDecoder = new TextDecoder();
    return new TransformStream({
        async transform (chunk, controller) {
            if (!foundHtml || !foundBody) {
                const content = (0, _encodedecode.decodeText)(chunk, textDecoder);
                if (!foundHtml && content.includes("<html")) {
                    foundHtml = true;
                }
                if (!foundBody && content.includes("<body")) {
                    foundBody = true;
                }
            }
            controller.enqueue(chunk);
        },
        flush (controller) {
            const missingTags = [
                foundHtml ? null : "html",
                foundBody ? null : "body"
            ].filter(_nonnullable.nonNullable);
            if (missingTags.length > 0) {
                controller.enqueue((0, _encodedecode.encodeText)(`<script>self.__next_root_layout_missing_tags_error=${JSON.stringify({
                    missingTags,
                    assetPrefix: assetPrefix ?? "",
                    tree: getTree()
                })}</script>`));
            }
        }
    });
}
async function continueFromInitialStream(renderStream, { suffix , dataStream , generateStaticHTML , getServerInsertedHTML , serverInsertedHTMLToHead , validateRootLayout  }) {
    const closeTag = "</body></html>";
    // Suffix itself might contain close tags at the end, so we need to split it.
    const suffixUnclosed = suffix ? suffix.split(closeTag)[0] : null;
    if (generateStaticHTML) {
        await renderStream.allReady;
    }
    const transforms = [
        // Buffer everything to avoid flushing too frequently
        createBufferedTransformStream(),
        // Insert generated tags to head
        getServerInsertedHTML && !serverInsertedHTMLToHead ? createInsertedHTMLStream(getServerInsertedHTML) : null,
        // Insert suffix content
        suffixUnclosed != null ? createDeferredSuffixStream(suffixUnclosed) : null,
        // Insert the flight data stream
        dataStream ? createInlineDataStream(dataStream) : null,
        // Close tags should always be deferred to the end
        createSuffixStream(closeTag),
        // Special head insertions
        createHeadInsertionTransformStream(async ()=>{
            // TODO-APP: Insert server side html to end of head in app layout rendering, to avoid
            // hydration errors. Remove this once it's ready to be handled by react itself.
            const serverInsertedHTML = getServerInsertedHTML && serverInsertedHTMLToHead ? await getServerInsertedHTML() : "";
            return serverInsertedHTML;
        }),
        validateRootLayout ? createRootLayoutValidatorStream(validateRootLayout.assetPrefix, validateRootLayout.getTree) : null
    ].filter(_nonnullable.nonNullable);
    return transforms.reduce((readable, transform)=>readable.pipeThrough(transform), renderStream);
}

//# sourceMappingURL=node-web-streams-helper.js.map