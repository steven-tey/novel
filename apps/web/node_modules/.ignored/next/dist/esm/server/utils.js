import { BLOCKED_PAGES } from "../shared/lib/constants";
export function isBlockedPage(pathname) {
    return BLOCKED_PAGES.includes(pathname);
}
export function cleanAmpPath(pathname) {
    if (pathname.match(/\?amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/\?amp=(y|yes|true|1)&?/, "?");
    }
    if (pathname.match(/&amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/&amp=(y|yes|true|1)/, "");
    }
    pathname = pathname.replace(/\?$/, "");
    return pathname;
}

//# sourceMappingURL=utils.js.map