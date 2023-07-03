import { _ as _tagged_template_literal_loose } from "@swc/helpers/_/_tagged_template_literal_loose";
function _templateObject() {
    const data = _tagged_template_literal_loose([
        "\n  button[data-nextjs-data-runtime-error-collapsed-action] {\n    background: none;\n    border: none;\n    padding: 0;\n    font-size: var(--size-font-small);\n    line-height: var(--size-font-bigger);\n    color: var(--color-accents-3);\n  }\n\n  [data-nextjs-call-stack-frame]:not(:last-child),\n  [data-nextjs-component-stack-frame]:not(:last-child) {\n    margin-bottom: var(--size-gap-double);\n  }\n\n  [data-nextjs-call-stack-frame] > h3,\n  [data-nextjs-component-stack-frame] > h3 {\n    margin-top: 0;\n    margin-bottom: var(--size-gap);\n    font-family: var(--font-stack-monospace);\n    font-size: var(--size-font);\n    color: #222;\n  }\n  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {\n    color: #666;\n  }\n  [data-nextjs-call-stack-frame] > div,\n  [data-nextjs-component-stack-frame] > div {\n    display: flex;\n    align-items: center;\n    padding-left: calc(var(--size-gap) + var(--size-gap-half));\n    font-size: var(--size-font-small);\n    color: #999;\n  }\n  [data-nextjs-call-stack-frame] > div > svg,\n  [data-nextjs-component-stack-frame] > div > svg {\n    width: auto;\n    height: var(--size-font-small);\n    margin-left: var(--size-gap);\n\n    display: none;\n  }\n\n  [data-nextjs-call-stack-frame] > div[data-has-source],\n  [data-nextjs-component-stack-frame] > div {\n    cursor: pointer;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source]:hover,\n  [data-nextjs-component-stack-frame] > div:hover {\n    text-decoration: underline dotted;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source] > svg,\n  [data-nextjs-component-stack-frame] > div > svg {\n    display: unset;\n  }\n\n  [data-nextjs-call-stack-framework-icon] {\n    margin-right: var(--size-gap);\n  }\n  [data-nextjs-call-stack-framework-icon='next'] > mask {\n    mask-type: alpha;\n  }\n  [data-nextjs-call-stack-framework-icon='react'] {\n    color: rgb(20, 158, 202);\n  }\n  [data-nextjs-collapsed-call-stack-details][open]\n    [data-nextjs-call-stack-chevron-icon] {\n    transform: rotate(90deg);\n  }\n  [data-nextjs-collapsed-call-stack-details] summary {\n    display: flex;\n    align-items: center;\n    margin: var(--size-gap-double) 0;\n    list-style: none;\n  }\n  [data-nextjs-collapsed-call-stack-details] summary::-webkit-details-marker {\n    display: none;\n  }\n\n  [data-nextjs-collapsed-call-stack-details] h3 {\n    color: #666;\n  }\n  [data-nextjs-collapsed-call-stack-details] [data-nextjs-call-stack-frame] {\n    margin-bottom: var(--size-gap-double);\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
import * as React from "react";
import { CodeFrame } from "../../components/CodeFrame";
import { noop as css } from "../../helpers/noop-template";
import { groupStackFramesByFramework } from "../../helpers/group-stack-frames-by-framework";
import { CallStackFrame } from "./CallStackFrame";
import { GroupedStackFrames } from "./GroupedStackFrames";
import { ComponentStackFrameRow } from "./ComponentStackFrameRow";
const RuntimeError = function RuntimeError(param) {
    let { error  } = param;
    const firstFirstPartyFrameIndex = React.useMemo(()=>{
        return error.frames.findIndex((entry)=>entry.expanded && Boolean(entry.originalCodeFrame) && Boolean(entry.originalStackFrame));
    }, [
        error.frames
    ]);
    const firstFrame = React.useMemo(()=>{
        var _error_frames_firstFirstPartyFrameIndex;
        return (_error_frames_firstFirstPartyFrameIndex = error.frames[firstFirstPartyFrameIndex]) != null ? _error_frames_firstFirstPartyFrameIndex : null;
    }, [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const allLeadingFrames = React.useMemo(()=>firstFirstPartyFrameIndex < 0 ? [] : error.frames.slice(0, firstFirstPartyFrameIndex), [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const [all, setAll] = React.useState(firstFrame == null);
    const toggleAll = React.useCallback(()=>{
        setAll((v)=>!v);
    }, []);
    const leadingFrames = React.useMemo(()=>allLeadingFrames.filter((f)=>f.expanded || all), [
        all,
        allLeadingFrames
    ]);
    const allCallStackFrames = React.useMemo(()=>error.frames.slice(firstFirstPartyFrameIndex + 1), [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const visibleCallStackFrames = React.useMemo(()=>allCallStackFrames.filter((f)=>f.expanded || all), [
        all,
        allCallStackFrames
    ]);
    const canShowMore = React.useMemo(()=>{
        return allCallStackFrames.length !== visibleCallStackFrames.length || all && firstFrame != null;
    }, [
        all,
        allCallStackFrames.length,
        firstFrame,
        visibleCallStackFrames.length
    ]);
    const stackFramesGroupedByFramework = React.useMemo(()=>groupStackFramesByFramework(visibleCallStackFrames), [
        visibleCallStackFrames
    ]);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, firstFrame ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h2", null, "Source"), leadingFrames.map((frame, index)=>/*#__PURE__*/ React.createElement(CallStackFrame, {
            key: "leading-frame-" + index + "-" + all,
            frame: frame
        })), /*#__PURE__*/ React.createElement(CodeFrame, {
        stackFrame: firstFrame.originalStackFrame,
        codeFrame: firstFrame.originalCodeFrame
    })) : undefined, error.componentStackFrames ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h2", null, "Component Stack"), error.componentStackFrames.map((componentStackFrame, index)=>/*#__PURE__*/ React.createElement(ComponentStackFrameRow, {
            key: index,
            componentStackFrame: componentStackFrame
        }))) : null, stackFramesGroupedByFramework.length ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h2", null, "Call Stack"), /*#__PURE__*/ React.createElement(GroupedStackFrames, {
        groupedStackFrames: stackFramesGroupedByFramework,
        all: all
    })) : undefined, canShowMore ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("button", {
        tabIndex: 10,
        "data-nextjs-data-runtime-error-collapsed-action": true,
        type: "button",
        onClick: toggleAll
    }, all ? "Hide" : "Show", " collapsed frames")) : undefined);
};
export const styles = css(_templateObject());
export { RuntimeError };

//# sourceMappingURL=index.js.map