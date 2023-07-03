"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CodeFrame", {
    enumerable: true,
    get: function() {
        return CodeFrame;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _anser = /*#__PURE__*/ _interop_require_default._(require("next/dist/compiled/anser"));
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _stripansi = /*#__PURE__*/ _interop_require_default._(require("next/dist/compiled/strip-ansi"));
const _stackframe = require("../../helpers/stack-frame");
const _useopenineditor = require("../../helpers/use-open-in-editor");
const CodeFrame = function CodeFrame(param) {
    let { stackFrame , codeFrame  } = param;
    // Strip leading spaces out of the code frame:
    const formattedFrame = _react.useMemo(()=>{
        const lines = codeFrame.split(/\r?\n/g);
        const prefixLength = lines.map((line)=>/^>? +\d+ +\| [ ]+/.exec((0, _stripansi.default)(line)) === null ? null : /^>? +\d+ +\| ( *)/.exec((0, _stripansi.default)(line))).filter(Boolean).map((v)=>v.pop()).reduce((c, n)=>isNaN(c) ? n.length : Math.min(c, n.length), NaN);
        if (prefixLength > 1) {
            const p = " ".repeat(prefixLength);
            return lines.map((line, a)=>~(a = line.indexOf("|")) ? line.substring(0, a) + line.substring(a).replace(p, "") : line).join("\n");
        }
        return lines.join("\n");
    }, [
        codeFrame
    ]);
    const decoded = _react.useMemo(()=>{
        return _anser.default.ansiToJson(formattedFrame, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        formattedFrame
    ]);
    const open = (0, _useopenineditor.useOpenInEditor)({
        file: stackFrame.file,
        lineNumber: stackFrame.lineNumber,
        column: stackFrame.column
    });
    // TODO: make the caret absolute
    return /*#__PURE__*/ _react.createElement("div", {
        "data-nextjs-codeframe": true
    }, /*#__PURE__*/ _react.createElement("div", null, /*#__PURE__*/ _react.createElement("p", {
        role: "link",
        onClick: open,
        tabIndex: 1,
        title: "Click to open in your editor"
    }, /*#__PURE__*/ _react.createElement("span", null, (0, _stackframe.getFrameSource)(stackFrame), " @ ", stackFrame.methodName), /*#__PURE__*/ _react.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }, /*#__PURE__*/ _react.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    }), /*#__PURE__*/ _react.createElement("polyline", {
        points: "15 3 21 3 21 9"
    }), /*#__PURE__*/ _react.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
    })))), /*#__PURE__*/ _react.createElement("pre", null, decoded.map((entry, index)=>/*#__PURE__*/ _react.createElement("span", {
            key: "frame-" + index,
            style: {
                color: entry.fg ? "var(--color-" + entry.fg + ")" : undefined,
                ...entry.decoration === "bold" ? {
                    fontWeight: 800
                } : entry.decoration === "italic" ? {
                    fontStyle: "italic"
                } : undefined
            }
        }, entry.content))));
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=CodeFrame.js.map