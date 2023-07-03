export function encodeText(input) {
    return new TextEncoder().encode(input);
}
export function decodeText(input, textDecoder) {
    return textDecoder.decode(input, {
        stream: true
    });
}

//# sourceMappingURL=encode-decode.js.map