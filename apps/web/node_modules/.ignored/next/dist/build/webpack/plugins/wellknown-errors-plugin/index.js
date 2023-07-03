"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WellKnownErrorsPlugin", {
    enumerable: true,
    get: function() {
        return WellKnownErrorsPlugin;
    }
});
const _webpackModuleError = require("./webpackModuleError");
const NAME = "WellKnownErrorsPlugin";
class WellKnownErrorsPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(NAME, (compilation)=>{
            compilation.hooks.afterSeal.tapPromise(NAME, async ()=>{
                var _compilation_errors;
                if ((_compilation_errors = compilation.errors) == null ? void 0 : _compilation_errors.length) {
                    await Promise.all(compilation.errors.map(async (err, i)=>{
                        try {
                            const moduleError = await (0, _webpackModuleError.getModuleBuildError)(compiler, compilation, err);
                            if (moduleError !== false) {
                                compilation.errors[i] = moduleError;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }));
                }
            });
        });
    }
}

//# sourceMappingURL=index.js.map