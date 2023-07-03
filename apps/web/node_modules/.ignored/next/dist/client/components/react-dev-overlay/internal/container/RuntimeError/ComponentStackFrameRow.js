"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ComponentStackFrameRow", {
    enumerable: true,
    get: function() {
        return ComponentStackFrameRow;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _useopenineditor = require("../../helpers/use-open-in-editor");
function ComponentStackFrameRow(param) {
    let { componentStackFrame: { component , file , lineNumber , column  }  } = param;
    const open = (0, _useopenineditor.useOpenInEditor)({
        file,
        column,
        lineNumber
    });
    return /*#__PURE__*/ _react.default.createElement("div", {
        "data-nextjs-component-stack-frame": true
    }, /*#__PURE__*/ _react.default.createElement("h3", null, component), file ? /*#__PURE__*/ _react.default.createElement("div", {
        tabIndex: 10,
        role: "link",
        onClick: open,
        title: "Click to open in your editor"
    }, /*#__PURE__*/ _react.default.createElement("span", null, file, " (", lineNumber, ":", column, ")"), /*#__PURE__*/ _react.default.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }, /*#__PURE__*/ _react.default.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    }), /*#__PURE__*/ _react.default.createElement("polyline", {
        points: "15 3 21 3 21 9"
    }), /*#__PURE__*/ _react.default.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
    }))) : null);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=ComponentStackFrameRow.js.map