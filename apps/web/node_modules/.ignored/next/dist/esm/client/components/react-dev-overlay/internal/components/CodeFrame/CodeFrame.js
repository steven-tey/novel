import Anser from "next/dist/compiled/anser";
import * as React from "react";
import stripAnsi from "next/dist/compiled/strip-ansi";
import { getFrameSource } from "../../helpers/stack-frame";
import { useOpenInEditor } from "../../helpers/use-open-in-editor";
export const CodeFrame = function CodeFrame(param) {
    let { stackFrame , codeFrame  } = param;
    // Strip leading spaces out of the code frame:
    const formattedFrame = React.useMemo(()=>{
        const lines = codeFrame.split(/\r?\n/g);
        const prefixLength = lines.map((line)=>/^>? +\d+ +\| [ ]+/.exec(stripAnsi(line)) === null ? null : /^>? +\d+ +\| ( *)/.exec(stripAnsi(line))).filter(Boolean).map((v)=>v.pop()).reduce((c, n)=>isNaN(c) ? n.length : Math.min(c, n.length), NaN);
        if (prefixLength > 1) {
            const p = " ".repeat(prefixLength);
            return lines.map((line, a)=>~(a = line.indexOf("|")) ? line.substring(0, a) + line.substring(a).replace(p, "") : line).join("\n");
        }
        return lines.join("\n");
    }, [
        codeFrame
    ]);
    const decoded = React.useMemo(()=>{
        return Anser.ansiToJson(formattedFrame, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        formattedFrame
    ]);
    const open = useOpenInEditor({
        file: stackFrame.file,
        lineNumber: stackFrame.lineNumber,
        column: stackFrame.column
    });
    // TODO: make the caret absolute
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-codeframe": true
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        role: "link",
        onClick: open,
        tabIndex: 1,
        title: "Click to open in your editor"
    }, /*#__PURE__*/ React.createElement("span", null, getFrameSource(stackFrame), " @ ", stackFrame.methodName), /*#__PURE__*/ React.createElement("svg", {
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
    })))), /*#__PURE__*/ React.createElement("pre", null, decoded.map((entry, index)=>/*#__PURE__*/ React.createElement("span", {
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

//# sourceMappingURL=CodeFrame.js.map