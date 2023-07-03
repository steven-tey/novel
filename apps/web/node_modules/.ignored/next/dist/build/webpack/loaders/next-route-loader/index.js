"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRouteLoaderEntry: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRouteLoaderEntry: function() {
        return getRouteLoaderEntry;
    },
    default: function() {
        return _default;
    }
});
const _querystring = require("querystring");
const _getmodulebuildinfo = require("../get-module-build-info");
const _routekind = require("../../../../server/future/route-kind");
const _normalizepagepath = require("../../../../shared/lib/page-path/normalize-page-path");
const _utils = require("../utils");
const _worker = require("../../../worker");
function getRouteLoaderEntry(options) {
    const query = {
        page: options.page,
        preferredRegion: options.preferredRegion,
        absolutePagePath: options.absolutePagePath,
        // These are the path references to the internal components that may be
        // overridden by userland components.
        absoluteAppPath: options.pages["/_app"],
        absoluteDocumentPath: options.pages["/_document"],
        middlewareConfigBase64: (0, _utils.encodeToBase64)(options.middlewareConfig)
    };
    return `next-route-loader?${(0, _querystring.stringify)(query)}!`;
}
/**
 * Handles the `next-route-loader` options.
 * @returns the loader definition function
 */ const loader = function() {
    const { page , preferredRegion , absolutePagePath , absoluteAppPath , absoluteDocumentPath , middlewareConfigBase64  } = this.getOptions();
    // Ensure we only run this loader for as a module.
    if (!this._module) {
        throw new Error("Invariant: expected this to reference a module");
    }
    const middlewareConfig = (0, _utils.decodeFromBase64)(middlewareConfigBase64);
    // Attach build info to the module.
    const buildInfo = (0, _getmodulebuildinfo.getModuleBuildInfo)(this._module);
    buildInfo.route = {
        page,
        absolutePagePath,
        preferredRegion,
        middlewareConfig
    };
    const options = {
        definition: {
            kind: _routekind.RouteKind.PAGES,
            page: (0, _normalizepagepath.normalizePagePath)(page),
            pathname: page,
            // The following aren't used in production.
            bundlePath: "",
            filename: ""
        }
    };
    return `
        // Next.js Route Loader
        import RouteModule from "next/dist/server/future/route-modules/pages/module"
        import { hoist } from "next/dist/build/webpack/loaders/next-route-loader/helpers"

        // Import the app and document modules.
        import * as moduleDocument from ${JSON.stringify(absoluteDocumentPath)}
        import * as moduleApp from ${JSON.stringify(absoluteAppPath)}

        // Import the userland code.
        import * as userland from ${JSON.stringify(absolutePagePath)}

        // Re-export the component (should be the default export).
        export default hoist(userland, "default")

        // Re-export methods.
        export const getStaticProps = hoist(userland, "getStaticProps")
        export const getStaticPaths = hoist(userland, "getStaticPaths")
        export const getServerSideProps = hoist(userland, "getServerSideProps")
        export const config = hoist(userland, "config")
        export const reportWebVitals = hoist(userland, "reportWebVitals")
        ${// When we're building the instrumentation page (only when the
    // instrumentation file conflicts with a page also labeled
    // /instrumentation) hoist the `register` method.
    (0, _worker.isInstrumentationHookFile)(page) ? 'export const register = hoist(userland, "register")' : ""}

        // Re-export legacy methods.
        export const unstable_getStaticProps = hoist(userland, "unstable_getStaticProps")
        export const unstable_getStaticPaths = hoist(userland, "unstable_getStaticPaths")
        export const unstable_getStaticParams = hoist(userland, "unstable_getStaticParams")
        export const unstable_getServerProps = hoist(userland, "unstable_getServerProps")
        export const unstable_getServerSideProps = hoist(userland, "unstable_getServerSideProps")

        // Create and export the route module that will be consumed.
        const options = ${JSON.stringify(options)}
        const routeModule = new RouteModule({
          ...options,
          components: {
            App: moduleApp.default,
            Document: moduleDocument.default,
          },
          userland,
        })
        
        export { routeModule }
    `;
};
const _default = loader;

//# sourceMappingURL=index.js.map