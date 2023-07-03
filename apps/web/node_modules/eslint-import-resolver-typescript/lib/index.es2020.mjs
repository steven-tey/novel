import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import debug from 'debug';
import enhancedResolve from 'enhanced-resolve';
import { hashObject } from 'eslint-module-utils/hash.js';
import { getTsconfig, createPathsMatcher } from 'get-tsconfig';
import isCore from 'is-core-module';
import isGlob from 'is-glob';
import { createSyncFn } from 'synckit';

const IMPORTER_NAME = "eslint-import-resolver-typescript";
const log = debug(IMPORTER_NAME);
const _dirname = typeof __dirname === "undefined" ? path.dirname(fileURLToPath(import.meta.url)) : __dirname;
const globSync = createSyncFn(
  path.resolve(_dirname, "worker.mjs")
);
const defaultConditionNames = [
  "types",
  "import",
  // APF: https://angular.io/guide/angular-package-format
  "esm2020",
  "es2020",
  "es2015",
  "require",
  "node",
  "node-addons",
  "browser",
  "default"
];
const defaultExtensions = [
  ".ts",
  ".tsx",
  ".d.ts",
  ".js",
  ".jsx",
  ".json",
  ".node"
];
const defaultExtensionAlias = {
  ".js": [
    ".ts",
    // `.tsx` can also be compiled as `.js`
    ".tsx",
    ".d.ts",
    ".js"
  ],
  ".jsx": [".tsx", ".d.ts", ".jsx"],
  ".cjs": [".cts", ".d.cts", ".cjs"],
  ".mjs": [".mts", ".d.mts", ".mjs"]
};
const defaultMainFields = [
  "types",
  "typings",
  // APF: https://angular.io/guide/angular-package-format
  "fesm2020",
  "fesm2015",
  "esm2020",
  "es2020",
  "module",
  "jsnext:main",
  "main"
];
const interfaceVersion = 2;
const fileSystem = fs;
const JS_EXT_PATTERN = /\.(?:[cm]js|jsx?)$/;
const RELATIVE_PATH_PATTERN = /^\.{1,2}(?:\/.*)?$/;
let previousOptionsHash;
let optionsHash;
let cachedOptions;
let prevCwd;
let mappersCachedOptions;
let mappers;
let resolverCachedOptions;
let resolver;
const digestHashObject = (value) => hashObject(value ?? {}).digest("hex");
function resolve(source, file, options) {
  if (!cachedOptions || previousOptionsHash !== (optionsHash = digestHashObject(options))) {
    previousOptionsHash = optionsHash;
    cachedOptions = {
      ...options,
      conditionNames: options?.conditionNames ?? defaultConditionNames,
      extensions: options?.extensions ?? defaultExtensions,
      extensionAlias: options?.extensionAlias ?? defaultExtensionAlias,
      mainFields: options?.mainFields ?? defaultMainFields,
      fileSystem: new enhancedResolve.CachedInputFileSystem(
        fileSystem,
        5 * 1e3
      ),
      useSyncFileSystemCalls: true
    };
  }
  if (!resolver || resolverCachedOptions !== cachedOptions) {
    resolver = enhancedResolve.ResolverFactory.createResolver(cachedOptions);
    resolverCachedOptions = cachedOptions;
  }
  log("looking for:", source);
  source = removeQuerystring(source);
  if (isCore(source)) {
    log("matched core:", source);
    return {
      found: true,
      path: null
    };
  }
  initMappers(cachedOptions);
  const mappedPath = getMappedPath(source, file, cachedOptions.extensions, true);
  if (mappedPath) {
    log("matched ts path:", mappedPath);
  }
  let foundNodePath;
  try {
    foundNodePath = resolver.resolveSync(
      {},
      path.dirname(path.resolve(file)),
      mappedPath ?? source
    ) || null;
  } catch {
    foundNodePath = null;
  }
  if ((JS_EXT_PATTERN.test(foundNodePath) || cachedOptions.alwaysTryTypes && !foundNodePath) && !/^@types[/\\]/.test(source) && !path.isAbsolute(source) && !source.startsWith(".")) {
    const definitelyTyped = resolve(
      "@types" + path.sep + mangleScopedPackage(source),
      file,
      options
    );
    if (definitelyTyped.found) {
      return definitelyTyped;
    }
  }
  if (foundNodePath) {
    log("matched node path:", foundNodePath);
    return {
      found: true,
      path: foundNodePath
    };
  }
  log("didn't find ", source);
  return {
    found: false
  };
}
function removeQuerystring(id) {
  const querystringIndex = id.lastIndexOf("?");
  if (querystringIndex >= 0) {
    return id.slice(0, querystringIndex);
  }
  return id;
}
const isFile = (path2) => {
  try {
    return !!(path2 && fs.statSync(path2, { throwIfNoEntry: false })?.isFile());
  } catch {
    return false;
  }
};
const isModule = (modulePath) => {
  return !!modulePath && isFile(path.resolve(modulePath, "package.json"));
};
function getMappedPath(source, file, extensions = defaultExtensions, retry) {
  const originalExtensions = extensions;
  extensions = ["", ...extensions];
  let paths = [];
  if (RELATIVE_PATH_PATTERN.test(source)) {
    const resolved = path.resolve(path.dirname(file), source);
    if (isFile(resolved)) {
      paths = [resolved];
    }
  } else {
    paths = mappers.map(
      (mapper) => mapper?.(source).map((item) => [
        ...extensions.map((ext) => `${item}${ext}`),
        ...originalExtensions.map((ext) => `${item}/index${ext}`)
      ])
    ).flat(2).filter((mappedPath) => {
      if (mappedPath === void 0) {
        return false;
      }
      try {
        const stat = fs.statSync(mappedPath, { throwIfNoEntry: false });
        if (stat === void 0)
          return false;
        if (stat.isFile())
          return true;
        if (stat.isDirectory()) {
          return isModule(mappedPath);
        }
      } catch {
        return false;
      }
      return false;
    });
  }
  if (retry && paths.length === 0) {
    const isJs = JS_EXT_PATTERN.test(source);
    if (isJs) {
      const jsExt = path.extname(source);
      const tsExt = jsExt.replace("js", "ts");
      const basename = source.replace(JS_EXT_PATTERN, "");
      const resolved = getMappedPath(basename + tsExt, file) || getMappedPath(
        basename + ".d" + (tsExt === ".tsx" ? ".ts" : tsExt),
        file
      );
      if (resolved) {
        return resolved;
      }
    }
    for (const ext of extensions) {
      const resolved = (isJs ? null : getMappedPath(source + ext, file)) || getMappedPath(source + `/index${ext}`, file);
      if (resolved) {
        return resolved;
      }
    }
  }
  if (paths.length > 1) {
    log("found multiple matching ts paths:", paths);
  }
  return paths[0];
}
function initMappers(options) {
  if (mappers && mappersCachedOptions === options && prevCwd === process.cwd()) {
    return;
  }
  prevCwd = process.cwd();
  const configPaths = typeof options.project === "string" ? [options.project] : Array.isArray(options.project) ? options.project : [process.cwd()];
  const ignore = ["!**/node_modules/**"];
  const projectPaths = [
    .../* @__PURE__ */ new Set([
      ...configPaths.filter((path2) => !isGlob(path2)),
      ...globSync([...configPaths.filter((path2) => isGlob(path2)), ...ignore])
    ])
  ];
  mappers = projectPaths.map((projectPath) => {
    let tsconfigResult;
    if (isFile(projectPath)) {
      const { dir, base } = path.parse(projectPath);
      tsconfigResult = getTsconfig(dir, base);
    } else {
      tsconfigResult = getTsconfig(projectPath);
    }
    return tsconfigResult && createPathsMatcher(tsconfigResult);
  });
  mappersCachedOptions = options;
}
function mangleScopedPackage(moduleName) {
  if (moduleName.startsWith("@")) {
    const replaceSlash = moduleName.replace(path.sep, "__");
    if (replaceSlash !== moduleName) {
      return replaceSlash.slice(1);
    }
  }
  return moduleName;
}

export { defaultConditionNames, defaultExtensionAlias, defaultExtensions, defaultMainFields, globSync, interfaceVersion, resolve };
