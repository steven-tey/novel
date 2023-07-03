export function isInternalComponent(pathname) {
    switch(pathname){
        case "next/dist/pages/_app":
        case "next/dist/pages/_document":
            return true;
        default:
            return false;
    }
}

//# sourceMappingURL=is-internal-component.js.map