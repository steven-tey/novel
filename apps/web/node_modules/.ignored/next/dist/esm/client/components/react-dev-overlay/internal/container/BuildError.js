import { _ as _tagged_template_literal_loose } from "@swc/helpers/_/_tagged_template_literal_loose";
function _templateObject() {
    const data = _tagged_template_literal_loose([
        "\n  .nextjs-container-build-error-header {\n    display: flex;\n    align-items: center;\n  }\n  .nextjs-container-build-error-header > h4 {\n    line-height: 1.5;\n    margin: 0;\n    padding: 0;\n  }\n\n  .nextjs-container-build-error-body footer {\n    margin-top: var(--size-gap);\n  }\n  .nextjs-container-build-error-body footer p {\n    margin: 0;\n  }\n\n  .nextjs-container-build-error-body small {\n    color: #757575;\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
import * as React from "react";
import { Dialog, DialogBody, DialogContent, DialogHeader } from "../components/Dialog";
import { Overlay } from "../components/Overlay";
import { Terminal } from "../components/Terminal";
import { VersionStalenessInfo } from "../components/VersionStalenessInfo";
import { noop as css } from "../helpers/noop-template";
export const BuildError = function BuildError(param) {
    let { message , versionInfo  } = param;
    const noop = React.useCallback(()=>{}, []);
    return /*#__PURE__*/ React.createElement(Overlay, {
        fixed: true
    }, /*#__PURE__*/ React.createElement(Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_build_error_label",
        "aria-describedby": "nextjs__container_build_error_desc",
        onClose: noop
    }, /*#__PURE__*/ React.createElement(DialogContent, null, /*#__PURE__*/ React.createElement(DialogHeader, {
        className: "nextjs-container-build-error-header"
    }, /*#__PURE__*/ React.createElement("h4", {
        id: "nextjs__container_build_error_label"
    }, "Failed to compile"), versionInfo ? /*#__PURE__*/ React.createElement(VersionStalenessInfo, versionInfo) : null), /*#__PURE__*/ React.createElement(DialogBody, {
        className: "nextjs-container-build-error-body"
    }, /*#__PURE__*/ React.createElement(Terminal, {
        content: message
    }), /*#__PURE__*/ React.createElement("footer", null, /*#__PURE__*/ React.createElement("p", {
        id: "nextjs__container_build_error_desc"
    }, /*#__PURE__*/ React.createElement("small", null, "This error occurred during the build process and can only be dismissed by fixing the error.")))))));
};
export const styles = css(_templateObject());

//# sourceMappingURL=BuildError.js.map