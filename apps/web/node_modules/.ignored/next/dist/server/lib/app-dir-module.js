"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLayoutOrPageModule", {
    enumerable: true,
    get: function() {
        return getLayoutOrPageModule;
    }
});
async function getLayoutOrPageModule(loaderTree) {
    const { layout , page , defaultPage  } = loaderTree[2];
    const isLayout = typeof layout !== "undefined";
    const isPage = typeof page !== "undefined";
    const isDefaultPage = typeof defaultPage !== "undefined" && loaderTree[0] === "__DEFAULT__";
    let value = undefined;
    let modType = undefined;
    if (isLayout) {
        value = await layout[0]();
        modType = "layout";
    } else if (isPage) {
        value = await page[0]();
        modType = "page";
    } else if (isDefaultPage) {
        value = await defaultPage[0]();
        modType = "page";
    }
    return [
        value,
        modType
    ];
}

//# sourceMappingURL=app-dir-module.js.map