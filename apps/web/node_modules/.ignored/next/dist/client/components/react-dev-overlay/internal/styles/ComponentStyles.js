"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ComponentStyles", {
    enumerable: true,
    get: function() {
        return ComponentStyles;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _tagged_template_literal_loose = require("@swc/helpers/_/_tagged_template_literal_loose");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _styles = require("../components/CodeFrame/styles");
const _Dialog = require("../components/Dialog");
const _styles1 = require("../components/LeftRightDialogHeader/styles");
const _styles2 = require("../components/Overlay/styles");
const _styles3 = require("../components/Terminal/styles");
const _Toast = require("../components/Toast");
const _VersionStalenessInfo = require("../components/VersionStalenessInfo");
const _BuildError = require("../container/BuildError");
const _RootLayoutError = require("../container/RootLayoutError");
const _Errors = require("../container/Errors");
const _RuntimeError = require("../container/RuntimeError");
const _nooptemplate = require("../helpers/noop-template");
function _templateObject() {
    const data = _tagged_template_literal_loose._([
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        \n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function ComponentStyles() {
    return /*#__PURE__*/ _react.createElement("style", null, (0, _nooptemplate.noop)(_templateObject(), _styles2.styles, _Toast.styles, _Dialog.styles, _styles1.styles, _styles.styles, _styles3.styles, _BuildError.styles, _RootLayoutError.styles, _Errors.styles, _RuntimeError.styles, _VersionStalenessInfo.styles));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=ComponentStyles.js.map