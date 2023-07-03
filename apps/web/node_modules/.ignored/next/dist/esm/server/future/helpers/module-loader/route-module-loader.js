import { NodeModuleLoader } from "./node-module-loader";
export class RouteModuleLoader {
    static async load(id, loader = new NodeModuleLoader()) {
        if (process.env.NEXT_RUNTIME !== "edge") {
            const { routeModule  } = await loader.load(id);
            return routeModule;
        }
        throw new Error("RouteModuleLoader is not supported in edge runtime.");
    }
}

//# sourceMappingURL=route-module-loader.js.map