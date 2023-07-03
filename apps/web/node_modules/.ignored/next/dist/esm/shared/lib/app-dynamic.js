import React from "react";
import Loadable from "./lazy-dynamic/loadable";
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    return {
        default: (mod == null ? void 0 : mod.default) || mod
    };
}
export default function dynamic(dynamicOptions, options) {
    const loadableFn = Loadable;
    const loadableOptions = {
        // A loading component is not required, so we default it
        loading: (param)=>{
            let { error , isLoading , pastDelay  } = param;
            if (!pastDelay) return null;
            if (process.env.NODE_ENV !== "production") {
                if (isLoading) {
                    return null;
                }
                if (error) {
                    return /*#__PURE__*/ React.createElement("p", null, error.message, /*#__PURE__*/ React.createElement("br", null), error.stack);
                }
            }
            return null;
        }
    };
    if (typeof dynamicOptions === "function") {
        loadableOptions.loader = dynamicOptions;
    }
    Object.assign(loadableOptions, options);
    const loaderFn = loadableOptions.loader;
    const loader = ()=>loaderFn != null ? loaderFn().then(convertModule) : Promise.resolve(convertModule(()=>null));
    return loadableFn({
        ...loadableOptions,
        loader: loader
    });
}

//# sourceMappingURL=app-dynamic.js.map