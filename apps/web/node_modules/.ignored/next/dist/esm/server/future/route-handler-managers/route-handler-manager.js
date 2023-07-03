import { NodeModuleLoader } from "../helpers/module-loader/node-module-loader";
import { RouteModuleLoader } from "../helpers/module-loader/route-module-loader";
import { NextRequestAdapter } from "../../web/spec-extension/adapters/next-request";
export class RouteHandlerManager {
    constructor(moduleLoader = new NodeModuleLoader()){
        this.moduleLoader = moduleLoader;
    }
    async handle(match, req, context) {
        // The module supports minimal mode, load the minimal module.
        const module = await RouteModuleLoader.load(match.definition.filename, this.moduleLoader);
        // Convert the BaseNextRequest to a NextRequest.
        const request = NextRequestAdapter.fromBaseNextRequest(req);
        // Get the response from the handler and send it back.
        return await module.handle(request, context);
    }
}

//# sourceMappingURL=route-handler-manager.js.map