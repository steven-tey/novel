'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};





var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _ignore = require('eslint-module-utils/ignore');
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _path = require('path');
var _readPkgUp2 = require('eslint-module-utils/readPkgUp');var _readPkgUp3 = _interopRequireDefault(_readPkgUp2);
var _object = require('object.values');var _object2 = _interopRequireDefault(_object);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                                                                                                                                                       * @fileOverview Ensures that modules contain exports and/or all
                                                                                                                                                                                                                                                                                                                                                                                                       * modules are consumed within other modules.
                                                                                                                                                                                                                                                                                                                                                                                                       * @author René Fermann
                                                                                                                                                                                                                                                                                                                                                                                                       */var FileEnumerator = void 0;var listFilesToProcess = void 0;
try {var _require =
  require('eslint/use-at-your-own-risk');FileEnumerator = _require.FileEnumerator;
} catch (e) {
  try {var _require2 =

    require('eslint/lib/cli-engine/file-enumerator'); // has been moved to eslint/lib/cli-engine/file-enumerator in version 6
    FileEnumerator = _require2.FileEnumerator;} catch (e) {
    try {
      // eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
      var _require3 = require('eslint/lib/util/glob-utils'),originalListFilesToProcess = _require3.listFilesToProcess;

      // Prevent passing invalid options (extensions array) to old versions of the function.
      // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
      // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
      listFilesToProcess = function listFilesToProcess(src, extensions) {
        return originalListFilesToProcess(src, {
          extensions: extensions });

      };
    } catch (e) {var _require4 =
      require('eslint/lib/util/glob-util'),_originalListFilesToProcess = _require4.listFilesToProcess;

      listFilesToProcess = function listFilesToProcess(src, extensions) {
        var patterns = src.reduce(function (carry, pattern) {
          return carry.concat(extensions.map(function (extension) {
            return (/\*\*|\*\./.test(pattern) ? pattern : String(pattern) + '/**/*' + String(extension));
          }));
        }, src.slice());

        return _originalListFilesToProcess(patterns);
      };
    }
  }
}

if (FileEnumerator) {
  listFilesToProcess = function listFilesToProcess(src, extensions) {
    var e = new FileEnumerator({
      extensions: extensions });


    return Array.from(e.iterateFiles(src), function (_ref) {var filePath = _ref.filePath,ignored = _ref.ignored;return {
        ignored: ignored,
        filename: filePath };});

  };
}

var EXPORT_DEFAULT_DECLARATION = 'ExportDefaultDeclaration';
var EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration';
var EXPORT_ALL_DECLARATION = 'ExportAllDeclaration';
var IMPORT_DECLARATION = 'ImportDeclaration';
var IMPORT_NAMESPACE_SPECIFIER = 'ImportNamespaceSpecifier';
var IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
var VARIABLE_DECLARATION = 'VariableDeclaration';
var FUNCTION_DECLARATION = 'FunctionDeclaration';
var CLASS_DECLARATION = 'ClassDeclaration';
var IDENTIFIER = 'Identifier';
var OBJECT_PATTERN = 'ObjectPattern';
var TS_INTERFACE_DECLARATION = 'TSInterfaceDeclaration';
var TS_TYPE_ALIAS_DECLARATION = 'TSTypeAliasDeclaration';
var TS_ENUM_DECLARATION = 'TSEnumDeclaration';
var DEFAULT = 'default';

function forEachDeclarationIdentifier(declaration, cb) {
  if (declaration) {
    if (
    declaration.type === FUNCTION_DECLARATION ||
    declaration.type === CLASS_DECLARATION ||
    declaration.type === TS_INTERFACE_DECLARATION ||
    declaration.type === TS_TYPE_ALIAS_DECLARATION ||
    declaration.type === TS_ENUM_DECLARATION)
    {
      cb(declaration.id.name);
    } else if (declaration.type === VARIABLE_DECLARATION) {
      declaration.declarations.forEach(function (_ref2) {var id = _ref2.id;
        if (id.type === OBJECT_PATTERN) {
          (0, _ExportMap.recursivePatternCapture)(id, function (pattern) {
            if (pattern.type === IDENTIFIER) {
              cb(pattern.name);
            }
          });
        } else {
          cb(id.name);
        }
      });
    }
  }
}

/**
   * List of imports per file.
   *
   * Represented by a two-level Map to a Set of identifiers. The upper-level Map
   * keys are the paths to the modules containing the imports, while the
   * lower-level Map keys are the paths to the files which are being imported
   * from. Lastly, the Set of identifiers contains either names being imported
   * or a special AST node name listed above (e.g ImportDefaultSpecifier).
   *
   * For example, if we have a file named foo.js containing:
   *
   *   import { o2 } from './bar.js';
   *
   * Then we will have a structure that looks like:
   *
   *   Map { 'foo.js' => Map { 'bar.js' => Set { 'o2' } } }
   *
   * @type {Map<string, Map<string, Set<string>>>}
   */
var importList = new Map();

/**
                             * List of exports per file.
                             *
                             * Represented by a two-level Map to an object of metadata. The upper-level Map
                             * keys are the paths to the modules containing the exports, while the
                             * lower-level Map keys are the specific identifiers or special AST node names
                             * being exported. The leaf-level metadata object at the moment only contains a
                             * `whereUsed` property, which contains a Set of paths to modules that import
                             * the name.
                             *
                             * For example, if we have a file named bar.js containing the following exports:
                             *
                             *   const o2 = 'bar';
                             *   export { o2 };
                             *
                             * And a file named foo.js containing the following import:
                             *
                             *   import { o2 } from './bar.js';
                             *
                             * Then we will have a structure that looks like:
                             *
                             *   Map { 'bar.js' => Map { 'o2' => { whereUsed: Set { 'foo.js' } } } }
                             *
                             * @type {Map<string, Map<string, object>>}
                             */
var exportList = new Map();

var visitorKeyMap = new Map();

var ignoredFiles = new Set();
var filesOutsideSrc = new Set();

var isNodeModule = function isNodeModule(path) {
  return (/\/(node_modules)\//.test(path));
};

/**
    * read all files matching the patterns in src and ignoreExports
    *
    * return all files matching src pattern, which are not matching the ignoreExports pattern
    */
var resolveFiles = function resolveFiles(src, ignoreExports, context) {
  var extensions = Array.from((0, _ignore.getFileExtensions)(context.settings));

  var srcFiles = new Set();
  var srcFileList = listFilesToProcess(src, extensions);

  // prepare list of ignored files
  var ignoredFilesList = listFilesToProcess(ignoreExports, extensions);
  ignoredFilesList.forEach(function (_ref3) {var filename = _ref3.filename;return ignoredFiles.add(filename);});

  // prepare list of source files, don't consider files from node_modules
  srcFileList.filter(function (_ref4) {var filename = _ref4.filename;return !isNodeModule(filename);}).forEach(function (_ref5) {var filename = _ref5.filename;
    srcFiles.add(filename);
  });
  return srcFiles;
};

/**
    * parse all source files and build up 2 maps containing the existing imports and exports
    */
var prepareImportsAndExports = function prepareImportsAndExports(srcFiles, context) {
  var exportAll = new Map();
  srcFiles.forEach(function (file) {
    var exports = new Map();
    var imports = new Map();
    var currentExports = _ExportMap2['default'].get(file, context);
    if (currentExports) {var

      dependencies =




      currentExports.dependencies,reexports = currentExports.reexports,localImportList = currentExports.imports,namespace = currentExports.namespace,visitorKeys = currentExports.visitorKeys;

      visitorKeyMap.set(file, visitorKeys);
      // dependencies === export * from
      var currentExportAll = new Set();
      dependencies.forEach(function (getDependency) {
        var dependency = getDependency();
        if (dependency === null) {
          return;
        }

        currentExportAll.add(dependency.path);
      });
      exportAll.set(file, currentExportAll);

      reexports.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
        var reexport = value.getImport();
        if (!reexport) {
          return;
        }
        var localImport = imports.get(reexport.path);
        var currentValue = void 0;
        if (value.local === DEFAULT) {
          currentValue = IMPORT_DEFAULT_SPECIFIER;
        } else {
          currentValue = value.local;
        }
        if (typeof localImport !== 'undefined') {
          localImport = new Set([].concat(_toConsumableArray(localImport), [currentValue]));
        } else {
          localImport = new Set([currentValue]);
        }
        imports.set(reexport.path, localImport);
      });

      localImportList.forEach(function (value, key) {
        if (isNodeModule(key)) {
          return;
        }
        var localImport = imports.get(key) || new Set();
        value.declarations.forEach(function (_ref6) {var importedSpecifiers = _ref6.importedSpecifiers;return (
            importedSpecifiers.forEach(function (specifier) {return localImport.add(specifier);}));});

        imports.set(key, localImport);
      });
      importList.set(file, imports);

      // build up export list only, if file is not ignored
      if (ignoredFiles.has(file)) {
        return;
      }
      namespace.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
      });
    }
    exports.set(EXPORT_ALL_DECLARATION, { whereUsed: new Set() });
    exports.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: new Set() });
    exportList.set(file, exports);
  });
  exportAll.forEach(function (value, key) {
    value.forEach(function (val) {
      var currentExports = exportList.get(val);
      if (currentExports) {
        var currentExport = currentExports.get(EXPORT_ALL_DECLARATION);
        currentExport.whereUsed.add(key);
      }
    });
  });
};

/**
    * traverse through all imports and add the respective path to the whereUsed-list
    * of the corresponding export
    */
var determineUsage = function determineUsage() {
  importList.forEach(function (listValue, listKey) {
    listValue.forEach(function (value, key) {
      var exports = exportList.get(key);
      if (typeof exports !== 'undefined') {
        value.forEach(function (currentImport) {
          var specifier = void 0;
          if (currentImport === IMPORT_NAMESPACE_SPECIFIER) {
            specifier = IMPORT_NAMESPACE_SPECIFIER;
          } else if (currentImport === IMPORT_DEFAULT_SPECIFIER) {
            specifier = IMPORT_DEFAULT_SPECIFIER;
          } else {
            specifier = currentImport;
          }
          if (typeof specifier !== 'undefined') {
            var exportStatement = exports.get(specifier);
            if (typeof exportStatement !== 'undefined') {var
              whereUsed = exportStatement.whereUsed;
              whereUsed.add(listKey);
              exports.set(specifier, { whereUsed: whereUsed });
            }
          }
        });
      }
    });
  });
};

var getSrc = function getSrc(src) {
  if (src) {
    return src;
  }
  return [process.cwd()];
};

/**
    * prepare the lists of existing imports and exports - should only be executed once at
    * the start of a new eslint run
    */
var srcFiles = void 0;
var lastPrepareKey = void 0;
var doPreparation = function doPreparation(src, ignoreExports, context) {
  var prepareKey = JSON.stringify({
    src: (src || []).sort(),
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from((0, _ignore.getFileExtensions)(context.settings)).sort() });

  if (prepareKey === lastPrepareKey) {
    return;
  }

  importList.clear();
  exportList.clear();
  ignoredFiles.clear();
  filesOutsideSrc.clear();

  srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
  prepareImportsAndExports(srcFiles, context);
  determineUsage();
  lastPrepareKey = prepareKey;
};

var newNamespaceImportExists = function newNamespaceImportExists(specifiers) {return (
    specifiers.some(function (_ref7) {var type = _ref7.type;return type === IMPORT_NAMESPACE_SPECIFIER;}));};

var newDefaultImportExists = function newDefaultImportExists(specifiers) {return (
    specifiers.some(function (_ref8) {var type = _ref8.type;return type === IMPORT_DEFAULT_SPECIFIER;}));};

var fileIsInPkg = function fileIsInPkg(file) {var _readPkgUp =
  (0, _readPkgUp3['default'])({ cwd: file }),path = _readPkgUp.path,pkg = _readPkgUp.pkg;
  var basePath = (0, _path.dirname)(path);

  var checkPkgFieldString = function checkPkgFieldString(pkgField) {
    if ((0, _path.join)(basePath, pkgField) === file) {
      return true;
    }
  };

  var checkPkgFieldObject = function checkPkgFieldObject(pkgField) {
    var pkgFieldFiles = (0, _object2['default'])(pkgField).
    filter(function (value) {return typeof value !== 'boolean';}).
    map(function (value) {return (0, _path.join)(basePath, value);});

    if ((0, _arrayIncludes2['default'])(pkgFieldFiles, file)) {
      return true;
    }
  };

  var checkPkgField = function checkPkgField(pkgField) {
    if (typeof pkgField === 'string') {
      return checkPkgFieldString(pkgField);
    }

    if ((typeof pkgField === 'undefined' ? 'undefined' : _typeof(pkgField)) === 'object') {
      return checkPkgFieldObject(pkgField);
    }
  };

  if (pkg['private'] === true) {
    return false;
  }

  if (pkg.bin) {
    if (checkPkgField(pkg.bin)) {
      return true;
    }
  }

  if (pkg.browser) {
    if (checkPkgField(pkg.browser)) {
      return true;
    }
  }

  if (pkg.main) {
    if (checkPkgFieldString(pkg.main)) {
      return true;
    }
  }

  return false;
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid modules without exports, or exports without matching import in another module.',
      url: (0, _docsUrl2['default'])('no-unused-modules') },

    schema: [{
      properties: {
        src: {
          description: 'files/paths to be analyzed (only for unused exports)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        ignoreExports: {
          description:
          'files/paths for which unused exports will not be reported (e.g module entry points)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        missingExports: {
          description: 'report modules without any exports',
          type: 'boolean' },

        unusedExports: {
          description: 'report exports without any usage',
          type: 'boolean' } },


      not: {
        properties: {
          unusedExports: { 'enum': [false] },
          missingExports: { 'enum': [false] } } },


      anyOf: [{
        not: {
          properties: {
            unusedExports: { 'enum': [true] } } },


        required: ['missingExports'] },
      {
        not: {
          properties: {
            missingExports: { 'enum': [true] } } },


        required: ['unusedExports'] },
      {
        properties: {
          unusedExports: { 'enum': [true] } },

        required: ['unusedExports'] },
      {
        properties: {
          missingExports: { 'enum': [true] } },

        required: ['missingExports'] }] }] },




  create: function () {function create(context) {var _ref9 =





      context.options[0] || {},src = _ref9.src,_ref9$ignoreExports = _ref9.ignoreExports,ignoreExports = _ref9$ignoreExports === undefined ? [] : _ref9$ignoreExports,missingExports = _ref9.missingExports,unusedExports = _ref9.unusedExports;

      if (unusedExports) {
        doPreparation(src, ignoreExports, context);
      }

      var file = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

      var checkExportPresence = function () {function checkExportPresence(node) {
          if (!missingExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          var exportCount = exportList.get(file);
          var exportAll = exportCount.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exportCount.get(IMPORT_NAMESPACE_SPECIFIER);

          exportCount['delete'](EXPORT_ALL_DECLARATION);
          exportCount['delete'](IMPORT_NAMESPACE_SPECIFIER);
          if (exportCount.size < 1) {
            // node.body[0] === 'undefined' only happens, if everything is commented out in the file
            // being linted
            context.report(node.body[0] ? node.body[0] : node, 'No exports found');
          }
          exportCount.set(EXPORT_ALL_DECLARATION, exportAll);
          exportCount.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
        }return checkExportPresence;}();

      var checkUsage = function () {function checkUsage(node, exportedValue) {
          if (!unusedExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          if (fileIsInPkg(file)) {
            return;
          }

          if (filesOutsideSrc.has(file)) {
            return;
          }

          // make sure file to be linted is included in source files
          if (!srcFiles.has(file)) {
            srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
            if (!srcFiles.has(file)) {
              filesOutsideSrc.add(file);
              return;
            }
          }

          exports = exportList.get(file);

          // special case: export * from
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          if (typeof exportAll !== 'undefined' && exportedValue !== IMPORT_DEFAULT_SPECIFIER) {
            if (exportAll.whereUsed.size > 0) {
              return;
            }
          }

          // special case: namespace import
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);
          if (typeof namespaceImports !== 'undefined') {
            if (namespaceImports.whereUsed.size > 0) {
              return;
            }
          }

          // exportsList will always map any imported value of 'default' to 'ImportDefaultSpecifier'
          var exportsKey = exportedValue === DEFAULT ? IMPORT_DEFAULT_SPECIFIER : exportedValue;

          var exportStatement = exports.get(exportsKey);

          var value = exportsKey === IMPORT_DEFAULT_SPECIFIER ? DEFAULT : exportsKey;

          if (typeof exportStatement !== 'undefined') {
            if (exportStatement.whereUsed.size < 1) {
              context.report(
              node, 'exported declaration \'' +
              value + '\' not used within other modules');

            }
          } else {
            context.report(
            node, 'exported declaration \'' +
            value + '\' not used within other modules');

          }
        }return checkUsage;}();

      /**
                                 * only useful for tools like vscode-eslint
                                 *
                                 * update lists of existing exports during runtime
                                 */
      var updateExportUsage = function () {function updateExportUsage(node) {
          if (ignoredFiles.has(file)) {
            return;
          }

          var exports = exportList.get(file);

          // new module has been created during runtime
          // include it in further processing
          if (typeof exports === 'undefined') {
            exports = new Map();
          }

          var newExports = new Map();
          var newExportIdentifiers = new Set();

          node.body.forEach(function (_ref10) {var type = _ref10.type,declaration = _ref10.declaration,specifiers = _ref10.specifiers;
            if (type === EXPORT_DEFAULT_DECLARATION) {
              newExportIdentifiers.add(IMPORT_DEFAULT_SPECIFIER);
            }
            if (type === EXPORT_NAMED_DECLARATION) {
              if (specifiers.length > 0) {
                specifiers.forEach(function (specifier) {
                  if (specifier.exported) {
                    newExportIdentifiers.add(specifier.exported.name || specifier.exported.value);
                  }
                });
              }
              forEachDeclarationIdentifier(declaration, function (name) {
                newExportIdentifiers.add(name);
              });
            }
          });

          // old exports exist within list of new exports identifiers: add to map of new exports
          exports.forEach(function (value, key) {
            if (newExportIdentifiers.has(key)) {
              newExports.set(key, value);
            }
          });

          // new export identifiers added: add to map of new exports
          newExportIdentifiers.forEach(function (key) {
            if (!exports.has(key)) {
              newExports.set(key, { whereUsed: new Set() });
            }
          });

          // preserve information about namespace imports
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);

          if (typeof namespaceImports === 'undefined') {
            namespaceImports = { whereUsed: new Set() };
          }

          newExports.set(EXPORT_ALL_DECLARATION, exportAll);
          newExports.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
          exportList.set(file, newExports);
        }return updateExportUsage;}();

      /**
                                        * only useful for tools like vscode-eslint
                                        *
                                        * update lists of existing imports during runtime
                                        */
      var updateImportUsage = function () {function updateImportUsage(node) {
          if (!unusedExports) {
            return;
          }

          var oldImportPaths = importList.get(file);
          if (typeof oldImportPaths === 'undefined') {
            oldImportPaths = new Map();
          }

          var oldNamespaceImports = new Set();
          var newNamespaceImports = new Set();

          var oldExportAll = new Set();
          var newExportAll = new Set();

          var oldDefaultImports = new Set();
          var newDefaultImports = new Set();

          var oldImports = new Map();
          var newImports = new Map();
          oldImportPaths.forEach(function (value, key) {
            if (value.has(EXPORT_ALL_DECLARATION)) {
              oldExportAll.add(key);
            }
            if (value.has(IMPORT_NAMESPACE_SPECIFIER)) {
              oldNamespaceImports.add(key);
            }
            if (value.has(IMPORT_DEFAULT_SPECIFIER)) {
              oldDefaultImports.add(key);
            }
            value.forEach(function (val) {
              if (val !== IMPORT_NAMESPACE_SPECIFIER &&
              val !== IMPORT_DEFAULT_SPECIFIER) {
                oldImports.set(val, key);
              }
            });
          });

          function processDynamicImport(source) {
            if (source.type !== 'Literal') {
              return null;
            }
            var p = (0, _resolve2['default'])(source.value, context);
            if (p == null) {
              return null;
            }
            newNamespaceImports.add(p);
          }

          (0, _visit2['default'])(node, visitorKeyMap.get(file), {
            ImportExpression: function () {function ImportExpression(child) {
                processDynamicImport(child.source);
              }return ImportExpression;}(),
            CallExpression: function () {function CallExpression(child) {
                if (child.callee.type === 'Import') {
                  processDynamicImport(child.arguments[0]);
                }
              }return CallExpression;}() });


          node.body.forEach(function (astNode) {
            var resolvedPath = void 0;

            // support for export { value } from 'module'
            if (astNode.type === EXPORT_NAMED_DECLARATION) {
              if (astNode.source) {
                resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
                astNode.specifiers.forEach(function (specifier) {
                  var name = specifier.local.name || specifier.local.value;
                  if (name === DEFAULT) {
                    newDefaultImports.add(resolvedPath);
                  } else {
                    newImports.set(name, resolvedPath);
                  }
                });
              }
            }

            if (astNode.type === EXPORT_ALL_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              newExportAll.add(resolvedPath);
            }

            if (astNode.type === IMPORT_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              if (!resolvedPath) {
                return;
              }

              if (isNodeModule(resolvedPath)) {
                return;
              }

              if (newNamespaceImportExists(astNode.specifiers)) {
                newNamespaceImports.add(resolvedPath);
              }

              if (newDefaultImportExists(astNode.specifiers)) {
                newDefaultImports.add(resolvedPath);
              }

              astNode.specifiers.forEach(function (specifier) {
                if (specifier.type === IMPORT_DEFAULT_SPECIFIER ||
                specifier.type === IMPORT_NAMESPACE_SPECIFIER) {
                  return;
                }
                newImports.set(specifier.imported.name || specifier.imported.value, resolvedPath);
              });
            }
          });

          newExportAll.forEach(function (value) {
            if (!oldExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(EXPORT_ALL_DECLARATION);
              oldImportPaths.set(value, imports);

              var _exports = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports !== 'undefined') {
                currentExport = _exports.get(EXPORT_ALL_DECLARATION);
              } else {
                _exports = new Map();
                exportList.set(value, _exports);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports.set(EXPORT_ALL_DECLARATION, { whereUsed: whereUsed });
              }
            }
          });

          oldExportAll.forEach(function (value) {
            if (!newExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](EXPORT_ALL_DECLARATION);

              var _exports2 = exportList.get(value);
              if (typeof _exports2 !== 'undefined') {
                var currentExport = _exports2.get(EXPORT_ALL_DECLARATION);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newDefaultImports.forEach(function (value) {
            if (!oldDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_DEFAULT_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports3 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports3 !== 'undefined') {
                currentExport = _exports3.get(IMPORT_DEFAULT_SPECIFIER);
              } else {
                _exports3 = new Map();
                exportList.set(value, _exports3);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports3.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldDefaultImports.forEach(function (value) {
            if (!newDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_DEFAULT_SPECIFIER);

              var _exports4 = exportList.get(value);
              if (typeof _exports4 !== 'undefined') {
                var currentExport = _exports4.get(IMPORT_DEFAULT_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newNamespaceImports.forEach(function (value) {
            if (!oldNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_NAMESPACE_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports5 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports5 !== 'undefined') {
                currentExport = _exports5.get(IMPORT_NAMESPACE_SPECIFIER);
              } else {
                _exports5 = new Map();
                exportList.set(value, _exports5);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports5.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldNamespaceImports.forEach(function (value) {
            if (!newNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_NAMESPACE_SPECIFIER);

              var _exports6 = exportList.get(value);
              if (typeof _exports6 !== 'undefined') {
                var currentExport = _exports6.get(IMPORT_NAMESPACE_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newImports.forEach(function (value, key) {
            if (!oldImports.has(key)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(key);
              oldImportPaths.set(value, imports);

              var _exports7 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports7 !== 'undefined') {
                currentExport = _exports7.get(key);
              } else {
                _exports7 = new Map();
                exportList.set(value, _exports7);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports7.set(key, { whereUsed: whereUsed });
              }
            }
          });

          oldImports.forEach(function (value, key) {
            if (!newImports.has(key)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](key);

              var _exports8 = exportList.get(value);
              if (typeof _exports8 !== 'undefined') {
                var currentExport = _exports8.get(key);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });
        }return updateImportUsage;}();

      return {
        'Program:exit': function () {function ProgramExit(node) {
            updateExportUsage(node);
            updateImportUsage(node);
            checkExportPresence(node);
          }return ProgramExit;}(),
        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration(node) {
            checkUsage(node, IMPORT_DEFAULT_SPECIFIER);
          }return ExportDefaultDeclaration;}(),
        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            node.specifiers.forEach(function (specifier) {
              checkUsage(node, specifier.exported.name || specifier.exported.value);
            });
            forEachDeclarationIdentifier(node.declaration, function (name) {
              checkUsage(node, name);
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bnVzZWQtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJGaWxlRW51bWVyYXRvciIsImxpc3RGaWxlc1RvUHJvY2VzcyIsInJlcXVpcmUiLCJlIiwib3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MiLCJzcmMiLCJleHRlbnNpb25zIiwicGF0dGVybnMiLCJyZWR1Y2UiLCJjYXJyeSIsInBhdHRlcm4iLCJjb25jYXQiLCJtYXAiLCJleHRlbnNpb24iLCJ0ZXN0Iiwic2xpY2UiLCJBcnJheSIsImZyb20iLCJpdGVyYXRlRmlsZXMiLCJmaWxlUGF0aCIsImlnbm9yZWQiLCJmaWxlbmFtZSIsIkVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OIiwiRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OIiwiRVhQT1JUX0FMTF9ERUNMQVJBVElPTiIsIklNUE9SVF9ERUNMQVJBVElPTiIsIklNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSIiwiSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSIiwiVkFSSUFCTEVfREVDTEFSQVRJT04iLCJGVU5DVElPTl9ERUNMQVJBVElPTiIsIkNMQVNTX0RFQ0xBUkFUSU9OIiwiSURFTlRJRklFUiIsIk9CSkVDVF9QQVRURVJOIiwiVFNfSU5URVJGQUNFX0RFQ0xBUkFUSU9OIiwiVFNfVFlQRV9BTElBU19ERUNMQVJBVElPTiIsIlRTX0VOVU1fREVDTEFSQVRJT04iLCJERUZBVUxUIiwiZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllciIsImRlY2xhcmF0aW9uIiwiY2IiLCJ0eXBlIiwiaWQiLCJuYW1lIiwiZGVjbGFyYXRpb25zIiwiZm9yRWFjaCIsImltcG9ydExpc3QiLCJNYXAiLCJleHBvcnRMaXN0IiwidmlzaXRvcktleU1hcCIsImlnbm9yZWRGaWxlcyIsIlNldCIsImZpbGVzT3V0c2lkZVNyYyIsImlzTm9kZU1vZHVsZSIsInBhdGgiLCJyZXNvbHZlRmlsZXMiLCJpZ25vcmVFeHBvcnRzIiwiY29udGV4dCIsInNldHRpbmdzIiwic3JjRmlsZXMiLCJzcmNGaWxlTGlzdCIsImlnbm9yZWRGaWxlc0xpc3QiLCJhZGQiLCJmaWx0ZXIiLCJwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMiLCJleHBvcnRBbGwiLCJleHBvcnRzIiwiaW1wb3J0cyIsImN1cnJlbnRFeHBvcnRzIiwiRXhwb3J0cyIsImdldCIsImZpbGUiLCJkZXBlbmRlbmNpZXMiLCJyZWV4cG9ydHMiLCJsb2NhbEltcG9ydExpc3QiLCJuYW1lc3BhY2UiLCJ2aXNpdG9yS2V5cyIsInNldCIsImN1cnJlbnRFeHBvcnRBbGwiLCJkZXBlbmRlbmN5IiwiZ2V0RGVwZW5kZW5jeSIsInZhbHVlIiwia2V5Iiwid2hlcmVVc2VkIiwicmVleHBvcnQiLCJnZXRJbXBvcnQiLCJsb2NhbEltcG9ydCIsImN1cnJlbnRWYWx1ZSIsImxvY2FsIiwiaW1wb3J0ZWRTcGVjaWZpZXJzIiwic3BlY2lmaWVyIiwiaGFzIiwidmFsIiwiY3VycmVudEV4cG9ydCIsImRldGVybWluZVVzYWdlIiwibGlzdFZhbHVlIiwibGlzdEtleSIsImN1cnJlbnRJbXBvcnQiLCJleHBvcnRTdGF0ZW1lbnQiLCJnZXRTcmMiLCJwcm9jZXNzIiwiY3dkIiwibGFzdFByZXBhcmVLZXkiLCJkb1ByZXBhcmF0aW9uIiwicHJlcGFyZUtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzb3J0IiwiY2xlYXIiLCJuZXdOYW1lc3BhY2VJbXBvcnRFeGlzdHMiLCJzcGVjaWZpZXJzIiwic29tZSIsIm5ld0RlZmF1bHRJbXBvcnRFeGlzdHMiLCJmaWxlSXNJblBrZyIsInBrZyIsImJhc2VQYXRoIiwiY2hlY2tQa2dGaWVsZFN0cmluZyIsInBrZ0ZpZWxkIiwiY2hlY2tQa2dGaWVsZE9iamVjdCIsInBrZ0ZpZWxkRmlsZXMiLCJjaGVja1BrZ0ZpZWxkIiwiYmluIiwiYnJvd3NlciIsIm1haW4iLCJtb2R1bGUiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwibWluSXRlbXMiLCJpdGVtcyIsIm1pbkxlbmd0aCIsIm1pc3NpbmdFeHBvcnRzIiwidW51c2VkRXhwb3J0cyIsIm5vdCIsImFueU9mIiwicmVxdWlyZWQiLCJjcmVhdGUiLCJvcHRpb25zIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiY2hlY2tFeHBvcnRQcmVzZW5jZSIsImV4cG9ydENvdW50IiwibmFtZXNwYWNlSW1wb3J0cyIsInNpemUiLCJyZXBvcnQiLCJub2RlIiwiYm9keSIsImNoZWNrVXNhZ2UiLCJleHBvcnRlZFZhbHVlIiwiZXhwb3J0c0tleSIsInVwZGF0ZUV4cG9ydFVzYWdlIiwibmV3RXhwb3J0cyIsIm5ld0V4cG9ydElkZW50aWZpZXJzIiwibGVuZ3RoIiwiZXhwb3J0ZWQiLCJ1cGRhdGVJbXBvcnRVc2FnZSIsIm9sZEltcG9ydFBhdGhzIiwib2xkTmFtZXNwYWNlSW1wb3J0cyIsIm5ld05hbWVzcGFjZUltcG9ydHMiLCJvbGRFeHBvcnRBbGwiLCJuZXdFeHBvcnRBbGwiLCJvbGREZWZhdWx0SW1wb3J0cyIsIm5ld0RlZmF1bHRJbXBvcnRzIiwib2xkSW1wb3J0cyIsIm5ld0ltcG9ydHMiLCJwcm9jZXNzRHluYW1pY0ltcG9ydCIsInNvdXJjZSIsInAiLCJJbXBvcnRFeHByZXNzaW9uIiwiY2hpbGQiLCJDYWxsRXhwcmVzc2lvbiIsImNhbGxlZSIsImFyZ3VtZW50cyIsInJlc29sdmVkUGF0aCIsImFzdE5vZGUiLCJyYXciLCJyZXBsYWNlIiwiaW1wb3J0ZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLHlDO0FBQ0E7QUFDQSxzRDtBQUNBLGtEO0FBQ0EscUM7QUFDQTtBQUNBLDJEO0FBQ0EsdUM7QUFDQSwrQyx1VkFkQTs7Ozt5WUFnQkEsSUFBSUEsdUJBQUosQ0FDQSxJQUFJQywyQkFBSjtBQUVBLElBQUk7QUFDb0JDLFVBQVEsNkJBQVIsQ0FEcEIsQ0FDQ0YsY0FERCxZQUNDQSxjQUREO0FBRUgsQ0FGRCxDQUVFLE9BQU9HLENBQVAsRUFB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YUFGRDtBQUdBM0MseUNBQTZCK0csS0FBSzlHLFdBQWxDLEVBQStDLFVBQUNJLElBQUQsRUFBVTtBQUN2RDRHLHlCQUFXRixJQUFYLEVBQWlCMUcsSUFBakI7QUFDRCxhQUZEO0FBR0QsV0FQRCxpQ0FUSyxFQUFQOztBQWtCRCxLQTlkRCxpQkF4RWUsRUFBakIiLCJmaWxlIjoibm8tdW51c2VkLW1vZHVsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgRW5zdXJlcyB0aGF0IG1vZHVsZXMgY29udGFpbiBleHBvcnRzIGFuZC9vciBhbGxcbiAqIG1vZHVsZXMgYXJlIGNvbnN1bWVkIHdpdGhpbiBvdGhlciBtb2R1bGVzLlxuICogQGF1dGhvciBSZW7DqSBGZXJtYW5uXG4gKi9cblxuaW1wb3J0IEV4cG9ydHMsIHsgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUgfSBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IHsgZ2V0RmlsZUV4dGVuc2lvbnMgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IHZpc2l0IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvdmlzaXQnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5pbXBvcnQgeyBkaXJuYW1lLCBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhZFBrZ1VwIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVhZFBrZ1VwJztcbmltcG9ydCB2YWx1ZXMgZnJvbSAnb2JqZWN0LnZhbHVlcyc7XG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnYXJyYXktaW5jbHVkZXMnO1xuXG5sZXQgRmlsZUVudW1lcmF0b3I7XG5sZXQgbGlzdEZpbGVzVG9Qcm9jZXNzO1xuXG50cnkge1xuICAoeyBGaWxlRW51bWVyYXRvciB9ID0gcmVxdWlyZSgnZXNsaW50L3VzZS1hdC15b3VyLW93bi1yaXNrJykpO1xufSBjYXRjaCAoZSkge1xuICB0cnkge1xuICAgIC8vIGhhcyBiZWVuIG1vdmVkIHRvIGVzbGludC9saWIvY2xpLWVuZ2luZS9maWxlLWVudW1lcmF0b3IgaW4gdmVyc2lvbiA2XG4gICAgKHsgRmlsZUVudW1lcmF0b3IgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvY2xpLWVuZ2luZS9maWxlLWVudW1lcmF0b3InKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgLy8gZXNsaW50L2xpYi91dGlsL2dsb2ItdXRpbCBoYXMgYmVlbiBtb3ZlZCB0byBlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlscyB3aXRoIHZlcnNpb24gNS4zXG4gICAgICBjb25zdCB7IGxpc3RGaWxlc1RvUHJvY2Vzczogb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzJyk7XG5cbiAgICAgIC8vIFByZXZlbnQgcGFzc2luZyBpbnZhbGlkIG9wdGlvbnMgKGV4dGVuc2lvbnMgYXJyYXkpIHRvIG9sZCB2ZXJzaW9ucyBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9ibG9iL3Y1LjE2LjAvbGliL3V0aWwvZ2xvYi11dGlscy5qcyNMMTc4LUwyODBcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L2Jsb2IvdjUuMi4wL2xpYi91dGlsL2dsb2ItdXRpbC5qcyNMMTc0LUwyNjlcbiAgICAgIGxpc3RGaWxlc1RvUHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywge1xuICAgICAgICAgIGV4dGVuc2lvbnMsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCB7IGxpc3RGaWxlc1RvUHJvY2Vzczogb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWwnKTtcblxuICAgICAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgICAgICBjb25zdCBwYXR0ZXJucyA9IHNyYy5yZWR1Y2UoKGNhcnJ5LCBwYXR0ZXJuKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhcnJ5LmNvbmNhdChleHRlbnNpb25zLm1hcCgoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gL1xcKlxcKnxcXCpcXC4vLnRlc3QocGF0dGVybikgPyBwYXR0ZXJuIDogYCR7cGF0dGVybn0vKiovKiR7ZXh0ZW5zaW9ufWA7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9LCBzcmMuc2xpY2UoKSk7XG5cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHBhdHRlcm5zKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG5cbmlmIChGaWxlRW51bWVyYXRvcikge1xuICBsaXN0RmlsZXNUb1Byb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBleHRlbnNpb25zKSB7XG4gICAgY29uc3QgZSA9IG5ldyBGaWxlRW51bWVyYXRvcih7XG4gICAgICBleHRlbnNpb25zLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZS5pdGVyYXRlRmlsZXMoc3JjKSwgKHsgZmlsZVBhdGgsIGlnbm9yZWQgfSkgPT4gKHtcbiAgICAgIGlnbm9yZWQsXG4gICAgICBmaWxlbmFtZTogZmlsZVBhdGgsXG4gICAgfSkpO1xuICB9O1xufVxuXG5jb25zdCBFWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTiA9ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nO1xuY29uc3QgRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OID0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nO1xuY29uc3QgRVhQT1JUX0FMTF9ERUNMQVJBVElPTiA9ICdFeHBvcnRBbGxEZWNsYXJhdGlvbic7XG5jb25zdCBJTVBPUlRfREVDTEFSQVRJT04gPSAnSW1wb3J0RGVjbGFyYXRpb24nO1xuY29uc3QgSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIgPSAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJztcbmNvbnN0IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA9ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJztcbmNvbnN0IFZBUklBQkxFX0RFQ0xBUkFUSU9OID0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nO1xuY29uc3QgRlVOQ1RJT05fREVDTEFSQVRJT04gPSAnRnVuY3Rpb25EZWNsYXJhdGlvbic7XG5jb25zdCBDTEFTU19ERUNMQVJBVElPTiA9ICdDbGFzc0RlY2xhcmF0aW9uJztcbmNvbnN0IElERU5USUZJRVIgPSAnSWRlbnRpZmllcic7XG5jb25zdCBPQkpFQ1RfUEFUVEVSTiA9ICdPYmplY3RQYXR0ZXJuJztcbmNvbnN0IFRTX0lOVEVSRkFDRV9ERUNMQVJBVElPTiA9ICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJztcbmNvbnN0IFRTX1RZUEVfQUxJQVNfREVDTEFSQVRJT04gPSAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbic7XG5jb25zdCBUU19FTlVNX0RFQ0xBUkFUSU9OID0gJ1RTRW51bURlY2xhcmF0aW9uJztcbmNvbnN0IERFRkFVTFQgPSAnZGVmYXVsdCc7XG5cbmZ1bmN0aW9uIGZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIoZGVjbGFyYXRpb24sIGNiKSB7XG4gIGlmIChkZWNsYXJhdGlvbikge1xuICAgIGlmIChcbiAgICAgIGRlY2xhcmF0aW9uLnR5cGUgPT09IEZVTkNUSU9OX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBDTEFTU19ERUNMQVJBVElPTiB8fFxuICAgICAgZGVjbGFyYXRpb24udHlwZSA9PT0gVFNfSU5URVJGQUNFX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBUU19UWVBFX0FMSUFTX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBUU19FTlVNX0RFQ0xBUkFUSU9OXG4gICAgKSB7XG4gICAgICBjYihkZWNsYXJhdGlvbi5pZC5uYW1lKTtcbiAgICB9IGVsc2UgaWYgKGRlY2xhcmF0aW9uLnR5cGUgPT09IFZBUklBQkxFX0RFQ0xBUkFUSU9OKSB7XG4gICAgICBkZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoeyBpZCB9KSA9PiB7XG4gICAgICAgIGlmIChpZC50eXBlID09PSBPQkpFQ1RfUEFUVEVSTikge1xuICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGlkLCAocGF0dGVybikgPT4ge1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4udHlwZSA9PT0gSURFTlRJRklFUikge1xuICAgICAgICAgICAgICBjYihwYXR0ZXJuLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNiKGlkLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBMaXN0IG9mIGltcG9ydHMgcGVyIGZpbGUuXG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSB0d28tbGV2ZWwgTWFwIHRvIGEgU2V0IG9mIGlkZW50aWZpZXJzLiBUaGUgdXBwZXItbGV2ZWwgTWFwXG4gKiBrZXlzIGFyZSB0aGUgcGF0aHMgdG8gdGhlIG1vZHVsZXMgY29udGFpbmluZyB0aGUgaW1wb3J0cywgd2hpbGUgdGhlXG4gKiBsb3dlci1sZXZlbCBNYXAga2V5cyBhcmUgdGhlIHBhdGhzIHRvIHRoZSBmaWxlcyB3aGljaCBhcmUgYmVpbmcgaW1wb3J0ZWRcbiAqIGZyb20uIExhc3RseSwgdGhlIFNldCBvZiBpZGVudGlmaWVycyBjb250YWlucyBlaXRoZXIgbmFtZXMgYmVpbmcgaW1wb3J0ZWRcbiAqIG9yIGEgc3BlY2lhbCBBU1Qgbm9kZSBuYW1lIGxpc3RlZCBhYm92ZSAoZS5nIEltcG9ydERlZmF1bHRTcGVjaWZpZXIpLlxuICpcbiAqIEZvciBleGFtcGxlLCBpZiB3ZSBoYXZlIGEgZmlsZSBuYW1lZCBmb28uanMgY29udGFpbmluZzpcbiAqXG4gKiAgIGltcG9ydCB7IG8yIH0gZnJvbSAnLi9iYXIuanMnO1xuICpcbiAqIFRoZW4gd2Ugd2lsbCBoYXZlIGEgc3RydWN0dXJlIHRoYXQgbG9va3MgbGlrZTpcbiAqXG4gKiAgIE1hcCB7ICdmb28uanMnID0+IE1hcCB7ICdiYXIuanMnID0+IFNldCB7ICdvMicgfSB9IH1cbiAqXG4gKiBAdHlwZSB7TWFwPHN0cmluZywgTWFwPHN0cmluZywgU2V0PHN0cmluZz4+Pn1cbiAqL1xuY29uc3QgaW1wb3J0TGlzdCA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBMaXN0IG9mIGV4cG9ydHMgcGVyIGZpbGUuXG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSB0d28tbGV2ZWwgTWFwIHRvIGFuIG9iamVjdCBvZiBtZXRhZGF0YS4gVGhlIHVwcGVyLWxldmVsIE1hcFxuICoga2V5cyBhcmUgdGhlIHBhdGhzIHRvIHRoZSBtb2R1bGVzIGNvbnRhaW5pbmcgdGhlIGV4cG9ydHMsIHdoaWxlIHRoZVxuICogbG93ZXItbGV2ZWwgTWFwIGtleXMgYXJlIHRoZSBzcGVjaWZpYyBpZGVudGlmaWVycyBvciBzcGVjaWFsIEFTVCBub2RlIG5hbWVzXG4gKiBiZWluZyBleHBvcnRlZC4gVGhlIGxlYWYtbGV2ZWwgbWV0YWRhdGEgb2JqZWN0IGF0IHRoZSBtb21lbnQgb25seSBjb250YWlucyBhXG4gKiBgd2hlcmVVc2VkYCBwcm9wZXJ0eSwgd2hpY2ggY29udGFpbnMgYSBTZXQgb2YgcGF0aHMgdG8gbW9kdWxlcyB0aGF0IGltcG9ydFxuICogdGhlIG5hbWUuXG4gKlxuICogRm9yIGV4YW1wbGUsIGlmIHdlIGhhdmUgYSBmaWxlIG5hbWVkIGJhci5qcyBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgZXhwb3J0czpcbiAqXG4gKiAgIGNvbnN0IG8yID0gJ2Jhcic7XG4gKiAgIGV4cG9ydCB7IG8yIH07XG4gKlxuICogQW5kIGEgZmlsZSBuYW1lZCBmb28uanMgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGltcG9ydDpcbiAqXG4gKiAgIGltcG9ydCB7IG8yIH0gZnJvbSAnLi9iYXIuanMnO1xuICpcbiAqIFRoZW4gd2Ugd2lsbCBoYXZlIGEgc3RydWN0dXJlIHRoYXQgbG9va3MgbGlrZTpcbiAqXG4gKiAgIE1hcCB7ICdiYXIuanMnID0+IE1hcCB7ICdvMicgPT4geyB3aGVyZVVzZWQ6IFNldCB7ICdmb28uanMnIH0gfSB9IH1cbiAqXG4gKiBAdHlwZSB7TWFwPHN0cmluZywgTWFwPHN0cmluZywgb2JqZWN0Pj59XG4gKi9cbmNvbnN0IGV4cG9ydExpc3QgPSBuZXcgTWFwKCk7XG5cbmNvbnN0IHZpc2l0b3JLZXlNYXAgPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlnbm9yZWRGaWxlcyA9IG5ldyBTZXQoKTtcbmNvbnN0IGZpbGVzT3V0c2lkZVNyYyA9IG5ldyBTZXQoKTtcblxuY29uc3QgaXNOb2RlTW9kdWxlID0gcGF0aCA9PiB7XG4gIHJldHVybiAvXFwvKG5vZGVfbW9kdWxlcylcXC8vLnRlc3QocGF0aCk7XG59O1xuXG4vKipcbiAqIHJlYWQgYWxsIGZpbGVzIG1hdGNoaW5nIHRoZSBwYXR0ZXJucyBpbiBzcmMgYW5kIGlnbm9yZUV4cG9ydHNcbiAqXG4gKiByZXR1cm4gYWxsIGZpbGVzIG1hdGNoaW5nIHNyYyBwYXR0ZXJuLCB3aGljaCBhcmUgbm90IG1hdGNoaW5nIHRoZSBpZ25vcmVFeHBvcnRzIHBhdHRlcm5cbiAqL1xuY29uc3QgcmVzb2x2ZUZpbGVzID0gKHNyYywgaWdub3JlRXhwb3J0cywgY29udGV4dCkgPT4ge1xuICBjb25zdCBleHRlbnNpb25zID0gQXJyYXkuZnJvbShnZXRGaWxlRXh0ZW5zaW9ucyhjb250ZXh0LnNldHRpbmdzKSk7XG5cbiAgY29uc3Qgc3JjRmlsZXMgPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHNyY0ZpbGVMaXN0ID0gbGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywgZXh0ZW5zaW9ucyk7XG5cbiAgLy8gcHJlcGFyZSBsaXN0IG9mIGlnbm9yZWQgZmlsZXNcbiAgY29uc3QgaWdub3JlZEZpbGVzTGlzdCA9ICBsaXN0RmlsZXNUb1Byb2Nlc3MoaWdub3JlRXhwb3J0cywgZXh0ZW5zaW9ucyk7XG4gIGlnbm9yZWRGaWxlc0xpc3QuZm9yRWFjaCgoeyBmaWxlbmFtZSB9KSA9PiBpZ25vcmVkRmlsZXMuYWRkKGZpbGVuYW1lKSk7XG5cbiAgLy8gcHJlcGFyZSBsaXN0IG9mIHNvdXJjZSBmaWxlcywgZG9uJ3QgY29uc2lkZXIgZmlsZXMgZnJvbSBub2RlX21vZHVsZXNcbiAgc3JjRmlsZUxpc3QuZmlsdGVyKCh7IGZpbGVuYW1lIH0pID0+ICFpc05vZGVNb2R1bGUoZmlsZW5hbWUpKS5mb3JFYWNoKCh7IGZpbGVuYW1lIH0pID0+IHtcbiAgICBzcmNGaWxlcy5hZGQoZmlsZW5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIHNyY0ZpbGVzO1xufTtcblxuLyoqXG4gKiBwYXJzZSBhbGwgc291cmNlIGZpbGVzIGFuZCBidWlsZCB1cCAyIG1hcHMgY29udGFpbmluZyB0aGUgZXhpc3RpbmcgaW1wb3J0cyBhbmQgZXhwb3J0c1xuICovXG5jb25zdCBwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMgPSAoc3JjRmlsZXMsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXhwb3J0QWxsID0gbmV3IE1hcCgpO1xuICBzcmNGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgIGNvbnN0IGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgaW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBjdXJyZW50RXhwb3J0cyA9IEV4cG9ydHMuZ2V0KGZpbGUsIGNvbnRleHQpO1xuICAgIGlmIChjdXJyZW50RXhwb3J0cykge1xuICAgICAgY29uc3Qge1xuICAgICAgICBkZXBlbmRlbmNpZXMsXG4gICAgICAgIHJlZXhwb3J0cyxcbiAgICAgICAgaW1wb3J0czogbG9jYWxJbXBvcnRMaXN0LFxuICAgICAgICBuYW1lc3BhY2UsXG4gICAgICAgIHZpc2l0b3JLZXlzLFxuICAgICAgfSA9IGN1cnJlbnRFeHBvcnRzO1xuXG4gICAgICB2aXNpdG9yS2V5TWFwLnNldChmaWxlLCB2aXNpdG9yS2V5cyk7XG4gICAgICAvLyBkZXBlbmRlbmNpZXMgPT09IGV4cG9ydCAqIGZyb21cbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG4gICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChnZXREZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jeSA9IGdldERlcGVuZGVuY3koKTtcbiAgICAgICAgaWYgKGRlcGVuZGVuY3kgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RXhwb3J0QWxsLmFkZChkZXBlbmRlbmN5LnBhdGgpO1xuICAgICAgfSk7XG4gICAgICBleHBvcnRBbGwuc2V0KGZpbGUsIGN1cnJlbnRFeHBvcnRBbGwpO1xuXG4gICAgICByZWV4cG9ydHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWV4cG9ydCA9ICB2YWx1ZS5nZXRJbXBvcnQoKTtcbiAgICAgICAgaWYgKCFyZWV4cG9ydCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbG9jYWxJbXBvcnQgPSBpbXBvcnRzLmdldChyZWV4cG9ydC5wYXRoKTtcbiAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlLmxvY2FsID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgY3VycmVudFZhbHVlID0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHZhbHVlLmxvY2FsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxJbXBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFsuLi5sb2NhbEltcG9ydCwgY3VycmVudFZhbHVlXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFtjdXJyZW50VmFsdWVdKTtcbiAgICAgICAgfVxuICAgICAgICBpbXBvcnRzLnNldChyZWV4cG9ydC5wYXRoLCBsb2NhbEltcG9ydCk7XG4gICAgICB9KTtcblxuICAgICAgbG9jYWxJbXBvcnRMaXN0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzTm9kZU1vZHVsZShrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2FsSW1wb3J0ID0gaW1wb3J0cy5nZXQoa2V5KSB8fCBuZXcgU2V0KCk7XG4gICAgICAgIHZhbHVlLmRlY2xhcmF0aW9ucy5mb3JFYWNoKCh7IGltcG9ydGVkU3BlY2lmaWVycyB9KSA9PlxuICAgICAgICAgIGltcG9ydGVkU3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiBsb2NhbEltcG9ydC5hZGQoc3BlY2lmaWVyKSksXG4gICAgICAgICk7XG4gICAgICAgIGltcG9ydHMuc2V0KGtleSwgbG9jYWxJbXBvcnQpO1xuICAgICAgfSk7XG4gICAgICBpbXBvcnRMaXN0LnNldChmaWxlLCBpbXBvcnRzKTtcblxuICAgICAgLy8gYnVpbGQgdXAgZXhwb3J0IGxpc3Qgb25seSwgaWYgZmlsZSBpcyBub3QgaWdub3JlZFxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmFtZXNwYWNlLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gREVGQVVMVCkge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBvcnRzLnNldChrZXksIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgIGV4cG9ydHMuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgIGV4cG9ydExpc3Quc2V0KGZpbGUsIGV4cG9ydHMpO1xuICB9KTtcbiAgZXhwb3J0QWxsLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICB2YWx1ZS5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbCk7XG4gICAgICBpZiAoY3VycmVudEV4cG9ydHMpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGN1cnJlbnRFeHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuYWRkKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiB0cmF2ZXJzZSB0aHJvdWdoIGFsbCBpbXBvcnRzIGFuZCBhZGQgdGhlIHJlc3BlY3RpdmUgcGF0aCB0byB0aGUgd2hlcmVVc2VkLWxpc3RcbiAqIG9mIHRoZSBjb3JyZXNwb25kaW5nIGV4cG9ydFxuICovXG5jb25zdCBkZXRlcm1pbmVVc2FnZSA9ICgpID0+IHtcbiAgaW1wb3J0TGlzdC5mb3JFYWNoKChsaXN0VmFsdWUsIGxpc3RLZXkpID0+IHtcbiAgICBsaXN0VmFsdWUuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KGtleSk7XG4gICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goY3VycmVudEltcG9ydCA9PiB7XG4gICAgICAgICAgbGV0IHNwZWNpZmllcjtcbiAgICAgICAgICBpZiAoY3VycmVudEltcG9ydCA9PT0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgIHNwZWNpZmllciA9IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEltcG9ydCA9PT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSB7XG4gICAgICAgICAgICBzcGVjaWZpZXIgPSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwZWNpZmllciA9IGN1cnJlbnRJbXBvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2Ygc3BlY2lmaWVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgZXhwb3J0U3RhdGVtZW50ID0gZXhwb3J0cy5nZXQoc3BlY2lmaWVyKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0U3RhdGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjb25zdCB7IHdoZXJlVXNlZCB9ID0gZXhwb3J0U3RhdGVtZW50O1xuICAgICAgICAgICAgICB3aGVyZVVzZWQuYWRkKGxpc3RLZXkpO1xuICAgICAgICAgICAgICBleHBvcnRzLnNldChzcGVjaWZpZXIsIHsgd2hlcmVVc2VkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0U3JjID0gc3JjID0+IHtcbiAgaWYgKHNyYykge1xuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgcmV0dXJuIFtwcm9jZXNzLmN3ZCgpXTtcbn07XG5cbi8qKlxuICogcHJlcGFyZSB0aGUgbGlzdHMgb2YgZXhpc3RpbmcgaW1wb3J0cyBhbmQgZXhwb3J0cyAtIHNob3VsZCBvbmx5IGJlIGV4ZWN1dGVkIG9uY2UgYXRcbiAqIHRoZSBzdGFydCBvZiBhIG5ldyBlc2xpbnQgcnVuXG4gKi9cbmxldCBzcmNGaWxlcztcbmxldCBsYXN0UHJlcGFyZUtleTtcbmNvbnN0IGRvUHJlcGFyYXRpb24gPSAoc3JjLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IHByZXBhcmVLZXkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgc3JjOiAoc3JjIHx8IFtdKS5zb3J0KCksXG4gICAgaWdub3JlRXhwb3J0czogKGlnbm9yZUV4cG9ydHMgfHwgW10pLnNvcnQoKSxcbiAgICBleHRlbnNpb25zOiBBcnJheS5mcm9tKGdldEZpbGVFeHRlbnNpb25zKGNvbnRleHQuc2V0dGluZ3MpKS5zb3J0KCksXG4gIH0pO1xuICBpZiAocHJlcGFyZUtleSA9PT0gbGFzdFByZXBhcmVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpbXBvcnRMaXN0LmNsZWFyKCk7XG4gIGV4cG9ydExpc3QuY2xlYXIoKTtcbiAgaWdub3JlZEZpbGVzLmNsZWFyKCk7XG4gIGZpbGVzT3V0c2lkZVNyYy5jbGVhcigpO1xuXG4gIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKGdldFNyYyhzcmMpLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgcHJlcGFyZUltcG9ydHNBbmRFeHBvcnRzKHNyY0ZpbGVzLCBjb250ZXh0KTtcbiAgZGV0ZXJtaW5lVXNhZ2UoKTtcbiAgbGFzdFByZXBhcmVLZXkgPSBwcmVwYXJlS2V5O1xufTtcblxuY29uc3QgbmV3TmFtZXNwYWNlSW1wb3J0RXhpc3RzID0gc3BlY2lmaWVycyA9PlxuICBzcGVjaWZpZXJzLnNvbWUoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbmNvbnN0IG5ld0RlZmF1bHRJbXBvcnRFeGlzdHMgPSBzcGVjaWZpZXJzID0+XG4gIHNwZWNpZmllcnMuc29tZSgoeyB0eXBlIH0pID0+IHR5cGUgPT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG5cbmNvbnN0IGZpbGVJc0luUGtnID0gZmlsZSA9PiB7XG4gIGNvbnN0IHsgcGF0aCwgcGtnIH0gPSByZWFkUGtnVXAoeyBjd2Q6IGZpbGUgfSk7XG4gIGNvbnN0IGJhc2VQYXRoID0gZGlybmFtZShwYXRoKTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkU3RyaW5nID0gcGtnRmllbGQgPT4ge1xuICAgIGlmIChqb2luKGJhc2VQYXRoLCBwa2dGaWVsZCkgPT09IGZpbGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkT2JqZWN0ID0gcGtnRmllbGQgPT4ge1xuICAgIGNvbnN0IHBrZ0ZpZWxkRmlsZXMgPSB2YWx1ZXMocGtnRmllbGQpXG4gICAgICAuZmlsdGVyKCh2YWx1ZSkgPT4gdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpXG4gICAgICAubWFwKHZhbHVlID0+IGpvaW4oYmFzZVBhdGgsIHZhbHVlKSk7XG5cbiAgICBpZiAoaW5jbHVkZXMocGtnRmllbGRGaWxlcywgZmlsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkID0gcGtnRmllbGQgPT4ge1xuICAgIGlmICh0eXBlb2YgcGtnRmllbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY2hlY2tQa2dGaWVsZFN0cmluZyhwa2dGaWVsZCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwa2dGaWVsZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBjaGVja1BrZ0ZpZWxkT2JqZWN0KHBrZ0ZpZWxkKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHBrZy5wcml2YXRlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBrZy5iaW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZChwa2cuYmluKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBrZy5icm93c2VyKSB7XG4gICAgaWYgKGNoZWNrUGtnRmllbGQocGtnLmJyb3dzZXIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAocGtnLm1haW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZFN0cmluZyhwa2cubWFpbikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBtb2R1bGVzIHdpdGhvdXQgZXhwb3J0cywgb3IgZXhwb3J0cyB3aXRob3V0IG1hdGNoaW5nIGltcG9ydCBpbiBhbm90aGVyIG1vZHVsZS4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby11bnVzZWQtbW9kdWxlcycpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbe1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzcmM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGVzL3BhdGhzIHRvIGJlIGFuYWx5emVkIChvbmx5IGZvciB1bnVzZWQgZXhwb3J0cyknLFxuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgbWluSXRlbXM6IDEsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgbWluTGVuZ3RoOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlnbm9yZUV4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICdmaWxlcy9wYXRocyBmb3Igd2hpY2ggdW51c2VkIGV4cG9ydHMgd2lsbCBub3QgYmUgcmVwb3J0ZWQgKGUuZyBtb2R1bGUgZW50cnkgcG9pbnRzKScsXG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBtaW5JdGVtczogMSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbWlzc2luZ0V4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3JlcG9ydCBtb2R1bGVzIHdpdGhvdXQgYW55IGV4cG9ydHMnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgfSxcbiAgICAgICAgdW51c2VkRXhwb3J0czoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAncmVwb3J0IGV4cG9ydHMgd2l0aG91dCBhbnkgdXNhZ2UnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBub3Q6IHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHVudXNlZEV4cG9ydHM6IHsgZW51bTogW2ZhbHNlXSB9LFxuICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFtmYWxzZV0gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhbnlPZjpbe1xuICAgICAgICBub3Q6IHtcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB1bnVzZWRFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ21pc3NpbmdFeHBvcnRzJ10sXG4gICAgICB9LCB7XG4gICAgICAgIG5vdDoge1xuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ3VudXNlZEV4cG9ydHMnXSxcbiAgICAgIH0sIHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHVudXNlZEV4cG9ydHM6IHsgZW51bTogW3RydWVdIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ3VudXNlZEV4cG9ydHMnXSxcbiAgICAgIH0sIHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogWydtaXNzaW5nRXhwb3J0cyddLFxuICAgICAgfV0sXG4gICAgfV0sXG4gIH0sXG5cbiAgY3JlYXRlOiBjb250ZXh0ID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzcmMsXG4gICAgICBpZ25vcmVFeHBvcnRzID0gW10sXG4gICAgICBtaXNzaW5nRXhwb3J0cyxcbiAgICAgIHVudXNlZEV4cG9ydHMsXG4gICAgfSA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGlmICh1bnVzZWRFeHBvcnRzKSB7XG4gICAgICBkb1ByZXBhcmF0aW9uKHNyYywgaWdub3JlRXhwb3J0cywgY29udGV4dCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZSA9IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuXG4gICAgY29uc3QgY2hlY2tFeHBvcnRQcmVzZW5jZSA9IG5vZGUgPT4ge1xuICAgICAgaWYgKCFtaXNzaW5nRXhwb3J0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwb3J0Q291bnQgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcbiAgICAgIGNvbnN0IGV4cG9ydEFsbCA9IGV4cG9ydENvdW50LmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGNvbnN0IG5hbWVzcGFjZUltcG9ydHMgPSBleHBvcnRDb3VudC5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICBleHBvcnRDb3VudC5kZWxldGUoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBleHBvcnRDb3VudC5kZWxldGUoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgaWYgKGV4cG9ydENvdW50LnNpemUgPCAxKSB7XG4gICAgICAgIC8vIG5vZGUuYm9keVswXSA9PT0gJ3VuZGVmaW5lZCcgb25seSBoYXBwZW5zLCBpZiBldmVyeXRoaW5nIGlzIGNvbW1lbnRlZCBvdXQgaW4gdGhlIGZpbGVcbiAgICAgICAgLy8gYmVpbmcgbGludGVkXG4gICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUuYm9keVswXSA/IG5vZGUuYm9keVswXSA6IG5vZGUsICdObyBleHBvcnRzIGZvdW5kJyk7XG4gICAgICB9XG4gICAgICBleHBvcnRDb3VudC5zZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTiwgZXhwb3J0QWxsKTtcbiAgICAgIGV4cG9ydENvdW50LnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgbmFtZXNwYWNlSW1wb3J0cyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNoZWNrVXNhZ2UgPSAobm9kZSwgZXhwb3J0ZWRWYWx1ZSkgPT4ge1xuICAgICAgaWYgKCF1bnVzZWRFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZUlzSW5Qa2coZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZXNPdXRzaWRlU3JjLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSBmaWxlIHRvIGJlIGxpbnRlZCBpcyBpbmNsdWRlZCBpbiBzb3VyY2UgZmlsZXNcbiAgICAgIGlmICghc3JjRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKGdldFNyYyhzcmMpLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKCFzcmNGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgICBmaWxlc091dHNpZGVTcmMuYWRkKGZpbGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQoZmlsZSk7XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogZXhwb3J0ICogZnJvbVxuICAgICAgY29uc3QgZXhwb3J0QWxsID0gZXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBpZiAodHlwZW9mIGV4cG9ydEFsbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0ZWRWYWx1ZSAhPT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSB7XG4gICAgICAgIGlmIChleHBvcnRBbGwud2hlcmVVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogbmFtZXNwYWNlIGltcG9ydFxuICAgICAgY29uc3QgbmFtZXNwYWNlSW1wb3J0cyA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlSW1wb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKG5hbWVzcGFjZUltcG9ydHMud2hlcmVVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGV4cG9ydHNMaXN0IHdpbGwgYWx3YXlzIG1hcCBhbnkgaW1wb3J0ZWQgdmFsdWUgb2YgJ2RlZmF1bHQnIHRvICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJ1xuICAgICAgY29uc3QgZXhwb3J0c0tleSA9IGV4cG9ydGVkVmFsdWUgPT09IERFRkFVTFQgPyBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgOiBleHBvcnRlZFZhbHVlO1xuXG4gICAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnQgPSBleHBvcnRzLmdldChleHBvcnRzS2V5KTtcblxuICAgICAgY29uc3QgdmFsdWUgPSBleHBvcnRzS2V5ID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgPyBERUZBVUxUIDogZXhwb3J0c0tleTtcblxuICAgICAgaWYgKHR5cGVvZiBleHBvcnRTdGF0ZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChleHBvcnRTdGF0ZW1lbnQud2hlcmVVc2VkLnNpemUgPCAxKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgYGV4cG9ydGVkIGRlY2xhcmF0aW9uICcke3ZhbHVlfScgbm90IHVzZWQgd2l0aGluIG90aGVyIG1vZHVsZXNgLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgYGV4cG9ydGVkIGRlY2xhcmF0aW9uICcke3ZhbHVlfScgbm90IHVzZWQgd2l0aGluIG90aGVyIG1vZHVsZXNgLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBvbmx5IHVzZWZ1bCBmb3IgdG9vbHMgbGlrZSB2c2NvZGUtZXNsaW50XG4gICAgICpcbiAgICAgKiB1cGRhdGUgbGlzdHMgb2YgZXhpc3RpbmcgZXhwb3J0cyBkdXJpbmcgcnVudGltZVxuICAgICAqL1xuICAgIGNvbnN0IHVwZGF0ZUV4cG9ydFVzYWdlID0gbm9kZSA9PiB7XG4gICAgICBpZiAoaWdub3JlZEZpbGVzLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQoZmlsZSk7XG5cbiAgICAgIC8vIG5ldyBtb2R1bGUgaGFzIGJlZW4gY3JlYXRlZCBkdXJpbmcgcnVudGltZVxuICAgICAgLy8gaW5jbHVkZSBpdCBpbiBmdXJ0aGVyIHByb2Nlc3NpbmdcbiAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3RXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgIGNvbnN0IG5ld0V4cG9ydElkZW50aWZpZXJzID0gbmV3IFNldCgpO1xuXG4gICAgICBub2RlLmJvZHkuZm9yRWFjaCgoeyB0eXBlLCBkZWNsYXJhdGlvbiwgc3BlY2lmaWVycyB9KSA9PiB7XG4gICAgICAgIGlmICh0eXBlID09PSBFWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIG5ld0V4cG9ydElkZW50aWZpZXJzLmFkZChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSBFWFBPUlRfTkFNRURfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICBpZiAoc3BlY2lmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzcGVjaWZpZXJzLmZvckVhY2goc3BlY2lmaWVyID0+IHtcbiAgICAgICAgICAgICAgaWYgKHNwZWNpZmllci5leHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIG5ld0V4cG9ydElkZW50aWZpZXJzLmFkZChzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuZXhwb3J0ZWQudmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihkZWNsYXJhdGlvbiwgKG5hbWUpID0+IHtcbiAgICAgICAgICAgIG5ld0V4cG9ydElkZW50aWZpZXJzLmFkZChuYW1lKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIG9sZCBleHBvcnRzIGV4aXN0IHdpdGhpbiBsaXN0IG9mIG5ldyBleHBvcnRzIGlkZW50aWZpZXJzOiBhZGQgdG8gbWFwIG9mIG5ldyBleHBvcnRzXG4gICAgICBleHBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKG5ld0V4cG9ydElkZW50aWZpZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbmV3RXhwb3J0cy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBuZXcgZXhwb3J0IGlkZW50aWZpZXJzIGFkZGVkOiBhZGQgdG8gbWFwIG9mIG5ldyBleHBvcnRzXG4gICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmICghZXhwb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIG5ld0V4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHByZXNlcnZlIGluZm9ybWF0aW9uIGFib3V0IG5hbWVzcGFjZSBpbXBvcnRzXG4gICAgICBjb25zdCBleHBvcnRBbGwgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGxldCBuYW1lc3BhY2VJbXBvcnRzID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICBpZiAodHlwZW9mIG5hbWVzcGFjZUltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG5hbWVzcGFjZUltcG9ydHMgPSB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH07XG4gICAgICB9XG5cbiAgICAgIG5ld0V4cG9ydHMuc2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04sIGV4cG9ydEFsbCk7XG4gICAgICBuZXdFeHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgbmFtZXNwYWNlSW1wb3J0cyk7XG4gICAgICBleHBvcnRMaXN0LnNldChmaWxlLCBuZXdFeHBvcnRzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogb25seSB1c2VmdWwgZm9yIHRvb2xzIGxpa2UgdnNjb2RlLWVzbGludFxuICAgICAqXG4gICAgICogdXBkYXRlIGxpc3RzIG9mIGV4aXN0aW5nIGltcG9ydHMgZHVyaW5nIHJ1bnRpbWVcbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVJbXBvcnRVc2FnZSA9IG5vZGUgPT4ge1xuICAgICAgaWYgKCF1bnVzZWRFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IG9sZEltcG9ydFBhdGhzID0gaW1wb3J0TGlzdC5nZXQoZmlsZSk7XG4gICAgICBpZiAodHlwZW9mIG9sZEltcG9ydFBhdGhzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvbGRJbXBvcnRQYXRocyA9IG5ldyBNYXAoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2xkTmFtZXNwYWNlSW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgIGNvbnN0IG5ld05hbWVzcGFjZUltcG9ydHMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGNvbnN0IG9sZEV4cG9ydEFsbCA9IG5ldyBTZXQoKTtcbiAgICAgIGNvbnN0IG5ld0V4cG9ydEFsbCA9IG5ldyBTZXQoKTtcblxuICAgICAgY29uc3Qgb2xkRGVmYXVsdEltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBuZXdEZWZhdWx0SW1wb3J0cyA9IG5ldyBTZXQoKTtcblxuICAgICAgY29uc3Qgb2xkSW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgIGNvbnN0IG5ld0ltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICBvbGRJbXBvcnRQYXRocy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZS5oYXMoRVhQT1JUX0FMTF9ERUNMQVJBVElPTikpIHtcbiAgICAgICAgICBvbGRFeHBvcnRBbGwuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLmhhcyhJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUikpIHtcbiAgICAgICAgICBvbGROYW1lc3BhY2VJbXBvcnRzLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5oYXMoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSkge1xuICAgICAgICAgIG9sZERlZmF1bHRJbXBvcnRzLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICBpZiAodmFsICE9PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiAmJlxuICAgICAgICAgICAgICB2YWwgIT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUikge1xuICAgICAgICAgICAgb2xkSW1wb3J0cy5zZXQodmFsLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc0R5bmFtaWNJbXBvcnQoc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UudHlwZSAhPT0gJ0xpdGVyYWwnKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcCA9IHJlc29sdmUoc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuYWRkKHApO1xuICAgICAgfVxuXG4gICAgICB2aXNpdChub2RlLCB2aXNpdG9yS2V5TWFwLmdldChmaWxlKSwge1xuICAgICAgICBJbXBvcnRFeHByZXNzaW9uKGNoaWxkKSB7XG4gICAgICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQoY2hpbGQuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQ2FsbEV4cHJlc3Npb24oY2hpbGQpIHtcbiAgICAgICAgICBpZiAoY2hpbGQuY2FsbGVlLnR5cGUgPT09ICdJbXBvcnQnKSB7XG4gICAgICAgICAgICBwcm9jZXNzRHluYW1pY0ltcG9ydChjaGlsZC5hcmd1bWVudHNbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBub2RlLmJvZHkuZm9yRWFjaChhc3ROb2RlID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkUGF0aDtcblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBleHBvcnQgeyB2YWx1ZSB9IGZyb20gJ21vZHVsZSdcbiAgICAgICAgaWYgKGFzdE5vZGUudHlwZSA9PT0gRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgaWYgKGFzdE5vZGUuc291cmNlKSB7XG4gICAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGFzdE5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWZpZXIubG9jYWwubmFtZSB8fCBzcGVjaWZpZXIubG9jYWwudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChuYW1lID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgICAgICAgbmV3RGVmYXVsdEltcG9ydHMuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3SW1wb3J0cy5zZXQobmFtZSwgcmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFzdE5vZGUudHlwZSA9PT0gRVhQT1JUX0FMTF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIHJlc29sdmVkUGF0aCA9IHJlc29sdmUoYXN0Tm9kZS5zb3VyY2UucmF3LnJlcGxhY2UoLygnfFwiKS9nLCAnJyksIGNvbnRleHQpO1xuICAgICAgICAgIG5ld0V4cG9ydEFsbC5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhc3ROb2RlLnR5cGUgPT09IElNUE9SVF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIHJlc29sdmVkUGF0aCA9IHJlc29sdmUoYXN0Tm9kZS5zb3VyY2UucmF3LnJlcGxhY2UoLygnfFwiKS9nLCAnJyksIGNvbnRleHQpO1xuICAgICAgICAgIGlmICghcmVzb2x2ZWRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzTm9kZU1vZHVsZShyZXNvbHZlZFBhdGgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5ld05hbWVzcGFjZUltcG9ydEV4aXN0cyhhc3ROb2RlLnNwZWNpZmllcnMpKSB7XG4gICAgICAgICAgICBuZXdOYW1lc3BhY2VJbXBvcnRzLmFkZChyZXNvbHZlZFBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXdEZWZhdWx0SW1wb3J0RXhpc3RzKGFzdE5vZGUuc3BlY2lmaWVycykpIHtcbiAgICAgICAgICAgIG5ld0RlZmF1bHRJbXBvcnRzLmFkZChyZXNvbHZlZFBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFzdE5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgICBpZiAoc3BlY2lmaWVyLnR5cGUgPT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiB8fFxuICAgICAgICAgICAgICAgIHNwZWNpZmllci50eXBlID09PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUikge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdJbXBvcnRzLnNldChzcGVjaWZpZXIuaW1wb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuaW1wb3J0ZWQudmFsdWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdFeHBvcnRBbGwuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkRXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGRFeHBvcnRBbGwuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghbmV3RXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbmV3RGVmYXVsdEltcG9ydHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkRGVmYXVsdEltcG9ydHMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgIGxldCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBvcnRzLmFkZChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgICAgIG9sZEltcG9ydFBhdGhzLnNldCh2YWx1ZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBsZXQgY3VycmVudEV4cG9ydDtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIsIHsgd2hlcmVVc2VkIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG9sZERlZmF1bHRJbXBvcnRzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICBpZiAoIW5ld0RlZmF1bHRJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuZGVsZXRlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkTmFtZXNwYWNlSW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICBvbGRJbXBvcnRQYXRocy5zZXQodmFsdWUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRFeHBvcnQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkTmFtZXNwYWNlSW1wb3J0cy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCFuZXdOYW1lc3BhY2VJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmRlbGV0ZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdJbXBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFvbGRJbXBvcnRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKGtleSk7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZXhwb3J0TGlzdC5zZXQodmFsdWUsIGV4cG9ydHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd2hlcmVVc2VkID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgd2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkSW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICghbmV3SW1wb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGNvbnN0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGltcG9ydHMuZGVsZXRlKGtleSk7XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICdQcm9ncmFtOmV4aXQnOiBub2RlID0+IHtcbiAgICAgICAgdXBkYXRlRXhwb3J0VXNhZ2Uobm9kZSk7XG4gICAgICAgIHVwZGF0ZUltcG9ydFVzYWdlKG5vZGUpO1xuICAgICAgICBjaGVja0V4cG9ydFByZXNlbmNlKG5vZGUpO1xuICAgICAgfSxcbiAgICAgICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nOiBub2RlID0+IHtcbiAgICAgICAgY2hlY2tVc2FnZShub2RlLCBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgfSxcbiAgICAgICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJzogbm9kZSA9PiB7XG4gICAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgY2hlY2tVc2FnZShub2RlLCBzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuZXhwb3J0ZWQudmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihub2RlLmRlY2xhcmF0aW9uLCAobmFtZSkgPT4ge1xuICAgICAgICAgIGNoZWNrVXNhZ2Uobm9kZSwgbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==