"use client";

import React from "react";
export var CacheStates;
(function(CacheStates) {
    CacheStates["LAZY_INITIALIZED"] = "LAZYINITIALIZED";
    CacheStates["DATA_FETCH"] = "DATAFETCH";
    CacheStates["READY"] = "READY";
})(CacheStates || (CacheStates = {}));
export const AppRouterContext = React.createContext(null);
export const LayoutRouterContext = React.createContext(null);
export const GlobalLayoutRouterContext = React.createContext(null);
export const TemplateContext = React.createContext(null);
if (process.env.NODE_ENV !== "production") {
    AppRouterContext.displayName = "AppRouterContext";
    LayoutRouterContext.displayName = "LayoutRouterContext";
    GlobalLayoutRouterContext.displayName = "GlobalLayoutRouterContext";
    TemplateContext.displayName = "TemplateContext";
}

//# sourceMappingURL=app-router-context.js.map