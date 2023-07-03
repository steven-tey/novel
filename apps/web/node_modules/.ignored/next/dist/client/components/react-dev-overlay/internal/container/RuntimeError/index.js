"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    styles: null,
    RuntimeError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    styles: function() {
        return styles;
    },
    RuntimeError: function() {
        return RuntimeError;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _tagged_template_literal_loose = require("@swc/helpers/_/_tagged_template_literal_loose");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _CodeFrame = require("../../components/CodeFrame");
const _nooptemplate = require("../../helpers/noop-template");
const _groupstackframesbyframework = require("../../helpers/group-stack-frames-by-framework");
const _CallStackFrame = require("./CallStackFrame");
const _GroupedStackFrames = require("./GroupedStackFrames");
const _ComponentStackFrameRow = require("./ComponentStackFrameRow");
function _templateObject() {
    const data = _tagged_template_literal_loose._([
        "\n  button[data-nextjs-data-runtime-error-collapsed-action] {\n    background: none;\n    border: none;\n    padding: 0;\n    font-size: var(--size-font-small);\n    line-height: var(--size-font-bigger);\n    color: var(--color-accents-3);\n  }\n\n  [data-nextjs-call-stack-frame]:not(:last-child),\n  [data-nextjs-component-stack-frame]:not(:last-child) {\n    margin-bottom: var(--size-gap-double);\n  }\n\n  [data-nextjs-call-stack-frame] > h3,\n  [data-nextjs-component-stack-frame] > h3 {\n    margin-top: 0;\n    margin-bottom: var(--size-gap);\n    font-family: var(--font-stack-monospace);\n    font-size: var(--size-font);\n    color: #222;\n  }\n  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {\n    color: #666;\n  }\n  [data-nextjs-call-stack-frame] > div,\n  [data-nextjs-component-stack-frame] > div {\n    display: flex;\n    align-items: center;\n    padding-left: calc(var(--size-gap) + var(--size-gap-half));\n    font-size: var(--size-font-small);\n    color: #999;\n  }\n  [data-nextjs-call-stack-frame] > div > svg,\n  [data-nextjs-component-stack-frame] > div > svg {\n    width: auto;\n    height: var(--size-font-small);\n    margin-left: var(--size-gap);\n\n    display: none;\n  }\n\n  [data-nextjs-call-stack-frame] > div[data-has-source],\n  [data-nextjs-component-stack-frame] > div {\n    cursor: pointer;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source]:hover,\n  [data-nextjs-component-stack-frame] > div:hover {\n    text-decoration: underline dotted;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source] > svg,\n  [data-nextjs-component-stack-frame] > div > svg {\n    display: unset;\n  }\n\n  [data-nextjs-call-stack-framework-icon] {\n    margin-right: var(--size-gap);\n  }\n  [data-nextjs-call-stack-framework-icon='next'] > mask {\n    mask-type: alpha;\n  }\n  [data-nextjs-call-stack-framework-icon='react'] {\n    color: rgb(20, 158, 202);\n  }\n  [data-nextjs-collapsed-call-stack-details][open]\n    [data-nextjs-call-stack-chevron-icon] {\n    transform: rotate(90deg);\n  }\n  [data-nextjs-collapsed-call-stack-details] summary {\n    display: flex;\n    align-items: center;\n    margin: var(--size-gap-double) 0;\n    list-style: none;\n  }\n  [data-nextjs-collapsed-call-stack-details] summary::-webkit-details-marker {\n    display: none;\n  }\n\n  [data-nextjs-collapsed-call-stack-details] h3 {\n    color: #666;\n  }\n  [data-nextjs-collapsed-call-stack-details] [data-nextjs-call-stack-frame] {\n    margin-bottom: var(--size-gap-double);\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
const RuntimeError = function RuntimeError(param) {
    let { error  } = param;
    const firstFirstPartyFrameIndex = _react.useMemo(()=>{
        return error.frames.findIndex((entry)=>entry.expanded && Boolean(entry.originalCodeFrame) && Boolean(entry.originalStackFrame));
    }, [
        error.frames
    ]);
    const firstFrame = _react.useMemo(()=>{
        var _error_frames_firstFirstPartyFrameIndex;
        return (_error_frames_firstFirstPartyFrameIndex = error.frames[firstFirstPartyFrameIndex]) != null ? _error_frames_firstFirstPartyFrameIndex : null;
    }, [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const allLeadingFrames = _react.useMemo(()=>firstFirstPartyFrameIndex < 0 ? [] : error.frames.slice(0, firstFirstPartyFrameIndex), [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const [all, setAll] = _react.useState(firstFrame == null);
    const toggleAll = _react.useCallback(()=>{
        setAll((v)=>!v);
    }, []);
    const leadingFrames = _react.useMemo(()=>allLeadingFrames.filter((f)=>f.expanded || all), [
        all,
        allLeadingFrames
    ]);
    const allCallStackFrames = _react.useMemo(()=>error.frames.slice(firstFirstPartyFrameIndex + 1), [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const visibleCallStackFrames = _react.useMemo(()=>allCallStackFrames.filter((f)=>f.expanded || all), [
        all,
        allCallStackFrames
    ]);
    const canShowMore = _react.useMemo(()=>{
        return allCallStackFrames.length !== visibleCallStackFrames.length || all && firstFrame != null;
    }, [
        all,
        allCallStackFrames.length,
        firstFrame,
        visibleCallStackFrames.length
    ]);
    const stackFramesGroupedByFramework = _react.useMemo(()=>(0, _groupstackframesbyframework.groupStackFramesByFramework)(visibleCallStackFrames), [
        visibleCallStackFrames
    ]);
    return /*#__PURE__*/ _react.createElement(_react.Fragment, null, firstFrame ? /*#__PURE__*/ _react.createElement(_react.Fragment, null, /*#__PURE__*/ _react.createElement("h2", null, "Source"), leadingFrames.map((frame, index)=>/*#__PURE__*/ _react.createElement(_CallStackFrame.CallStackFrame, {
            key: "leading-frame-" + index + "-" + all,
            frame: frame
        })), /*#__PURE__*/ _react.createElement(_CodeFrame.CodeFrame, {
        stackFrame: firstFrame.originalStackFrame,
        codeFrame: firstFrame.originalCodeFrame
    })) : undefined, error.componentStackFrames ? /*#__PURE__*/ _react.createElement(_react.Fragment, null, /*#__PURE__*/ _react.createElement("h2", null, "Component Stack"), error.componentStackFrames.map((componentStackFrame, index)=>/*#__PURE__*/ _react.createElement(_ComponentStackFrameRow.ComponentStackFrameRow, {
            key: index,
            componentStackFrame: componentStackFrame
        }))) : null, stackFramesGroupedByFramework.length ? /*#__PURE__*/ _react.createElement(_react.Fragment, null, /*#__PURE__*/ _react.createElement("h2", null, "Call Stack"), /*#__PURE__*/ _react.createElement(_GroupedStackFrames.GroupedStackFrames, {
        groupedStackFrames: stackFramesGroupedByFramework,
        all: all
    })) : undefined, canShowMore ? /*#__PURE__*/ _react.createElement(_react.Fragment, null, /*#__PURE__*/ _react.createElement("button", {
        tabIndex: 10,
        "data-nextjs-data-runtime-error-collapsed-action": true,
        type: "button",
        onClick: toggleAll
    }, all ? "Hide" : "Show", " collapsed frames")) : undefined);
};
const styles = (0, _nooptemplate.noop)(_templateObject());

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=index.js.map