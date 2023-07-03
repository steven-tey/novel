"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveThemeColor: null,
    resolveViewport: null,
    resolveAlternates: null,
    resolveRobots: null,
    resolveVerification: null,
    resolveAppleWebApp: null,
    resolveAppLinks: null,
    resolveItunes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    resolveThemeColor: function() {
        return resolveThemeColor;
    },
    resolveViewport: function() {
        return resolveViewport;
    },
    resolveAlternates: function() {
        return resolveAlternates;
    },
    resolveRobots: function() {
        return resolveRobots;
    },
    resolveVerification: function() {
        return resolveVerification;
    },
    resolveAppleWebApp: function() {
        return resolveAppleWebApp;
    },
    resolveAppLinks: function() {
        return resolveAppLinks;
    },
    resolveItunes: function() {
        return resolveItunes;
    }
});
const _utils = require("../generate/utils");
const _resolveurl = require("./resolve-url");
const _constants = require("../constants");
function resolveAlternateUrl(url, metadataBase, pathname) {
    // If alter native url is an URL instance,
    // we treat it as a URL base and resolve with current pathname
    if (url instanceof URL) {
        url = new URL(pathname, url);
    }
    return (0, _resolveurl.resolveAbsoluteUrlWithPathname)(url, metadataBase, pathname);
}
const resolveThemeColor = (themeColor)=>{
    var _resolveAsArrayOrUndefined;
    if (!themeColor) return null;
    const themeColorDescriptors = [];
    (_resolveAsArrayOrUndefined = (0, _utils.resolveAsArrayOrUndefined)(themeColor)) == null ? void 0 : _resolveAsArrayOrUndefined.forEach((descriptor)=>{
        if (typeof descriptor === "string") themeColorDescriptors.push({
            color: descriptor
        });
        else if (typeof descriptor === "object") themeColorDescriptors.push({
            color: descriptor.color,
            media: descriptor.media
        });
    });
    return themeColorDescriptors;
};
const resolveViewport = (viewport)=>{
    let resolved = null;
    if (typeof viewport === "string") {
        resolved = viewport;
    } else if (viewport) {
        resolved = "";
        for(const viewportKey_ in _constants.ViewPortKeys){
            const viewportKey = viewportKey_;
            if (viewportKey in viewport) {
                let value = viewport[viewportKey];
                if (typeof value === "boolean") value = value ? "yes" : "no";
                if (resolved) resolved += ", ";
                resolved += `${_constants.ViewPortKeys[viewportKey]}=${value}`;
            }
        }
    }
    return resolved;
};
function resolveUrlValuesOfObject(obj, metadataBase, pathname) {
    if (!obj) return null;
    const result = {};
    for (const [key, value] of Object.entries(obj)){
        if (typeof value === "string" || value instanceof URL) {
            result[key] = [
                {
                    url: resolveAlternateUrl(value, metadataBase, pathname)
                }
            ];
        } else {
            result[key] = [];
            value == null ? void 0 : value.forEach((item, index)=>{
                const url = resolveAlternateUrl(item.url, metadataBase, pathname);
                result[key][index] = {
                    url,
                    title: item.title
                };
            });
        }
    }
    return result;
}
function resolveCanonicalUrl(urlOrDescriptor, metadataBase, pathname) {
    if (!urlOrDescriptor) return null;
    const url = typeof urlOrDescriptor === "string" || urlOrDescriptor instanceof URL ? urlOrDescriptor : urlOrDescriptor.url;
    // Return string url because structureClone can't handle URL instance
    return {
        url: resolveAlternateUrl(url, metadataBase, pathname)
    };
}
const resolveAlternates = (alternates, metadataBase, { pathname  })=>{
    if (!alternates) return null;
    const canonical = resolveCanonicalUrl(alternates.canonical, metadataBase, pathname);
    const languages = resolveUrlValuesOfObject(alternates.languages, metadataBase, pathname);
    const media = resolveUrlValuesOfObject(alternates.media, metadataBase, pathname);
    const types = resolveUrlValuesOfObject(alternates.types, metadataBase, pathname);
    const result = {
        canonical,
        languages,
        media,
        types
    };
    return result;
};
const robotsKeys = [
    "noarchive",
    "nosnippet",
    "noimageindex",
    "nocache",
    "notranslate",
    "indexifembedded",
    "nositelinkssearchbox",
    "unavailable_after",
    "max-video-preview",
    "max-image-preview",
    "max-snippet"
];
const resolveRobotsValue = (robots)=>{
    if (!robots) return null;
    if (typeof robots === "string") return robots;
    const values = [];
    if (robots.index) values.push("index");
    else if (typeof robots.index === "boolean") values.push("noindex");
    if (robots.follow) values.push("follow");
    else if (typeof robots.follow === "boolean") values.push("nofollow");
    for (const key of robotsKeys){
        const value = robots[key];
        if (typeof value !== "undefined" && value !== false) {
            values.push(typeof value === "boolean" ? key : `${key}:${value}`);
        }
    }
    return values.join(", ");
};
const resolveRobots = (robots)=>{
    if (!robots) return null;
    return {
        basic: resolveRobotsValue(robots),
        googleBot: typeof robots !== "string" ? resolveRobotsValue(robots.googleBot) : null
    };
};
const VerificationKeys = [
    "google",
    "yahoo",
    "yandex",
    "me",
    "other"
];
const resolveVerification = (verification)=>{
    if (!verification) return null;
    const res = {};
    for (const key of VerificationKeys){
        const value = verification[key];
        if (value) {
            if (key === "other") {
                res.other = {};
                for(const otherKey in verification.other){
                    const otherValue = (0, _utils.resolveAsArrayOrUndefined)(verification.other[otherKey]);
                    if (otherValue) res.other[otherKey] = otherValue;
                }
            } else res[key] = (0, _utils.resolveAsArrayOrUndefined)(value);
        }
    }
    return res;
};
const resolveAppleWebApp = (appWebApp)=>{
    var _resolveAsArrayOrUndefined;
    if (!appWebApp) return null;
    if (appWebApp === true) {
        return {
            capable: true
        };
    }
    const startupImages = appWebApp.startupImage ? (_resolveAsArrayOrUndefined = (0, _utils.resolveAsArrayOrUndefined)(appWebApp.startupImage)) == null ? void 0 : _resolveAsArrayOrUndefined.map((item)=>typeof item === "string" ? {
            url: item
        } : item) : null;
    return {
        capable: "capable" in appWebApp ? !!appWebApp.capable : true,
        title: appWebApp.title || null,
        startupImage: startupImages,
        statusBarStyle: appWebApp.statusBarStyle || "default"
    };
};
const resolveAppLinks = (appLinks)=>{
    if (!appLinks) return null;
    for(const key in appLinks){
        // @ts-ignore // TODO: type infer
        appLinks[key] = (0, _utils.resolveAsArrayOrUndefined)(appLinks[key]);
    }
    return appLinks;
};
const resolveItunes = (itunes, metadataBase, { pathname  })=>{
    if (!itunes) return null;
    return {
        appId: itunes.appId,
        appArgument: itunes.appArgument ? resolveAlternateUrl(itunes.appArgument, metadataBase, pathname) : undefined
    };
};

//# sourceMappingURL=resolve-basics.js.map