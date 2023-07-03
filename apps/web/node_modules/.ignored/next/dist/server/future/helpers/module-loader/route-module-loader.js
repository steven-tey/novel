"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouteModuleLoader", {
    enumerable: true,
    get: function() {
        return RouteModuleLoader;
    }
});
const _nodemoduleloader = require("./node-module-loader");
class RouteModuleLoader {
    static async load(id, loader = new _nodemoduleloader.NodeModuleLoader()) {
        if (process.env.NEXT_RUNTIME !== "edge") {
            const { routeModule  } = await loader.load(id);
            return routeModule;
        }
        throw new Error("RouteModuleLoader is not supported in edge runtime.");
    }
}

//# sourceMappingURL=route-module-loader.js.map