import React from "react";
import { useOpenInEditor } from "../../helpers/use-open-in-editor";
export function ComponentStackFrameRow(param) {
    let { componentStackFrame: { component , file , lineNumber , column  }  } = param;
    const open = useOpenInEditor({
        file,
        column,
        lineNumber
    });
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-component-stack-frame": true
    }, /*#__PURE__*/ React.createElement("h3", null, component), file ? /*#__PURE__*/ React.createElement("div", {
        tabIndex: 10,
        role: "link",
        onClick: open,
        title: "Click to open in your editor"
    }, /*#__PURE__*/ React.createElement("span", null, file, " (", lineNumber, ":", column, ")"), /*#__PURE__*/ React.createElement("svg", {
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
    }))) : null);
}

//# sourceMappingURL=ComponentStackFrameRow.js.map