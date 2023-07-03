"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RootLayoutError: null,
    styles: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RootLayoutError: function() {
        return RootLayoutError;
    },
    styles: function() {
        return styles;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _tagged_template_literal_loose = require("@swc/helpers/_/_tagged_template_literal_loose");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _Dialog = require("../components/Dialog");
const _Overlay = require("../components/Overlay");
const _Terminal = require("../components/Terminal");
const _nooptemplate = require("../helpers/noop-template");
function _templateObject() {
    const data = _tagged_template_literal_loose._([
        "\n  .nextjs-container-root-layout-error-header > h4 {\n    line-height: 1.5;\n    margin: 0;\n    padding: 0;\n  }\n\n  .nextjs-container-root-layout-error-body footer {\n    margin-top: var(--size-gap);\n  }\n  .nextjs-container-root-layout-error-body footer p {\n    margin: 0;\n  }\n\n  .nextjs-container-root-layout-error-body small {\n    color: #757575;\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
const RootLayoutError = function BuildError(param) {
    let { missingTags  } = param;
    const message = "Please make sure to include the following tags in your root layout: <html>, <body>.\n\n" + ("Missing required root layout tag" + (missingTags.length === 1 ? "" : "s") + ": ") + missingTags.join(", ");
    const noop = _react.default.useCallback(()=>{}, []);
    return /*#__PURE__*/ _react.default.createElement(_Overlay.Overlay, {
        fixed: true
    }, /*#__PURE__*/ _react.default.createElement(_Dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_root_layout_error_label",
        "aria-describedby": "nextjs__container_root_layout_error_desc",
        onClose: noop
    }, /*#__PURE__*/ _react.default.createElement(_Dialog.DialogContent, null, /*#__PURE__*/ _react.default.createElement(_Dialog.DialogHeader, {
        className: "nextjs-container-root-layout-error-header"
    }, /*#__PURE__*/ _react.default.createElement("h4", {
        id: "nextjs__container_root_layout_error_label"
    }, "Missing required tags")), /*#__PURE__*/ _react.default.createElement(_Dialog.DialogBody, {
        className: "nextjs-container-root-layout-error-body"
    }, /*#__PURE__*/ _react.default.createElement(_Terminal.Terminal, {
        content: message
    }), /*#__PURE__*/ _react.default.createElement("footer", null, /*#__PURE__*/ _react.default.createElement("p", {
        id: "nextjs__container_root_layout_error_desc"
    }, /*#__PURE__*/ _react.default.createElement("small", null, "This error and can only be dismissed by providing all required tags.")))))));
};
const styles = (0, _nooptemplate.noop)(_templateObject());

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=RootLayoutError.js.map