import React from "react";
import { NoSSR } from "./dynamic-no-ssr";
function Loadable(options) {
    const opts = Object.assign({
        loader: null,
        loading: null,
        ssr: true
    }, options);
    opts.lazy = /*#__PURE__*/ React.lazy(opts.loader);
    function LoadableComponent(props) {
        const Loading = opts.loading;
        const fallbackElement = /*#__PURE__*/ React.createElement(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        });
        const Wrap = opts.ssr ? React.Fragment : NoSSR;
        const Lazy = opts.lazy;
        return /*#__PURE__*/ React.createElement(React.Suspense, {
            fallback: fallbackElement
        }, /*#__PURE__*/ React.createElement(Wrap, null, /*#__PURE__*/ React.createElement(Lazy, props)));
    }
    LoadableComponent.displayName = "LoadableComponent";
    return LoadableComponent;
}
export default Loadable;

//# sourceMappingURL=loadable.js.map