"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VersionStalenessInfo", {
    enumerable: true,
    get: function() {
        return VersionStalenessInfo;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
function VersionStalenessInfo(props) {
    if (!props) return null;
    const { staleness , installed , expected  } = props;
    let text = "";
    let title = "";
    let indicatorClass = "";
    switch(staleness){
        case "fresh":
            text = "Next.js is up to date";
            title = "Latest available version is detected (" + installed + ").";
            indicatorClass = "fresh";
            break;
        case "stale-patch":
        case "stale-minor":
            text = "Next.js (" + installed + ") out of date";
            title = "There is a newer version (" + expected + ") available, upgrade recommended! ";
            indicatorClass = "stale";
            break;
        case "stale-major":
            {
                text = "Next.js (" + installed + ") is outdated";
                title = "An outdated version detected (latest is " + expected + "), upgrade is highly recommended!";
                indicatorClass = "outdated";
                break;
            }
        case "stale-prerelease":
            {
                text = "Next.js (" + installed + ") is outdated";
                title = "There is a newer canary version (" + expected + ") available, please upgrade! ";
                indicatorClass = "stale";
                break;
            }
        case "newer-than-npm":
        case "unknown":
            break;
        default:
            break;
    }
    if (!text) return null;
    return /*#__PURE__*/ _react.default.createElement("small", {
        className: "nextjs-container-build-error-version-status"
    }, /*#__PURE__*/ _react.default.createElement("span", {
        className: indicatorClass
    }), /*#__PURE__*/ _react.default.createElement("small", {
        className: "nextjs-container-build-error-version-status",
        title: title
    }, text), " ", staleness === "fresh" || staleness === "unknown" ? null : /*#__PURE__*/ _react.default.createElement("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://nextjs.org/docs/messages/version-staleness"
    }, "(learn more)"));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=VersionStalenessInfo.js.map