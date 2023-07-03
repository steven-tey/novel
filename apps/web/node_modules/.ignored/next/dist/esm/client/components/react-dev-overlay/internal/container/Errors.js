import { _ as _tagged_template_literal_loose } from "@swc/helpers/_/_tagged_template_literal_loose";
function _templateObject() {
    const data = _tagged_template_literal_loose([
        "\n  .nextjs-container-errors-header > h1 {\n    font-size: var(--size-font-big);\n    line-height: var(--size-font-bigger);\n    font-weight: bold;\n    margin: 0;\n    margin-top: calc(var(--size-gap-double) + var(--size-gap-half));\n  }\n  .nextjs-container-errors-header small {\n    font-size: var(--size-font-small);\n    color: var(--color-accents-1);\n    margin-left: var(--size-gap-double);\n  }\n  .nextjs-container-errors-header small > span {\n    font-family: var(--font-stack-monospace);\n  }\n  .nextjs-container-errors-header > p {\n    font-family: var(--font-stack-monospace);\n    font-size: var(--size-font-small);\n    line-height: var(--size-font-big);\n    font-weight: bold;\n    margin: 0;\n    margin-top: var(--size-gap-half);\n    color: var(--color-ansi-red);\n    white-space: pre-wrap;\n  }\n  .nextjs-container-errors-header > div > small {\n    margin: 0;\n    margin-top: var(--size-gap-half);\n  }\n  .nextjs-container-errors-header > p > a {\n    color: var(--color-ansi-red);\n  }\n\n  .nextjs-container-errors-body > h2:not(:first-child) {\n    margin-top: calc(var(--size-gap-double) + var(--size-gap));\n  }\n  .nextjs-container-errors-body > h2 {\n    margin-bottom: var(--size-gap);\n    font-size: var(--size-font-big);\n  }\n\n  .nextjs-toast-errors-parent {\n    cursor: pointer;\n    transition: transform 0.2s ease;\n  }\n  .nextjs-toast-errors-parent:hover {\n    transform: scale(1.1);\n  }\n  .nextjs-toast-errors {\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n  }\n  .nextjs-toast-errors > svg {\n    margin-right: var(--size-gap);\n  }\n  .nextjs-toast-errors-hide-button {\n    margin-left: var(--size-gap-triple);\n    border: none;\n    background: none;\n    color: var(--color-ansi-bright-white);\n    padding: 0;\n    transition: opacity 0.25s ease;\n    opacity: 0.7;\n  }\n  .nextjs-toast-errors-hide-button:hover {\n    opacity: 1;\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
import * as React from "react";
import { ACTION_UNHANDLED_ERROR, ACTION_UNHANDLED_REJECTION } from "../error-overlay-reducer";
import { Dialog, DialogBody, DialogContent, DialogHeader } from "../components/Dialog";
import { LeftRightDialogHeader } from "../components/LeftRightDialogHeader";
import { Overlay } from "../components/Overlay";
import { Toast } from "../components/Toast";
import { getErrorByType } from "../helpers/getErrorByType";
import { getErrorSource } from "../helpers/nodeStackFrames";
import { noop as css } from "../helpers/noop-template";
import { CloseIcon } from "../icons/CloseIcon";
import { RuntimeError } from "./RuntimeError";
import { VersionStalenessInfo } from "../components/VersionStalenessInfo";
import { HotlinkedText } from "../components/hot-linked-text";
function getErrorSignature(ev) {
    const { event  } = ev;
    switch(event.type){
        case ACTION_UNHANDLED_ERROR:
        case ACTION_UNHANDLED_REJECTION:
            {
                return event.reason.name + "::" + event.reason.message + "::" + event.reason.stack;
            }
        default:
            {}
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    return "";
}
export const Errors = function Errors(param) {
    let { errors , initialDisplayState , versionInfo  } = param;
    const [lookups, setLookups] = React.useState({});
    const [readyErrors, nextError] = React.useMemo(()=>{
        let ready = [];
        let next = null;
        // Ensure errors are displayed in the order they occurred in:
        for(let idx = 0; idx < errors.length; ++idx){
            const e = errors[idx];
            const { id  } = e;
            if (id in lookups) {
                ready.push(lookups[id]);
                continue;
            }
            // Check for duplicate errors
            if (idx > 0) {
                const prev = errors[idx - 1];
                if (getErrorSignature(prev) === getErrorSignature(e)) {
                    continue;
                }
            }
            next = e;
            break;
        }
        return [
            ready,
            next
        ];
    }, [
        errors,
        lookups
    ]);
    const isLoading = React.useMemo(()=>{
        return readyErrors.length < 1 && Boolean(errors.length);
    }, [
        errors.length,
        readyErrors.length
    ]);
    React.useEffect(()=>{
        if (nextError == null) {
            return;
        }
        let mounted = true;
        getErrorByType(nextError).then((resolved)=>{
            // We don't care if the desired error changed while we were resolving,
            // thus we're not tracking it using a ref. Once the work has been done,
            // we'll store it.
            if (mounted) {
                setLookups((m)=>({
                        ...m,
                        [resolved.id]: resolved
                    }));
            }
        }, ()=>{
        // TODO: handle this, though an edge case
        });
        return ()=>{
            mounted = false;
        };
    }, [
        nextError
    ]);
    const [displayState, setDisplayState] = React.useState(initialDisplayState);
    const [activeIdx, setActiveIndex] = React.useState(0);
    const previous = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setActiveIndex((v)=>Math.max(0, v - 1));
    }, []);
    const next = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setActiveIndex((v)=>Math.max(0, Math.min(readyErrors.length - 1, v + 1)));
    }, [
        readyErrors.length
    ]);
    var _readyErrors_activeIdx;
    const activeError = React.useMemo(()=>(_readyErrors_activeIdx = readyErrors[activeIdx]) != null ? _readyErrors_activeIdx : null, [
        activeIdx,
        readyErrors
    ]);
    // Reset component state when there are no errors to be displayed.
    // This should never happen, but lets handle it.
    React.useEffect(()=>{
        if (errors.length < 1) {
            setLookups({});
            setDisplayState("hidden");
            setActiveIndex(0);
        }
    }, [
        errors.length
    ]);
    const minimize = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState("minimized");
    }, []);
    const hide = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState("hidden");
    }, []);
    const fullscreen = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState("fullscreen");
    }, []);
    // This component shouldn't be rendered with no errors, but if it is, let's
    // handle it gracefully by rendering nothing.
    if (errors.length < 1 || activeError == null) {
        return null;
    }
    if (isLoading) {
        // TODO: better loading state
        return /*#__PURE__*/ React.createElement(Overlay, null);
    }
    if (displayState === "hidden") {
        return null;
    }
    if (displayState === "minimized") {
        return /*#__PURE__*/ React.createElement(Toast, {
            className: "nextjs-toast-errors-parent",
            onClick: fullscreen
        }, /*#__PURE__*/ React.createElement("div", {
            className: "nextjs-toast-errors"
        }, /*#__PURE__*/ React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, /*#__PURE__*/ React.createElement("circle", {
            cx: "12",
            cy: "12",
            r: "10"
        }), /*#__PURE__*/ React.createElement("line", {
            x1: "12",
            y1: "8",
            x2: "12",
            y2: "12"
        }), /*#__PURE__*/ React.createElement("line", {
            x1: "12",
            y1: "16",
            x2: "12.01",
            y2: "16"
        })), /*#__PURE__*/ React.createElement("span", null, readyErrors.length, " error", readyErrors.length > 1 ? "s" : ""), /*#__PURE__*/ React.createElement("button", {
            "data-nextjs-toast-errors-hide-button": true,
            className: "nextjs-toast-errors-hide-button",
            type: "button",
            onClick: (e)=>{
                e.stopPropagation();
                hide();
            },
            "aria-label": "Hide Errors"
        }, /*#__PURE__*/ React.createElement(CloseIcon, null))));
    }
    const isServerError = [
        "server",
        "edge-server"
    ].includes(getErrorSource(activeError.error) || "");
    return /*#__PURE__*/ React.createElement(Overlay, null, /*#__PURE__*/ React.createElement(Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_errors_label",
        "aria-describedby": "nextjs__container_errors_desc",
        onClose: isServerError ? undefined : minimize
    }, /*#__PURE__*/ React.createElement(DialogContent, null, /*#__PURE__*/ React.createElement(DialogHeader, {
        className: "nextjs-container-errors-header"
    }, /*#__PURE__*/ React.createElement(LeftRightDialogHeader, {
        previous: activeIdx > 0 ? previous : null,
        next: activeIdx < readyErrors.length - 1 ? next : null,
        close: isServerError ? undefined : minimize
    }, /*#__PURE__*/ React.createElement("small", null, /*#__PURE__*/ React.createElement("span", null, activeIdx + 1), " of", " ", /*#__PURE__*/ React.createElement("span", null, readyErrors.length), " unhandled error", readyErrors.length < 2 ? "" : "s"), versionInfo ? /*#__PURE__*/ React.createElement(VersionStalenessInfo, versionInfo) : null), /*#__PURE__*/ React.createElement("h1", {
        id: "nextjs__container_errors_label"
    }, isServerError ? "Server Error" : "Unhandled Runtime Error"), /*#__PURE__*/ React.createElement("p", {
        id: "nextjs__container_errors_desc"
    }, activeError.error.name, ":", " ", /*#__PURE__*/ React.createElement(HotlinkedText, {
        text: activeError.error.message
    })), isServerError ? /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("small", null, "This error happened while generating the page. Any console logs will be displayed in the terminal window.")) : undefined), /*#__PURE__*/ React.createElement(DialogBody, {
        className: "nextjs-container-errors-body"
    }, /*#__PURE__*/ React.createElement(RuntimeError, {
        key: activeError.id.toString(),
        error: activeError
    })))));
};
export const styles = css(_templateObject());

//# sourceMappingURL=Errors.js.map