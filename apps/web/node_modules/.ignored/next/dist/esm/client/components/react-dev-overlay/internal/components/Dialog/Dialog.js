import * as React from "react";
import { useOnClickOutside } from "../../hooks/use-on-click-outside";
const Dialog = function Dialog(param) {
    let { children , type , onClose , ...props } = param;
    const [dialog, setDialog] = React.useState(null);
    const onDialog = React.useCallback((node)=>{
        setDialog(node);
    }, []);
    useOnClickOutside(dialog, onClose);
    // Make HTMLElements with `role=link` accessible to be triggered by the
    // keyboard, i.e. [Enter].
    React.useEffect(()=>{
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
    return /*#__PURE__*/ React.createElement("div", {
        ref: onDialog,
        "data-nextjs-dialog": true,
        tabIndex: -1,
        role: "dialog",
        "aria-labelledby": props["aria-labelledby"],
        "aria-describedby": props["aria-describedby"],
        "aria-modal": "true"
    }, /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-banner": true,
        className: "banner-" + type
    }), children);
};
export { Dialog };

//# sourceMappingURL=Dialog.js.map