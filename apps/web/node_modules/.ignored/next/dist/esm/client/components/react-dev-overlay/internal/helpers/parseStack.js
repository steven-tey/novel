import { parse } from "next/dist/compiled/stacktrace-parser";
const regexNextStatic = /\/_next(\/static\/.+)/g;
export function parseStack(stack) {
    const frames = parse(stack);
    return frames.map((frame)=>{
        try {
            const url = new URL(frame.file);
            const res = regexNextStatic.exec(url.pathname);
            if (res) {
                var _process_env___NEXT_DIST_DIR_replace, _process_env___NEXT_DIST_DIR;
                const distDir = (_process_env___NEXT_DIST_DIR_replace = (_process_env___NEXT_DIST_DIR = process.env.__NEXT_DIST_DIR) == null ? void 0 : _process_env___NEXT_DIST_DIR.replace(/\\/g, "/")) == null ? void 0 : _process_env___NEXT_DIST_DIR_replace.replace(/\/$/, "");
                if (distDir) {
                    frame.file = "file://" + distDir.concat(res.pop());
                }
            }
        } catch (e) {}
        return frame;
    });
}

//# sourceMappingURL=parseStack.js.map