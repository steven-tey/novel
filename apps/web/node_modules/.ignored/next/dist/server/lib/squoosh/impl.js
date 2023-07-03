"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    decodeBuffer: null,
    rotate: null,
    resize: null,
    encodeJpeg: null,
    encodeWebp: null,
    encodeAvif: null,
    encodePng: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    decodeBuffer: function() {
        return decodeBuffer;
    },
    rotate: function() {
        return rotate;
    },
    resize: function() {
        return resize;
    },
    encodeJpeg: function() {
        return encodeJpeg;
    },
    encodeWebp: function() {
        return encodeWebp;
    },
    encodeAvif: function() {
        return encodeAvif;
    },
    encodePng: function() {
        return encodePng;
    }
});
const _semver = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/semver"));
const _codecs = require("./codecs");
const _image_data = /*#__PURE__*/ _interop_require_default(require("./image_data"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Fixed in Node.js 16.5.0 and newer.
// See https://github.com/nodejs/node/pull/39337
// Eventually, remove this delay when engines is updated.
// See https://github.com/vercel/next.js/blob/1bcc923439f495a1717421e06af7e64c6003072c/packages/next/package.json#L249-L251
const FIXED_VERSION = "16.5.0";
const DELAY_MS = 1000;
let _promise;
function delayOnce(ms) {
    if (!_promise) {
        _promise = new Promise((resolve)=>{
            setTimeout(resolve, ms);
        });
    }
    return _promise;
}
function maybeDelay() {
    const isAppleM1 = process.arch === "arm64" && process.platform === "darwin";
    if (isAppleM1 && _semver.default.lt(process.version, FIXED_VERSION)) {
        return delayOnce(DELAY_MS);
    }
    return Promise.resolve();
}
async function decodeBuffer(_buffer) {
    var _Object_entries_find;
    const buffer = Buffer.from(_buffer);
    const firstChunk = buffer.slice(0, 16);
    const firstChunkString = Array.from(firstChunk).map((v)=>String.fromCodePoint(v)).join("");
    const key = (_Object_entries_find = Object.entries(_codecs.codecs).find(([, { detectors  }])=>detectors.some((detector)=>detector.exec(firstChunkString)))) == null ? void 0 : _Object_entries_find[0];
    if (!key) {
        throw Error(`Buffer has an unsupported format`);
    }
    const encoder = _codecs.codecs[key];
    const mod = await encoder.dec();
    const rgba = mod.decode(new Uint8Array(buffer));
    return rgba;
}
async function rotate(image, numRotations) {
    image = _image_data.default.from(image);
    const m = await _codecs.preprocessors["rotate"].instantiate();
    return await m(image.data, image.width, image.height, {
        numRotations
    });
}
async function resize({ image , width , height  }) {
    image = _image_data.default.from(image);
    const p = _codecs.preprocessors["resize"];
    const m = await p.instantiate();
    await maybeDelay();
    return await m(image.data, image.width, image.height, {
        ...p.defaultOptions,
        width,
        height
    });
}
async function encodeJpeg(image, { quality  }) {
    image = _image_data.default.from(image);
    const e = _codecs.codecs["mozjpeg"];
    const m = await e.enc();
    await maybeDelay();
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions,
        quality
    });
    return Buffer.from(r);
}
async function encodeWebp(image, { quality  }) {
    image = _image_data.default.from(image);
    const e = _codecs.codecs["webp"];
    const m = await e.enc();
    await maybeDelay();
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions,
        quality
    });
    return Buffer.from(r);
}
async function encodeAvif(image, { quality  }) {
    image = _image_data.default.from(image);
    const e = _codecs.codecs["avif"];
    const m = await e.enc();
    await maybeDelay();
    const val = e.autoOptimize.min || 62;
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions,
        // Think of cqLevel as the "amount" of quantization (0 to 62),
        // so a lower value yields higher quality (0 to 100).
        cqLevel: Math.round(val - quality / 100 * val)
    });
    return Buffer.from(r);
}
async function encodePng(image) {
    image = _image_data.default.from(image);
    const e = _codecs.codecs["oxipng"];
    const m = await e.enc();
    await maybeDelay();
    const r = await m.encode(image.data, image.width, image.height, {
        ...e.defaultEncoderOptions
    });
    return Buffer.from(r);
}

//# sourceMappingURL=impl.js.map