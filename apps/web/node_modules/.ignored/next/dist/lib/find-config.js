"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findConfigPath: null,
    findConfig: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    findConfigPath: function() {
        return findConfigPath;
    },
    findConfig: function() {
        return findConfig;
    }
});
const _findup = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/find-up"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _json5 = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/json5"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function findConfigPath(dir, key) {
    // If we didn't find the configuration in `package.json`, we should look for
    // known filenames.
    return (0, _findup.default)([
        `.${key}rc.json`,
        `${key}.config.json`,
        `.${key}rc.js`,
        `${key}.config.js`,
        `${key}.config.cjs`
    ], {
        cwd: dir
    });
}
async function findConfig(directory, key, _returnFile) {
    // `package.json` configuration always wins. Let's check that first.
    const packageJsonPath = await (0, _findup.default)("package.json", {
        cwd: directory
    });
    if (packageJsonPath) {
        const packageJson = require(packageJsonPath);
        if (packageJson[key] != null && typeof packageJson[key] === "object") {
            return packageJson[key];
        }
    }
    const filePath = await findConfigPath(directory, key);
    if (filePath) {
        if (filePath.endsWith(".js") || filePath.endsWith(".cjs")) {
            return require(filePath);
        }
        // We load JSON contents with JSON5 to allow users to comment in their
        // configuration file. This pattern was popularized by TypeScript.
        const fileContents = _fs.default.readFileSync(filePath, "utf8");
        return _json5.default.parse(fileContents);
    }
    return null;
}

//# sourceMappingURL=find-config.js.map