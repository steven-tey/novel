import { getModuleBuildError } from "./webpackModuleError";
const NAME = "WellKnownErrorsPlugin";
export class WellKnownErrorsPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(NAME, (compilation)=>{
            compilation.hooks.afterSeal.tapPromise(NAME, async ()=>{
                var _compilation_errors;
                if ((_compilation_errors = compilation.errors) == null ? void 0 : _compilation_errors.length) {
                    await Promise.all(compilation.errors.map(async (err, i)=>{
                        try {
                            const moduleError = await getModuleBuildError(compiler, compilation, err);
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