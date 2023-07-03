"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getHash: null,
    detectContentType: null,
    ImageOptimizerCache: null,
    ImageError: null,
    getMaxAge: null,
    optimizeImage: null,
    imageOptimizer: null,
    sendResponse: null,
    getImageSize: null,
    Deferred: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getHash: function() {
        return getHash;
    },
    detectContentType: function() {
        return detectContentType;
    },
    ImageOptimizerCache: function() {
        return ImageOptimizerCache;
    },
    ImageError: function() {
        return ImageError;
    },
    getMaxAge: function() {
        return getMaxAge;
    },
    optimizeImage: function() {
        return optimizeImage;
    },
    imageOptimizer: function() {
        return imageOptimizer;
    },
    sendResponse: function() {
        return sendResponse;
    },
    getImageSize: function() {
        return getImageSize;
    },
    Deferred: function() {
        return Deferred;
    }
});
const _crypto = require("crypto");
const _fs = require("fs");
const _accept = require("next/dist/compiled/@hapi/accept");
const _chalk = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/chalk"));
const _contentdisposition = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/content-disposition"));
const _getorientation = require("next/dist/compiled/get-orientation");
const _imagesize = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/image-size"));
const _isanimated = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/is-animated"));
const _path = require("path");
const _url = /*#__PURE__*/ _interop_require_default(require("url"));
const _imageblursvg = require("../shared/lib/image-blur-svg");
const _matchremotepattern = require("../shared/lib/match-remote-pattern");
const _mockrequest = require("./lib/mock-request");
const _sendpayload = require("./send-payload");
const _servestatic = require("./serve-static");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const AVIF = "image/avif";
const WEBP = "image/webp";
const PNG = "image/png";
const JPEG = "image/jpeg";
const GIF = "image/gif";
const SVG = "image/svg+xml";
const ICO = "image/x-icon";
const CACHE_VERSION = 3;
const ANIMATABLE_TYPES = [
    WEBP,
    PNG,
    GIF
];
const VECTOR_TYPES = [
    SVG
];
const BLUR_IMG_SIZE = 8 // should match `next-image-loader`
;
const BLUR_QUALITY = 70 // should match `next-image-loader`
;
let sharp;
try {
    sharp = require(process.env.NEXT_SHARP_PATH || "sharp");
} catch (e) {
// Sharp not present on the server, Squoosh fallback will be used
}
let showSharpMissingWarning = process.env.NODE_ENV === "production";
function getSupportedMimeType(options, accept = "") {
    const mimeType = (0, _accept.mediaType)(accept, options);
    return accept.includes(mimeType) ? mimeType : "";
}
function getHash(items) {
    const hash = (0, _crypto.createHash)("sha256");
    for (let item of items){
        if (typeof item === "number") hash.update(String(item));
        else {
            hash.update(item);
        }
    }
    // See https://en.wikipedia.org/wiki/Base64#Filenames
    return hash.digest("base64").replace(/\//g, "-");
}
async function writeToCacheDir(dir, extension, maxAge, expireAt, buffer, etag) {
    const filename = (0, _path.join)(dir, `${maxAge}.${expireAt}.${etag}.${extension}`);
    // Added in: v14.14.0 https://nodejs.org/api/fs.html#fspromisesrmpath-options
    // attempt cleaning up existing stale cache
    if (_fs.promises.rm) {
        await _fs.promises.rm(dir, {
            force: true,
            recursive: true
        }).catch(()=>{});
    } else {
        await _fs.promises.rmdir(dir, {
            recursive: true
        }).catch(()=>{});
    }
    await _fs.promises.mkdir(dir, {
        recursive: true
    });
    await _fs.promises.writeFile(filename, buffer);
}
function detectContentType(buffer) {
    if ([
        0xff,
        0xd8,
        0xff
    ].every((b, i)=>buffer[i] === b)) {
        return JPEG;
    }
    if ([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a
    ].every((b, i)=>buffer[i] === b)) {
        return PNG;
    }
    if ([
        0x47,
        0x49,
        0x46,
        0x38
    ].every((b, i)=>buffer[i] === b)) {
        return GIF;
    }
    if ([
        0x52,
        0x49,
        0x46,
        0x46,
        0,
        0,
        0,
        0,
        0x57,
        0x45,
        0x42,
        0x50
    ].every((b, i)=>!b || buffer[i] === b)) {
        return WEBP;
    }
    if ([
        0x3c,
        0x3f,
        0x78,
        0x6d,
        0x6c
    ].every((b, i)=>buffer[i] === b)) {
        return SVG;
    }
    if ([
        0,
        0,
        0,
        0,
        0x66,
        0x74,
        0x79,
        0x70,
        0x61,
        0x76,
        0x69,
        0x66
    ].every((b, i)=>!b || buffer[i] === b)) {
        return AVIF;
    }
    if ([
        0x00,
        0x00,
        0x01,
        0x00
    ].every((b, i)=>buffer[i] === b)) {
        return ICO;
    }
    return null;
}
class ImageOptimizerCache {
    static validateParams(req, query, nextConfig, isDev) {
        var _nextConfig_images;
        const imageData = nextConfig.images;
        const { deviceSizes =[] , imageSizes =[] , domains =[] , minimumCacheTTL =60 , formats =[
            "image/webp"
        ]  } = imageData;
        const remotePatterns = ((_nextConfig_images = nextConfig.images) == null ? void 0 : _nextConfig_images.remotePatterns) || [];
        const { url , w , q  } = query;
        let href;
        if (!url) {
            return {
                errorMessage: '"url" parameter is required'
            };
        } else if (Array.isArray(url)) {
            return {
                errorMessage: '"url" parameter cannot be an array'
            };
        }
        let isAbsolute;
        if (url.startsWith("/")) {
            href = url;
            isAbsolute = false;
        } else {
            let hrefParsed;
            try {
                hrefParsed = new URL(url);
                href = hrefParsed.toString();
                isAbsolute = true;
            } catch (_error) {
                return {
                    errorMessage: '"url" parameter is invalid'
                };
            }
            if (![
                "http:",
                "https:"
            ].includes(hrefParsed.protocol)) {
                return {
                    errorMessage: '"url" parameter is invalid'
                };
            }
            if (!(0, _matchremotepattern.hasMatch)(domains, remotePatterns, hrefParsed)) {
                return {
                    errorMessage: '"url" parameter is not allowed'
                };
            }
        }
        if (!w) {
            return {
                errorMessage: '"w" parameter (width) is required'
            };
        } else if (Array.isArray(w)) {
            return {
                errorMessage: '"w" parameter (width) cannot be an array'
            };
        }
        if (!q) {
            return {
                errorMessage: '"q" parameter (quality) is required'
            };
        } else if (Array.isArray(q)) {
            return {
                errorMessage: '"q" parameter (quality) cannot be an array'
            };
        }
        const width = parseInt(w, 10);
        if (width <= 0 || isNaN(width)) {
            return {
                errorMessage: '"w" parameter (width) must be a number greater than 0'
            };
        }
        const sizes = [
            ...deviceSizes || [],
            ...imageSizes || []
        ];
        if (isDev) {
            sizes.push(BLUR_IMG_SIZE);
        }
        const isValidSize = sizes.includes(width) || isDev && width <= BLUR_IMG_SIZE;
        if (!isValidSize) {
            return {
                errorMessage: `"w" parameter (width) of ${width} is not allowed`
            };
        }
        const quality = parseInt(q);
        if (isNaN(quality) || quality < 1 || quality > 100) {
            return {
                errorMessage: '"q" parameter (quality) must be a number between 1 and 100'
            };
        }
        const mimeType = getSupportedMimeType(formats || [], req.headers["accept"]);
        const isStatic = url.startsWith(`${nextConfig.basePath || ""}/_next/static/media`);
        return {
            href,
            sizes,
            isAbsolute,
            isStatic,
            width,
            quality,
            mimeType,
            minimumCacheTTL
        };
    }
    static getCacheKey({ href , width , quality , mimeType  }) {
        return getHash([
            CACHE_VERSION,
            href,
            width,
            quality,
            mimeType
        ]);
    }
    constructor({ distDir , nextConfig  }){
        this.cacheDir = (0, _path.join)(distDir, "cache", "images");
        this.nextConfig = nextConfig;
    }
    async get(cacheKey) {
        try {
            const cacheDir = (0, _path.join)(this.cacheDir, cacheKey);
            const files = await _fs.promises.readdir(cacheDir);
            const now = Date.now();
            for (const file of files){
                const [maxAgeSt, expireAtSt, etag, extension] = file.split(".");
                const buffer = await _fs.promises.readFile((0, _path.join)(cacheDir, file));
                const expireAt = Number(expireAtSt);
                const maxAge = Number(maxAgeSt);
                return {
                    value: {
                        kind: "IMAGE",
                        etag,
                        buffer,
                        extension
                    },
                    revalidateAfter: Math.max(maxAge, this.nextConfig.images.minimumCacheTTL) * 1000 + Date.now(),
                    curRevalidate: maxAge,
                    isStale: now > expireAt
                };
            }
        } catch (_) {
        // failed to read from cache dir, treat as cache miss
        }
        return null;
    }
    async set(cacheKey, value, revalidate) {
        if ((value == null ? void 0 : value.kind) !== "IMAGE") {
            throw new Error("invariant attempted to set non-image to image-cache");
        }
        if (typeof revalidate !== "number") {
            throw new Error("invariant revalidate must be a number for image-cache");
        }
        const expireAt = Math.max(revalidate, this.nextConfig.images.minimumCacheTTL) * 1000 + Date.now();
        try {
            await writeToCacheDir((0, _path.join)(this.cacheDir, cacheKey), value.extension, revalidate, expireAt, value.buffer, value.etag);
        } catch (err) {
            console.error(`Failed to write image to cache ${cacheKey}`, err);
        }
    }
}
class ImageError extends Error {
    constructor(statusCode, message){
        super(message);
        // ensure an error status is used > 400
        if (statusCode >= 400) {
            this.statusCode = statusCode;
        } else {
            this.statusCode = 500;
        }
    }
}
function parseCacheControl(str) {
    const map = new Map();
    if (!str) {
        return map;
    }
    for (let directive of str.split(",")){
        let [key, value] = directive.trim().split("=");
        key = key.toLowerCase();
        if (value) {
            value = value.toLowerCase();
        }
        map.set(key, value);
    }
    return map;
}
function getMaxAge(str) {
    const map = parseCacheControl(str);
    if (map) {
        let age = map.get("s-maxage") || map.get("max-age") || "";
        if (age.startsWith('"') && age.endsWith('"')) {
            age = age.slice(1, -1);
        }
        const n = parseInt(age, 10);
        if (!isNaN(n)) {
            return n;
        }
    }
    return 0;
}
async function optimizeImage({ buffer , contentType , quality , width , height , nextConfigOutput  }) {
    let optimizedBuffer = buffer;
    if (sharp) {
        // Begin sharp transformation logic
        const transformer = sharp(buffer, {
            sequentialRead: true
        });
        transformer.rotate();
        if (height) {
            transformer.resize(width, height);
        } else {
            transformer.resize(width, undefined, {
                withoutEnlargement: true
            });
        }
        if (contentType === AVIF) {
            if (transformer.avif) {
                const avifQuality = quality - 15;
                transformer.avif({
                    quality: Math.max(avifQuality, 0),
                    chromaSubsampling: "4:2:0"
                });
            } else {
                console.warn(_chalk.default.yellow.bold("Warning: ") + `Your installed version of the 'sharp' package does not support AVIF images. Run 'yarn add sharp@latest' to upgrade to the latest version.\n` + "Read more: https://nextjs.org/docs/messages/sharp-version-avif");
                transformer.webp({
                    quality
                });
            }
        } else if (contentType === WEBP) {
            transformer.webp({
                quality
            });
        } else if (contentType === PNG) {
            transformer.png({
                quality
            });
        } else if (contentType === JPEG) {
            transformer.jpeg({
                quality
            });
        }
        optimizedBuffer = await transformer.toBuffer();
    // End sharp transformation logic
    } else {
        if (showSharpMissingWarning && nextConfigOutput === "standalone") {
            console.error(`Error: 'sharp' is required to be installed in standalone mode for the image optimization to function correctly. Read more at: https://nextjs.org/docs/messages/sharp-missing-in-production`);
            throw new ImageError(500, "Internal Server Error");
        }
        // Show sharp warning in production once
        if (showSharpMissingWarning) {
            console.warn(_chalk.default.yellow.bold("Warning: ") + `For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'yarn add sharp', and Next.js will use it automatically for Image Optimization.\n` + "Read more: https://nextjs.org/docs/messages/sharp-missing-in-production");
            showSharpMissingWarning = false;
        }
        // Begin Squoosh transformation logic
        const orientation = await (0, _getorientation.getOrientation)(buffer);
        const operations = [];
        if (orientation === _getorientation.Orientation.RIGHT_TOP) {
            operations.push({
                type: "rotate",
                numRotations: 1
            });
        } else if (orientation === _getorientation.Orientation.BOTTOM_RIGHT) {
            operations.push({
                type: "rotate",
                numRotations: 2
            });
        } else if (orientation === _getorientation.Orientation.LEFT_BOTTOM) {
            operations.push({
                type: "rotate",
                numRotations: 3
            });
        } else {
        // TODO: support more orientations
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const _: never = orientation
        }
        if (height) {
            operations.push({
                type: "resize",
                width,
                height
            });
        } else {
            operations.push({
                type: "resize",
                width
            });
        }
        const { processBuffer  } = require("./lib/squoosh/main");
        if (contentType === AVIF) {
            optimizedBuffer = await processBuffer(buffer, operations, "avif", quality);
        } else if (contentType === WEBP) {
            optimizedBuffer = await processBuffer(buffer, operations, "webp", quality);
        } else if (contentType === PNG) {
            optimizedBuffer = await processBuffer(buffer, operations, "png", quality);
        } else if (contentType === JPEG) {
            optimizedBuffer = await processBuffer(buffer, operations, "jpeg", quality);
        }
    }
    return optimizedBuffer;
}
async function imageOptimizer(_req, _res, paramsResult, nextConfig, isDev, handleRequest) {
    let upstreamBuffer;
    let upstreamType;
    let maxAge;
    const { isAbsolute , href , width , mimeType , quality  } = paramsResult;
    if (isAbsolute) {
        const upstreamRes = await fetch(href);
        if (!upstreamRes.ok) {
            console.error("upstream image response failed for", href, upstreamRes.status);
            throw new ImageError(upstreamRes.status, '"url" parameter is valid but upstream response is invalid');
        }
        upstreamBuffer = Buffer.from(await upstreamRes.arrayBuffer());
        upstreamType = detectContentType(upstreamBuffer) || upstreamRes.headers.get("Content-Type");
        maxAge = getMaxAge(upstreamRes.headers.get("Cache-Control"));
    } else {
        try {
            const mocked = (0, _mockrequest.createRequestResponseMocks)({
                url: href,
                method: _req.method || "GET",
                headers: _req.headers,
                socket: _req.socket
            });
            await handleRequest(mocked.req, mocked.res, _url.default.parse(href, true));
            await mocked.res.hasStreamed;
            if (!mocked.res.statusCode) {
                console.error("image response failed for", href, mocked.res.statusCode);
                throw new ImageError(mocked.res.statusCode, '"url" parameter is valid but internal response is invalid');
            }
            upstreamBuffer = Buffer.concat(mocked.res.buffers);
            upstreamType = detectContentType(upstreamBuffer) || mocked.res.getHeader("Content-Type");
            const cacheControl = mocked.res.getHeader("Cache-Control");
            maxAge = cacheControl ? getMaxAge(cacheControl) : 0;
        } catch (err) {
            console.error("upstream image response failed for", href, err);
            throw new ImageError(500, '"url" parameter is valid but upstream response is invalid');
        }
    }
    if (upstreamType) {
        upstreamType = upstreamType.toLowerCase().trim();
        if (upstreamType.startsWith("image/svg") && !nextConfig.images.dangerouslyAllowSVG) {
            console.error(`The requested resource "${href}" has type "${upstreamType}" but dangerouslyAllowSVG is disabled`);
            throw new ImageError(400, '"url" parameter is valid but image type is not allowed');
        }
        const vector = VECTOR_TYPES.includes(upstreamType);
        const animate = ANIMATABLE_TYPES.includes(upstreamType) && (0, _isanimated.default)(upstreamBuffer);
        if (vector || animate) {
            return {
                buffer: upstreamBuffer,
                contentType: upstreamType,
                maxAge
            };
        }
        if (!upstreamType.startsWith("image/") || upstreamType.includes(",")) {
            console.error("The requested resource isn't a valid image for", href, "received", upstreamType);
            throw new ImageError(400, "The requested resource isn't a valid image.");
        }
    }
    let contentType;
    if (mimeType) {
        contentType = mimeType;
    } else if ((upstreamType == null ? void 0 : upstreamType.startsWith("image/")) && (0, _servestatic.getExtension)(upstreamType) && upstreamType !== WEBP && upstreamType !== AVIF) {
        contentType = upstreamType;
    } else {
        contentType = JPEG;
    }
    try {
        let optimizedBuffer = await optimizeImage({
            buffer: upstreamBuffer,
            contentType,
            quality,
            width,
            nextConfigOutput: nextConfig.output
        });
        if (optimizedBuffer) {
            if (isDev && width <= BLUR_IMG_SIZE && quality === BLUR_QUALITY) {
                const { getMetadata  } = require("./lib/squoosh/main");
                // During `next dev`, we don't want to generate blur placeholders with webpack
                // because it can delay starting the dev server. Instead, `next-image-loader.js`
                // will inline a special url to lazily generate the blur placeholder at request time.
                const meta = await getMetadata(optimizedBuffer);
                const opts = {
                    blurWidth: meta.width,
                    blurHeight: meta.height,
                    blurDataURL: `data:${contentType};base64,${optimizedBuffer.toString("base64")}`
                };
                optimizedBuffer = Buffer.from(unescape((0, _imageblursvg.getImageBlurSvg)(opts)));
                contentType = "image/svg+xml";
            }
            return {
                buffer: optimizedBuffer,
                contentType,
                maxAge: Math.max(maxAge, nextConfig.images.minimumCacheTTL)
            };
        } else {
            throw new ImageError(500, "Unable to optimize buffer");
        }
    } catch (error) {
        if (upstreamBuffer && upstreamType) {
            // If we fail to optimize, fallback to the original image
            return {
                buffer: upstreamBuffer,
                contentType: upstreamType,
                maxAge: nextConfig.images.minimumCacheTTL
            };
        } else {
            throw new ImageError(400, "Unable to optimize image and unable to fallback to upstream image");
        }
    }
}
function getFileNameWithExtension(url, contentType) {
    const [urlWithoutQueryParams] = url.split("?");
    const fileNameWithExtension = urlWithoutQueryParams.split("/").pop();
    if (!contentType || !fileNameWithExtension) {
        return "image.bin";
    }
    const [fileName] = fileNameWithExtension.split(".");
    const extension = (0, _servestatic.getExtension)(contentType);
    return `${fileName}.${extension}`;
}
function setResponseHeaders(req, res, url, etag, contentType, isStatic, xCache, imagesConfig, maxAge, isDev) {
    res.setHeader("Vary", "Accept");
    res.setHeader("Cache-Control", isStatic ? "public, max-age=315360000, immutable" : `public, max-age=${isDev ? 0 : maxAge}, must-revalidate`);
    if ((0, _sendpayload.sendEtagResponse)(req, res, etag)) {
        // already called res.end() so we're finished
        return {
            finished: true
        };
    }
    if (contentType) {
        res.setHeader("Content-Type", contentType);
    }
    const fileName = getFileNameWithExtension(url, contentType);
    res.setHeader("Content-Disposition", (0, _contentdisposition.default)(fileName, {
        type: imagesConfig.contentDispositionType
    }));
    res.setHeader("Content-Security-Policy", imagesConfig.contentSecurityPolicy);
    res.setHeader("X-Nextjs-Cache", xCache);
    return {
        finished: false
    };
}
function sendResponse(req, res, url, extension, buffer, isStatic, xCache, imagesConfig, maxAge, isDev) {
    const contentType = (0, _servestatic.getContentType)(extension);
    const etag = getHash([
        buffer
    ]);
    const result = setResponseHeaders(req, res, url, etag, contentType, isStatic, xCache, imagesConfig, maxAge, isDev);
    if (!result.finished) {
        res.setHeader("Content-Length", Buffer.byteLength(buffer));
        res.end(buffer);
    }
}
async function getImageSize(buffer, // Should match VALID_BLUR_EXT
extension) {
    // TODO: upgrade "image-size" package to support AVIF
    // See https://github.com/image-size/image-size/issues/348
    if (extension === "avif") {
        if (sharp) {
            const transformer = sharp(buffer);
            const { width , height  } = await transformer.metadata();
            return {
                width,
                height
            };
        } else {
            const { decodeBuffer  } = require("./lib/squoosh/main");
            const { width , height  } = await decodeBuffer(buffer);
            return {
                width,
                height
            };
        }
    }
    const { width , height  } = (0, _imagesize.default)(buffer);
    return {
        width,
        height
    };
}
class Deferred {
    constructor(){
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

//# sourceMappingURL=image-optimizer.js.map