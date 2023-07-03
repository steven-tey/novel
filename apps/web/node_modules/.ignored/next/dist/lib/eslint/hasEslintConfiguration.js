"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasEslintConfiguration", {
    enumerable: true,
    get: function() {
        return hasEslintConfiguration;
    }
});
const _fs = require("fs");
async function hasEslintConfiguration(eslintrcFile, packageJsonConfig) {
    const configObject = {
        exists: false,
        emptyEslintrc: false,
        emptyPkgJsonConfig: false
    };
    if (eslintrcFile) {
        const content = await _fs.promises.readFile(eslintrcFile, {
            encoding: "utf8"
        }).then((txt)=>txt.trim().replace(/\n/g, ""), ()=>null);
        if (content === "" || content === "{}" || content === "---" || content === "module.exports = {}") {
            return {
                ...configObject,
                emptyEslintrc: true
            };
        }
        return {
            ...configObject,
            exists: true
        };
    } else if (packageJsonConfig == null ? void 0 : packageJsonConfig.eslintConfig) {
        if (Object.keys(packageJsonConfig == null ? void 0 : packageJsonConfig.eslintConfig).length) {
            return {
                ...configObject,
                exists: true
            };
        }
        return {
            ...configObject,
            emptyPkgJsonConfig: true
        };
    }
    return configObject;
}

//# sourceMappingURL=hasEslintConfiguration.js.map