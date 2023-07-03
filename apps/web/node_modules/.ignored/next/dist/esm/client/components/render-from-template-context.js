"use client";

import React, { useContext } from "react";
import { TemplateContext } from "../../shared/lib/app-router-context";
export default function RenderFromTemplateContext() {
    const children = useContext(TemplateContext);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, children);
}

//# sourceMappingURL=render-from-template-context.js.map