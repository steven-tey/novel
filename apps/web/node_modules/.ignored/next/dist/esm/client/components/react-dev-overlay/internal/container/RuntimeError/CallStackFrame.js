import React from "react";
import { getFrameSource } from "../../helpers/stack-frame";
import { useOpenInEditor } from "../../helpers/use-open-in-editor";
export const CallStackFrame = function CallStackFrame(param) {
    let { frame  } = param;
    var _frame_originalStackFrame;
    // TODO: ability to expand resolved frames
    // TODO: render error or external indicator
    const f = (_frame_originalStackFrame = frame.originalStackFrame) != null ? _frame_originalStackFrame : frame.sourceStackFrame;
    const hasSource = Boolean(frame.originalCodeFrame);
    const open = useOpenInEditor(hasSource ? {
        file: f.file,
        lineNumber: f.lineNumber,
        column: f.column
    } : undefined);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-call-stack-frame": true
    }, /*#__PURE__*/ React.createElement("h3", {
        "data-nextjs-frame-expanded": Boolean(frame.expanded)
    }, f.methodName), /*#__PURE__*/ React.createElement("div", {
        "data-has-source": hasSource ? "true" : undefined,
        tabIndex: hasSource ? 10 : undefined,
        role: hasSource ? "link" : undefined,
        onClick: open,
        title: hasSource ? "Click to open in your editor" : undefined
    }, /*#__PURE__*/ React.createElement("span", null, getFrameSource(f)), /*#__PURE__*/ React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    }), /*#__PURE__*/ React.createElement("polyline", {
        points: "15 3 21 3 21 9"
    }), /*#__PURE__*/ React.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
    }))));
};

//# sourceMappingURL=CallStackFrame.js.map