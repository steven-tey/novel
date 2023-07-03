import * as React from "react";
export const Toast = function Toast(param) {
    let { onClick , children , className  } = param;
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-toast": true,
        onClick: onClick,
        className: className
    }, /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-toast-wrapper": true
    }, children));
};

//# sourceMappingURL=Toast.js.map