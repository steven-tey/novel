/**
 * For server-side CSS imports, we need to ignore the actual module content but
 * still trigger the hot-reloading diff mechanism. So here we put the content
 * inside a comment.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    pitch: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    pitch: function() {
        return pitch;
    },
    default: function() {
        return _default;
    }
});
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function pitch() {
    if (process.env.NODE_ENV !== "production") {
        const content = this.fs.readFileSync(this.resourcePath);
        this.data.__checksum = _crypto.default.createHash("sha256").update(typeof content === "string" ? Buffer.from(content) : content).digest().toString("hex");
    }
}
const NextServerCSSLoader = function(content) {
    this.cacheable && this.cacheable();
    // Only add the checksum during development.
    if (process.env.NODE_ENV !== "production") {
        const isCSSModule = this.resourcePath.match(/\.module\.(css|sass|scss)$/);
        const checksum = _crypto.default.createHash("sha256").update(this.data.__checksum + (typeof content === "string" ? Buffer.from(content) : content)).digest().toString("hex").substring(0, 12);
        if (isCSSModule) {
            return `\
${content}
module.exports.__checksum = ${JSON.stringify(checksum)}
`;
        }
        // Server CSS imports are always available for HMR, so we attach
        // `module.hot.accept()` to the generated module.
        const hmrCode = "if (module.hot) { module.hot.accept() }";
        return `\
export default ${JSON.stringify(checksum)}
${hmrCode}
`;
    }
    return content;
};
const _default = NextServerCSSLoader;

//# sourceMappingURL=next-flight-css-loader.js.map