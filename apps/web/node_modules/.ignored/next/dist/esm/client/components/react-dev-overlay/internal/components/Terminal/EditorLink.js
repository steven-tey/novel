import React from "react";
import { useOpenInEditor } from "../../helpers/use-open-in-editor";
export function EditorLink(param) {
    let { file , isSourceFile , location  } = param;
    var _location_line, _location_column;
    const open = useOpenInEditor({
        file,
        lineNumber: (_location_line = location == null ? void 0 : location.line) != null ? _location_line : 1,
        column: (_location_column = location == null ? void 0 : location.column) != null ? _location_column : 0
    });
    return /*#__PURE__*/ React.createElement("div", {
        "data-with-open-in-editor-link": true,
        "data-with-open-in-editor-link-source-file": isSourceFile ? true : undefined,
        "data-with-open-in-editor-link-import-trace": isSourceFile ? undefined : true,
        tabIndex: 10,
        role: "link",
        onClick: open,
        title: "Click to open in your editor"
    }, file, location ? " (" + location.line + ":" + location.column + ")" : null, /*#__PURE__*/ React.createElement("svg", {
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
    })));
}

//# sourceMappingURL=EditorLink.js.map