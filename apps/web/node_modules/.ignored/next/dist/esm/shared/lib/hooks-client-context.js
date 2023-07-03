"use client";

import { createContext } from "react";
export const SearchParamsContext = createContext(null);
export const PathnameContext = createContext(null);
if (process.env.NODE_ENV !== "production") {
    SearchParamsContext.displayName = "SearchParamsContext";
    PathnameContext.displayName = "PathnameContext";
}

//# sourceMappingURL=hooks-client-context.js.map