/*

Files in the rsc directory are meant to be packaged as part of the RSC graph using next-app-loader.

*/ import ReactDOM from "react-dom";
const stylePreloadOptions = {
    as: "style"
};
export function preloadStyle(href) {
    ReactDOM.preload(href, stylePreloadOptions);
}
export function preloadFont(href, type) {
    ReactDOM.preload(href, {
        as: "font",
        type
    });
}
export function preconnect(href, crossOrigin) {
    if (typeof crossOrigin === "string") {
        ReactDOM.preconnect(href, {
            crossOrigin
        });
    } else {
        ReactDOM.preconnect(href);
    }
}

//# sourceMappingURL=preloads.js.map