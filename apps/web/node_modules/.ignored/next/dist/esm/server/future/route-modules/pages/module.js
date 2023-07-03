import { RouteModule } from "../route-module";
import { renderToHTMLImpl } from "../../../render";
export class PagesRouteModule extends RouteModule {
    constructor(options){
        super(options);
        this.components = options.components;
    }
    handle() {
        throw new Error("Method not implemented.");
    }
    render(req, res, context) {
        return renderToHTMLImpl(req, res, context.page, context.query, context.renderOpts, {
            App: this.components.App,
            Document: this.components.Document
        });
    }
}
export default PagesRouteModule;

//# sourceMappingURL=module.js.map