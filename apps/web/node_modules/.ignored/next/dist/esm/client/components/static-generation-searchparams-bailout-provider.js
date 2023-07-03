"use client";

import React from "react";
import { createSearchParamsBailoutProxy } from "./searchparams-bailout-proxy";
export default function StaticGenerationSearchParamsBailoutProvider(param) {
    let { Component , propsForComponent  } = param;
    const searchParams = createSearchParamsBailoutProxy();
    return /*#__PURE__*/ React.createElement(Component, {
        searchParams: searchParams,
        ...propsForComponent
    });
}

//# sourceMappingURL=static-generation-searchparams-bailout-provider.js.map