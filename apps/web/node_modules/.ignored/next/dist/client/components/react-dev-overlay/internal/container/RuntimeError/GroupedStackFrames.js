"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GroupedStackFrames", {
    enumerable: true,
    get: function() {
        return GroupedStackFrames;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _CallStackFrame = require("./CallStackFrame");
const _FrameworkIcon = require("./FrameworkIcon");
function FrameworkGroup(param) {
    let { framework , stackFrames , all  } = param;
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("details", {
        "data-nextjs-collapsed-call-stack-details": true
    }, /*#__PURE__*/ _react.default.createElement("summary", {
        tabIndex: 10
    }, /*#__PURE__*/ _react.default.createElement("svg", {
        "data-nextjs-call-stack-chevron-icon": true,
        fill: "none",
        height: "20",
        width: "20",
        shapeRendering: "geometricPrecision",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ _react.default.createElement("path", {
        d: "M9 18l6-6-6-6"
    })), /*#__PURE__*/ _react.default.createElement(_FrameworkIcon.FrameworkIcon, {
        framework: framework
    }), framework === "react" ? "React" : "Next.js"), stackFrames.map((frame, index)=>/*#__PURE__*/ _react.default.createElement(_CallStackFrame.CallStackFrame, {
            key: "call-stack-" + index + "-" + all,
            frame: frame
        }))));
}
function GroupedStackFrames(param) {
    let { groupedStackFrames , all  } = param;
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, groupedStackFrames.map((stackFramesGroup, groupIndex)=>{
        // Collapse React and Next.js frames
        if (stackFramesGroup.framework) {
            return /*#__PURE__*/ _react.default.createElement(FrameworkGroup, {
                key: "call-stack-framework-group-" + groupIndex + "-" + all,
                framework: stackFramesGroup.framework,
                stackFrames: stackFramesGroup.stackFrames,
                all: all
            });
        }
        return(// Don't group non React and Next.js frames
        stackFramesGroup.stackFrames.map((frame, frameIndex)=>/*#__PURE__*/ _react.default.createElement(_CallStackFrame.CallStackFrame, {
                key: "call-stack-" + groupIndex + "-" + frameIndex + "-" + all,
                frame: frame
            })));
    }));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=GroupedStackFrames.js.map