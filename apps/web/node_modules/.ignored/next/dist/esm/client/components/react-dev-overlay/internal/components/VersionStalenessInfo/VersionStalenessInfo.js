import React from "react";
export function VersionStalenessInfo(props) {
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
    return /*#__PURE__*/ React.createElement("small", {
        className: "nextjs-container-build-error-version-status"
    }, /*#__PURE__*/ React.createElement("span", {
        className: indicatorClass
    }), /*#__PURE__*/ React.createElement("small", {
        className: "nextjs-container-build-error-version-status",
        title: title
    }, text), " ", staleness === "fresh" || staleness === "unknown" ? null : /*#__PURE__*/ React.createElement("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://nextjs.org/docs/messages/version-staleness"
    }, "(learn more)"));
}

//# sourceMappingURL=VersionStalenessInfo.js.map