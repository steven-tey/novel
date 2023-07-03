"use client";

import React from "react";
import { NEXT_DYNAMIC_NO_SSR_CODE } from "./no-ssr-error";
export function suspense() {
    const error = new Error(NEXT_DYNAMIC_NO_SSR_CODE);
    error.digest = NEXT_DYNAMIC_NO_SSR_CODE;
    throw error;
}
export function NoSSR(param) {
    let { children  } = param;
    if (typeof window === "undefined") {
        suspense();
    }
    return children;
}

//# sourceMappingURL=dynamic-no-ssr.js.map