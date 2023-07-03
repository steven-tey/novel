"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Dialog", {
    enumerable: true,
    get: function() {
        return Dialog;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _useonclickoutside = require("../../hooks/use-on-click-outside");
const Dialog = function Dialog(param) {
    let { children , type , onClose , ...props } = param;
    const [dialog, setDialog] = _react.useState(null);
    const onDialog = _react.useCallback((node)=>{
        setDialog(node);
    }, []);
    (0, _useonclickoutside.useOnClickOutside)(dialog, onClose);
    // Make HTMLElements with `role=link` accessible to be triggered by the
    // keyboard, i.e. [Enter].
    _react.useEffect(()=>{
        if (dialog == null) {
            return;
        }
        const root = dialog.getRootNode();
        // Always true, but we do this for TypeScript:
        if (!(root instanceof ShadowRoot)) {
            return;
        }
        const shadowRoot = root;
        function handler(e) {
            const el = shadowRoot.activeElement;
            if (e.key === "Enter" && el instanceof HTMLElement && el.getAttribute("role") === "link") {
                e.preventDefault();
                e.stopPropagation();
                el.click();
            }
        }
        shadowRoot.addEventListener("keydown", handler);
        return ()=>shadowRoot.removeEventListener("keydown", handler);
    }, [
        dialog
    ]);
    return /*#__PURE__*/ _react.createElement("div", {
        ref: onDialog,
        "data-nextjs-dialog": true,
        tabIndex: -1,
        role: "dialog",
        "aria-labelledby": props["aria-labelledby"],
        "aria-describedby": props["aria-describedby"],
        "aria-modal": "true"
    }, /*#__PURE__*/ _react.createElement("div", {
        "data-nextjs-dialog-banner": true,
        className: "banner-" + type
    }), children);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=Dialog.js.map