'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _semver = require('semver');var _semver2 = _interopRequireDefault(_semver);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _toArray(arr) {return Array.isArray(arr) ? arr : Array.from(arr);}

var typescriptPkg = void 0;
try {
  typescriptPkg = require('typescript/package.json'); // eslint-disable-line import/no-extraneous-dependencies
} catch (e) {/**/}

function checkImports(imported, context) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = imported.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref = _step.value;var _ref2 = _slicedToArray(_ref, 2);var _module = _ref2[0];var nodes = _ref2[1];
      if (nodes.length > 1) {
        var message = '\'' + String(_module) + '\' imported multiple times.';var _nodes = _toArray(
        nodes),first = _nodes[0],rest = _nodes.slice(1);
        var sourceCode = context.getSourceCode();
        var fix = getFix(first, rest, sourceCode, context);

        context.report({
          node: first.source,
          message: message,
          fix: fix // Attach the autofix (if any) to the first import.
        });var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

          for (var _iterator2 = rest[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var node = _step2.value;
            context.report({
              node: node.source,
              message: message });

          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
}

function getFix(first, rest, sourceCode, context) {
  // Sorry ESLint <= 3 users, no autofix for you. Autofixing duplicate imports
  // requires multiple `fixer.whatever()` calls in the `fix`: We both need to
  // update the first one, and remove the rest. Support for multiple
  // `fixer.whatever()` in a single `fix` was added in ESLint 4.1.
  // `sourceCode.getCommentsBefore` was added in 4.0, so that's an easy thing to
  // check for.
  if (typeof sourceCode.getCommentsBefore !== 'function') {
    return undefined;
  }

  // Adjusting the first import might make it multiline, which could break
  // `eslint-disable-next-line` comments and similar, so bail if the first
  // import has comments. Also, if the first import is `import * as ns from
  // './foo'` there's nothing we can do.
  if (hasProblematicComments(first, sourceCode) || hasNamespace(first)) {
    return undefined;
  }

  var defaultImportNames = new Set(
  [first].concat(_toConsumableArray(rest)).map(getDefaultImportName).filter(Boolean));


  // Bail if there are multiple different default import names – it's up to the
  // user to choose which one to keep.
  if (defaultImportNames.size > 1) {
    return undefined;
  }

  // Leave it to the user to handle comments. Also skip `import * as ns from
  // './foo'` imports, since they cannot be merged into another import.
  var restWithoutComments = rest.filter(function (node) {return !(
    hasProblematicComments(node, sourceCode) ||
    hasNamespace(node));});


  var specifiers = restWithoutComments.
  map(function (node) {
    var tokens = sourceCode.getTokens(node);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});

    if (openBrace == null || closeBrace == null) {
      return undefined;
    }

    return {
      importNode: node,
      text: sourceCode.text.slice(openBrace.range[1], closeBrace.range[0]),
      hasTrailingComma: isPunctuator(sourceCode.getTokenBefore(closeBrace), ','),
      isEmpty: !hasSpecifiers(node) };

  }).
  filter(Boolean);

  var unnecessaryImports = restWithoutComments.filter(function (node) {return (
      !hasSpecifiers(node) &&
      !hasNamespace(node) &&
      !specifiers.some(function (specifier) {return specifier.importNode === node;}));});


  var shouldAddDefault = getDefaultImportName(first) == null && defaultImportNames.size === 1;
  var shouldAddSpecifiers = specifiers.length > 0;
  var shouldRemoveUnnecessary = unnecessaryImports.length > 0;

  if (!(shouldAddDefault || shouldAddSpecifiers || shouldRemoveUnnecessary)) {
    return undefined;
  }

  return function (fixer) {
    var tokens = sourceCode.getTokens(first);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});
    var firstToken = sourceCode.getFirstToken(first);var _defaultImportNames = _slicedToArray(
    defaultImportNames, 1),defaultImportName = _defaultImportNames[0];

    var firstHasTrailingComma =
    closeBrace != null &&
    isPunctuator(sourceCode.getTokenBefore(closeBrace), ',');
    var firstIsEmpty = !hasSpecifiers(first);var _specifiers$reduce =

    specifiers.reduce(
    function (_ref3, specifier) {var _ref4 = _slicedToArray(_ref3, 2),result = _ref4[0],needsComma = _ref4[1];
      var isTypeSpecifier = specifier.importNode.importKind === 'type';

      var preferInline = context.options[0] && context.options[0]['prefer-inline'];
      // a user might set prefer-inline but not have a supporting TypeScript version.  Flow does not support inline types so this should fail in that case as well.
      if (preferInline && (!typescriptPkg || !_semver2['default'].satisfies(typescriptPkg.version, '>= 4.5'))) {
        throw new Error('Your version of TypeScript does not support inline type imports.');
      }

      var insertText = '' + (preferInline && isTypeSpecifier ? 'type ' : '') + String(specifier.text);
      return [
      needsComma && !specifier.isEmpty ? String(
      result) + ',' + insertText : '' + String(
      result) + insertText,
      specifier.isEmpty ? needsComma : true];

    },
    ['', !firstHasTrailingComma && !firstIsEmpty]),_specifiers$reduce2 = _slicedToArray(_specifiers$reduce, 1),specifiersText = _specifiers$reduce2[0];


    var fixes = [];

    if (shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      // `import './foo'` → `import def, {...} from './foo'`
      fixes.push(
      fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ', {' + String(specifiersText) + '} from'));

    } else if (shouldAddDefault && openBrace == null && !shouldAddSpecifiers) {
      // `import './foo'` → `import def from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ' from'));
    } else if (shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} from './foo'` → `import def, {...} from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ','));
      if (shouldAddSpecifiers) {
        // `import def, {...} from './foo'` → `import def, {..., ...} from './foo'`
        fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
      }
    } else if (!shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      if (first.specifiers.length === 0) {
        // `import './foo'` → `import {...} from './foo'`
        fixes.push(fixer.insertTextAfter(firstToken, ' {' + String(specifiersText) + '} from'));
      } else {
        // `import def from './foo'` → `import def, {...} from './foo'`
        fixes.push(fixer.insertTextAfter(first.specifiers[0], ', {' + String(specifiersText) + '}'));
      }
    } else if (!shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} './foo'` → `import {..., ...} from './foo'`
      fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
    }

    // Remove imports whose specifiers have been moved into the first import.
    var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = specifiers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var specifier = _step3.value;
        var importNode = specifier.importNode;
        fixes.push(fixer.remove(importNode));

        var charAfterImportRange = [importNode.range[1], importNode.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }

      // Remove imports whose default import has been moved to the first import,
      // and side-effect-only imports that are unnecessary due to the first
      // import.
    } catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = unnecessaryImports[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
        fixes.push(fixer.remove(node));

        var charAfterImportRange = [node.range[1], node.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}

    return fixes;
  };
}

function isPunctuator(node, value) {
  return node.type === 'Punctuator' && node.value === value;
}

// Get the name of the default import of `node`, if any.
function getDefaultImportName(node) {
  var defaultSpecifier = node.specifiers.
  find(function (specifier) {return specifier.type === 'ImportDefaultSpecifier';});
  return defaultSpecifier != null ? defaultSpecifier.local.name : undefined;
}

// Checks whether `node` has a namespace import.
function hasNamespace(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportNamespaceSpecifier';});
  return specifiers.length > 0;
}

// Checks whether `node` has any non-default specifiers.
function hasSpecifiers(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportSpecifier';});
  return specifiers.length > 0;
}

// It's not obvious what the user wants to do with comments associated with
// duplicate imports, so skip imports with comments when autofixing.
function hasProblematicComments(node, sourceCode) {
  return (
    hasCommentBefore(node, sourceCode) ||
    hasCommentAfter(node, sourceCode) ||
    hasCommentInsideNonSpecifiers(node, sourceCode));

}

// Checks whether `node` has a comment (that ends) on the previous line or on
// the same line as `node` (starts).
function hasCommentBefore(node, sourceCode) {
  return sourceCode.getCommentsBefore(node).
  some(function (comment) {return comment.loc.end.line >= node.loc.start.line - 1;});
}

// Checks whether `node` has a comment (that starts) on the same line as `node`
// (ends).
function hasCommentAfter(node, sourceCode) {
  return sourceCode.getCommentsAfter(node).
  some(function (comment) {return comment.loc.start.line === node.loc.end.line;});
}

// Checks whether `node` has any comments _inside,_ except inside the `{...}`
// part (if any).
function hasCommentInsideNonSpecifiers(node, sourceCode) {
  var tokens = sourceCode.getTokens(node);
  var openBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '{');});
  var closeBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '}');});
  // Slice away the first token, since we're no looking for comments _before_
  // `node` (only inside). If there's a `{...}` part, look for comments before
  // the `{`, but not before the `}` (hence the `+1`s).
  var someTokens = openBraceIndex >= 0 && closeBraceIndex >= 0 ?
  tokens.slice(1, openBraceIndex + 1).concat(tokens.slice(closeBraceIndex + 1)) :
  tokens.slice(1);
  return someTokens.some(function (token) {return sourceCode.getCommentsBefore(token).length > 0;});
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Style guide',
      description: 'Forbid repeated import of the same module in multiple places.',
      url: (0, _docsUrl2['default'])('no-duplicates') },

    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        considerQueryString: {
          type: 'boolean' },

        'prefer-inline': {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      // Prepare the resolver from options.
      var considerQueryStringOption = context.options[0] &&
      context.options[0]['considerQueryString'];
      var defaultResolver = function () {function defaultResolver(sourcePath) {return (0, _resolve2['default'])(sourcePath, context) || sourcePath;}return defaultResolver;}();
      var resolver = considerQueryStringOption ? function (sourcePath) {
        var parts = sourcePath.match(/^([^?]*)\?(.*)$/);
        if (!parts) {
          return defaultResolver(sourcePath);
        }
        return defaultResolver(parts[1]) + '?' + parts[2];
      } : defaultResolver;

      var moduleMaps = new Map();

      function getImportMap(n) {
        if (!moduleMaps.has(n.parent)) {
          moduleMaps.set(n.parent, {
            imported: new Map(),
            nsImported: new Map(),
            defaultTypesImported: new Map(),
            namedTypesImported: new Map() });

        }
        var map = moduleMaps.get(n.parent);
        if (n.importKind === 'type') {
          return n.specifiers.length > 0 && n.specifiers[0].type === 'ImportDefaultSpecifier' ? map.defaultTypesImported : map.namedTypesImported;
        }
        if (n.specifiers.some(function (spec) {return spec.importKind === 'type';})) {
          return map.namedTypesImported;
        }

        return hasNamespace(n) ? map.nsImported : map.imported;
      }

      return {
        ImportDeclaration: function () {function ImportDeclaration(n) {
            // resolved path will cover aliased duplicates
            var resolvedPath = resolver(n.source.value);
            var importMap = getImportMap(n);

            if (importMap.has(resolvedPath)) {
              importMap.get(resolvedPath).push(n);
            } else {
              importMap.set(resolvedPath, [n]);
            }
          }return ImportDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {
              for (var _iterator5 = moduleMaps.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var map = _step5.value;
                checkImports(map.imported, context);
                checkImports(map.nsImported, context);
                checkImports(map.defaultTypesImported, context);
                checkImports(map.namedTypesImported, context);
              }} catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5['return']) {_iterator5['return']();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kdXBsaWNhdGVzLmpzIl0sIm5hbWVzIjpbInR5cGVzY3JpcHRQa2ciLCJyZXF1aXJlIiwiZSIsImNoZWNrSW1wb3J0cyIsImltcG9ydGVkIiwiY29udGV4dCIsImVudHJpZXMiLCJtb2R1bGUiLCJub2RlcyIsImxlbmd0aCIsIm1lc3NhZ2UiLCJmaXJzdCIsInJlc3QiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsImZpeCIsImdldEZpeCIsInJlcG9ydCIsIm5vZGUiLCJzb3VyY2UiLCJnZXRDb21tZW50c0JlZm9yZSIsInVuZGVmaW5lZCIsImhhc1Byb2JsZW1hdGljQ29tbWVudHMiLCJoYXNOYW1lc3BhY2UiLCJkZWZhdWx0SW1wb3J0TmFtZXMiLCJTZXQiLCJtYXAiLCJnZXREZWZhdWx0SW1wb3J0TmFtZSIsImZpbHRlciIsIkJvb2xlYW4iLCJzaXplIiwicmVzdFdpdGhvdXRDb21tZW50cyIsInNwZWNpZmllcnMiLCJ0b2tlbnMiLCJnZXRUb2tlbnMiLCJvcGVuQnJhY2UiLCJmaW5kIiwiaXNQdW5jdHVhdG9yIiwidG9rZW4iLCJjbG9zZUJyYWNlIiwiaW1wb3J0Tm9kZSIsInRleHQiLCJzbGljZSIsInJhbmdlIiwiaGFzVHJhaWxpbmdDb21tYSIsImdldFRva2VuQmVmb3JlIiwiaXNFbXB0eSIsImhhc1NwZWNpZmllcnMiLCJ1bm5lY2Vzc2FyeUltcG9ydHMiLCJzb21lIiwic3BlY2lmaWVyIiwic2hvdWxkQWRkRGVmYXVsdCIsInNob3VsZEFkZFNwZWNpZmllcnMiLCJzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSIsImZpcnN0VG9rZW4iLCJnZXRGaXJzdFRva2VuIiwiZGVmYXVsdEltcG9ydE5hbWUiLCJmaXJzdEhhc1RyYWlsaW5nQ29tbWEiLCJmaXJzdElzRW1wdHkiLCJyZWR1Y2UiLCJyZXN1bHQiLCJuZWVkc0NvbW1hIiwiaXNUeXBlU3BlY2lmaWVyIiwiaW1wb3J0S2luZCIsInByZWZlcklubGluZSIsIm9wdGlvbnMiLCJzZW12ZXIiLCJzYXRpc2ZpZXMiLCJ2ZXJzaW9uIiwiRXJyb3IiLCJpbnNlcnRUZXh0Iiwic3BlY2lmaWVyc1RleHQiLCJmaXhlcyIsInB1c2giLCJmaXhlciIsImluc2VydFRleHRBZnRlciIsImluc2VydFRleHRCZWZvcmUiLCJyZW1vdmUiLCJjaGFyQWZ0ZXJJbXBvcnRSYW5nZSIsImNoYXJBZnRlckltcG9ydCIsInN1YnN0cmluZyIsInJlbW92ZVJhbmdlIiwidmFsdWUiLCJ0eXBlIiwiZGVmYXVsdFNwZWNpZmllciIsImxvY2FsIiwibmFtZSIsImhhc0NvbW1lbnRCZWZvcmUiLCJoYXNDb21tZW50QWZ0ZXIiLCJoYXNDb21tZW50SW5zaWRlTm9uU3BlY2lmaWVycyIsImNvbW1lbnQiLCJsb2MiLCJlbmQiLCJsaW5lIiwic3RhcnQiLCJnZXRDb21tZW50c0FmdGVyIiwib3BlbkJyYWNlSW5kZXgiLCJmaW5kSW5kZXgiLCJjbG9zZUJyYWNlSW5kZXgiLCJzb21lVG9rZW5zIiwiY29uY2F0IiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsImZpeGFibGUiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiY29uc2lkZXJRdWVyeVN0cmluZyIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiY3JlYXRlIiwiY29uc2lkZXJRdWVyeVN0cmluZ09wdGlvbiIsImRlZmF1bHRSZXNvbHZlciIsInNvdXJjZVBhdGgiLCJyZXNvbHZlciIsInBhcnRzIiwibWF0Y2giLCJtb2R1bGVNYXBzIiwiTWFwIiwiZ2V0SW1wb3J0TWFwIiwibiIsImhhcyIsInBhcmVudCIsInNldCIsIm5zSW1wb3J0ZWQiLCJkZWZhdWx0VHlwZXNJbXBvcnRlZCIsIm5hbWVkVHlwZXNJbXBvcnRlZCIsImdldCIsInNwZWMiLCJJbXBvcnREZWNsYXJhdGlvbiIsInJlc29sdmVkUGF0aCIsImltcG9ydE1hcCIsInZhbHVlcyJdLCJtYXBwaW5ncyI6InFvQkFBQSxzRDtBQUNBLHFD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QWIsQ0FBbEI7O0FBRUEsZ0JBQUlXLFVBQVVWLEdBQVYsQ0FBY1MsWUFBZCxDQUFKLEVBQWlDO0FBQy9CQyx3QkFBVUosR0FBVixDQUFjRyxZQUFkLEVBQTRCM0QsSUFBNUIsQ0FBaUNpRCxDQUFqQztBQUNELGFBRkQsTUFFTztBQUNMVyx3QkFBVVIsR0FBVixDQUFjTyxZQUFkLEVBQTRCLENBQUNWLENBQUQsQ0FBNUI7QUFDRDtBQUNGLFdBWEk7O0FBYUwscUNBQWdCLHVCQUFZO0FBQzFCLG9DQUFrQkgsV0FBV2UsTUFBWCxFQUFsQixtSUFBdUMsS0FBNUI1RyxHQUE0QjtBQUNyQ3ZCLDZCQUFhdUIsSUFBSXRCLFFBQWpCLEVBQTJCQyxPQUEzQjtBQUNBRiw2QkFBYXVCLElBQUlvRyxVQUFqQixFQUE2QnpILE9BQTdCO0FBQ0FGLDZCQUFhdUIsSUFBSXFHLG9CQUFqQixFQUF1QzFILE9BQXZDO0FBQ0FGLDZCQUFhdUIsSUFBSXNHLGtCQUFqQixFQUFxQzNILE9BQXJDO0FBQ0QsZUFOeUI7QUFPM0IsV0FQRCxzQkFiSyxFQUFQOztBQXNCRCxLQWxGYyxtQkFBakIiLCJmaWxlIjoibm8tZHVwbGljYXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcbmltcG9ydCBzZW12ZXIgZnJvbSAnc2VtdmVyJztcblxubGV0IHR5cGVzY3JpcHRQa2c7XG50cnkge1xuICB0eXBlc2NyaXB0UGtnID0gcmVxdWlyZSgndHlwZXNjcmlwdC9wYWNrYWdlLmpzb24nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbn0gY2F0Y2ggKGUpIHsgLyoqLyB9XG5cbmZ1bmN0aW9uIGNoZWNrSW1wb3J0cyhpbXBvcnRlZCwgY29udGV4dCkge1xuICBmb3IgKGNvbnN0IFttb2R1bGUsIG5vZGVzXSBvZiBpbXBvcnRlZC5lbnRyaWVzKCkpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGAnJHttb2R1bGV9JyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcy5gO1xuICAgICAgY29uc3QgW2ZpcnN0LCAuLi5yZXN0XSA9IG5vZGVzO1xuICAgICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuICAgICAgY29uc3QgZml4ID0gZ2V0Rml4KGZpcnN0LCByZXN0LCBzb3VyY2VDb2RlLCBjb250ZXh0KTtcblxuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlOiBmaXJzdC5zb3VyY2UsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGZpeCwgLy8gQXR0YWNoIHRoZSBhdXRvZml4IChpZiBhbnkpIHRvIHRoZSBmaXJzdCBpbXBvcnQuXG4gICAgICB9KTtcblxuICAgICAgZm9yIChjb25zdCBub2RlIG9mIHJlc3QpIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGU6IG5vZGUuc291cmNlLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRGaXgoZmlyc3QsIHJlc3QsIHNvdXJjZUNvZGUsIGNvbnRleHQpIHtcbiAgLy8gU29ycnkgRVNMaW50IDw9IDMgdXNlcnMsIG5vIGF1dG9maXggZm9yIHlvdS4gQXV0b2ZpeGluZyBkdXBsaWNhdGUgaW1wb3J0c1xuICAvLyByZXF1aXJlcyBtdWx0aXBsZSBgZml4ZXIud2hhdGV2ZXIoKWAgY2FsbHMgaW4gdGhlIGBmaXhgOiBXZSBib3RoIG5lZWQgdG9cbiAgLy8gdXBkYXRlIHRoZSBmaXJzdCBvbmUsIGFuZCByZW1vdmUgdGhlIHJlc3QuIFN1cHBvcnQgZm9yIG11bHRpcGxlXG4gIC8vIGBmaXhlci53aGF0ZXZlcigpYCBpbiBhIHNpbmdsZSBgZml4YCB3YXMgYWRkZWQgaW4gRVNMaW50IDQuMS5cbiAgLy8gYHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmVgIHdhcyBhZGRlZCBpbiA0LjAsIHNvIHRoYXQncyBhbiBlYXN5IHRoaW5nIHRvXG4gIC8vIGNoZWNrIGZvci5cbiAgaWYgKHR5cGVvZiBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIEFkanVzdGluZyB0aGUgZmlyc3QgaW1wb3J0IG1pZ2h0IG1ha2UgaXQgbXVsdGlsaW5lLCB3aGljaCBjb3VsZCBicmVha1xuICAvLyBgZXNsaW50LWRpc2FibGUtbmV4dC1saW5lYCBjb21tZW50cyBhbmQgc2ltaWxhciwgc28gYmFpbCBpZiB0aGUgZmlyc3RcbiAgLy8gaW1wb3J0IGhhcyBjb21tZW50cy4gQWxzbywgaWYgdGhlIGZpcnN0IGltcG9ydCBpcyBgaW1wb3J0ICogYXMgbnMgZnJvbVxuICAvLyAnLi9mb28nYCB0aGVyZSdzIG5vdGhpbmcgd2UgY2FuIGRvLlxuICBpZiAoaGFzUHJvYmxlbWF0aWNDb21tZW50cyhmaXJzdCwgc291cmNlQ29kZSkgfHwgaGFzTmFtZXNwYWNlKGZpcnN0KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBkZWZhdWx0SW1wb3J0TmFtZXMgPSBuZXcgU2V0KFxuICAgIFtmaXJzdCwgLi4ucmVzdF0ubWFwKGdldERlZmF1bHRJbXBvcnROYW1lKS5maWx0ZXIoQm9vbGVhbiksXG4gICk7XG5cbiAgLy8gQmFpbCBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZGlmZmVyZW50IGRlZmF1bHQgaW1wb3J0IG5hbWVzIOKAkyBpdCdzIHVwIHRvIHRoZVxuICAvLyB1c2VyIHRvIGNob29zZSB3aGljaCBvbmUgdG8ga2VlcC5cbiAgaWYgKGRlZmF1bHRJbXBvcnROYW1lcy5zaXplID4gMSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBMZWF2ZSBpdCB0byB0aGUgdXNlciB0byBoYW5kbGUgY29tbWVudHMuIEFsc28gc2tpcCBgaW1wb3J0ICogYXMgbnMgZnJvbVxuICAvLyAnLi9mb28nYCBpbXBvcnRzLCBzaW5jZSB0aGV5IGNhbm5vdCBiZSBtZXJnZWQgaW50byBhbm90aGVyIGltcG9ydC5cbiAgY29uc3QgcmVzdFdpdGhvdXRDb21tZW50cyA9IHJlc3QuZmlsdGVyKG5vZGUgPT4gIShcbiAgICBoYXNQcm9ibGVtYXRpY0NvbW1lbnRzKG5vZGUsIHNvdXJjZUNvZGUpIHx8XG4gICAgaGFzTmFtZXNwYWNlKG5vZGUpXG4gICkpO1xuXG4gIGNvbnN0IHNwZWNpZmllcnMgPSByZXN0V2l0aG91dENvbW1lbnRzXG4gICAgLm1hcChub2RlID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5zKG5vZGUpO1xuICAgICAgY29uc3Qgb3BlbkJyYWNlID0gdG9rZW5zLmZpbmQodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgICAgIGNvbnN0IGNsb3NlQnJhY2UgPSB0b2tlbnMuZmluZCh0b2tlbiA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd9JykpO1xuXG4gICAgICBpZiAob3BlbkJyYWNlID09IG51bGwgfHwgY2xvc2VCcmFjZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGltcG9ydE5vZGU6IG5vZGUsXG4gICAgICAgIHRleHQ6IHNvdXJjZUNvZGUudGV4dC5zbGljZShvcGVuQnJhY2UucmFuZ2VbMV0sIGNsb3NlQnJhY2UucmFuZ2VbMF0pLFxuICAgICAgICBoYXNUcmFpbGluZ0NvbW1hOiBpc1B1bmN0dWF0b3Ioc291cmNlQ29kZS5nZXRUb2tlbkJlZm9yZShjbG9zZUJyYWNlKSwgJywnKSxcbiAgICAgICAgaXNFbXB0eTogIWhhc1NwZWNpZmllcnMobm9kZSksXG4gICAgICB9O1xuICAgIH0pXG4gICAgLmZpbHRlcihCb29sZWFuKTtcblxuICBjb25zdCB1bm5lY2Vzc2FyeUltcG9ydHMgPSByZXN0V2l0aG91dENvbW1lbnRzLmZpbHRlcihub2RlID0+XG4gICAgIWhhc1NwZWNpZmllcnMobm9kZSkgJiZcbiAgICAhaGFzTmFtZXNwYWNlKG5vZGUpICYmXG4gICAgIXNwZWNpZmllcnMuc29tZShzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLmltcG9ydE5vZGUgPT09IG5vZGUpLFxuICApO1xuXG4gIGNvbnN0IHNob3VsZEFkZERlZmF1bHQgPSBnZXREZWZhdWx0SW1wb3J0TmFtZShmaXJzdCkgPT0gbnVsbCAmJiBkZWZhdWx0SW1wb3J0TmFtZXMuc2l6ZSA9PT0gMTtcbiAgY29uc3Qgc2hvdWxkQWRkU3BlY2lmaWVycyA9IHNwZWNpZmllcnMubGVuZ3RoID4gMDtcbiAgY29uc3Qgc2hvdWxkUmVtb3ZlVW5uZWNlc3NhcnkgPSB1bm5lY2Vzc2FyeUltcG9ydHMubGVuZ3RoID4gMDtcblxuICBpZiAoIShzaG91bGRBZGREZWZhdWx0IHx8IHNob3VsZEFkZFNwZWNpZmllcnMgfHwgc2hvdWxkUmVtb3ZlVW5uZWNlc3NhcnkpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBmaXhlciA9PiB7XG4gICAgY29uc3QgdG9rZW5zID0gc291cmNlQ29kZS5nZXRUb2tlbnMoZmlyc3QpO1xuICAgIGNvbnN0IG9wZW5CcmFjZSA9IHRva2Vucy5maW5kKHRva2VuID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ3snKSk7XG4gICAgY29uc3QgY2xvc2VCcmFjZSA9IHRva2Vucy5maW5kKHRva2VuID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ30nKSk7XG4gICAgY29uc3QgZmlyc3RUb2tlbiA9IHNvdXJjZUNvZGUuZ2V0Rmlyc3RUb2tlbihmaXJzdCk7XG4gICAgY29uc3QgW2RlZmF1bHRJbXBvcnROYW1lXSA9IGRlZmF1bHRJbXBvcnROYW1lcztcblxuICAgIGNvbnN0IGZpcnN0SGFzVHJhaWxpbmdDb21tYSA9XG4gICAgICBjbG9zZUJyYWNlICE9IG51bGwgJiZcbiAgICAgIGlzUHVuY3R1YXRvcihzb3VyY2VDb2RlLmdldFRva2VuQmVmb3JlKGNsb3NlQnJhY2UpLCAnLCcpO1xuICAgIGNvbnN0IGZpcnN0SXNFbXB0eSA9ICFoYXNTcGVjaWZpZXJzKGZpcnN0KTtcblxuICAgIGNvbnN0IFtzcGVjaWZpZXJzVGV4dF0gPSBzcGVjaWZpZXJzLnJlZHVjZShcbiAgICAgIChbcmVzdWx0LCBuZWVkc0NvbW1hXSwgc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzVHlwZVNwZWNpZmllciA9IHNwZWNpZmllci5pbXBvcnROb2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJztcblxuICAgICAgICBjb25zdCBwcmVmZXJJbmxpbmUgPSBjb250ZXh0Lm9wdGlvbnNbMF0gJiYgY29udGV4dC5vcHRpb25zWzBdWydwcmVmZXItaW5saW5lJ107XG4gICAgICAgIC8vIGEgdXNlciBtaWdodCBzZXQgcHJlZmVyLWlubGluZSBidXQgbm90IGhhdmUgYSBzdXBwb3J0aW5nIFR5cGVTY3JpcHQgdmVyc2lvbi4gIEZsb3cgZG9lcyBub3Qgc3VwcG9ydCBpbmxpbmUgdHlwZXMgc28gdGhpcyBzaG91bGQgZmFpbCBpbiB0aGF0IGNhc2UgYXMgd2VsbC5cbiAgICAgICAgaWYgKHByZWZlcklubGluZSAmJiAoIXR5cGVzY3JpcHRQa2cgfHwgIXNlbXZlci5zYXRpc2ZpZXModHlwZXNjcmlwdFBrZy52ZXJzaW9uLCAnPj0gNC41JykpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3VyIHZlcnNpb24gb2YgVHlwZVNjcmlwdCBkb2VzIG5vdCBzdXBwb3J0IGlubGluZSB0eXBlIGltcG9ydHMuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbnNlcnRUZXh0ID0gYCR7cHJlZmVySW5saW5lICYmIGlzVHlwZVNwZWNpZmllciA/ICd0eXBlICcgOiAnJ30ke3NwZWNpZmllci50ZXh0fWA7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgbmVlZHNDb21tYSAmJiAhc3BlY2lmaWVyLmlzRW1wdHlcbiAgICAgICAgICAgID8gYCR7cmVzdWx0fSwke2luc2VydFRleHR9YFxuICAgICAgICAgICAgOiBgJHtyZXN1bHR9JHtpbnNlcnRUZXh0fWAsXG4gICAgICAgICAgc3BlY2lmaWVyLmlzRW1wdHkgPyBuZWVkc0NvbW1hIDogdHJ1ZSxcbiAgICAgICAgXTtcbiAgICAgIH0sXG4gICAgICBbJycsICFmaXJzdEhhc1RyYWlsaW5nQ29tbWEgJiYgIWZpcnN0SXNFbXB0eV0sXG4gICAgKTtcblxuICAgIGNvbnN0IGZpeGVzID0gW107XG5cbiAgICBpZiAoc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgPT0gbnVsbCAmJiBzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICAvLyBgaW1wb3J0ICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgZml4ZXMucHVzaChcbiAgICAgICAgZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgJHtkZWZhdWx0SW1wb3J0TmFtZX0sIHske3NwZWNpZmllcnNUZXh0fX0gZnJvbWApLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlID09IG51bGwgJiYgIXNob3VsZEFkZFNwZWNpZmllcnMpIHtcbiAgICAgIC8vIGBpbXBvcnQgJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmIGZyb20gJy4vZm9vJ2BcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgJHtkZWZhdWx0SW1wb3J0TmFtZX0gZnJvbWApKTtcbiAgICB9IGVsc2UgaWYgKHNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlICE9IG51bGwgJiYgY2xvc2VCcmFjZSAhPSBudWxsKSB7XG4gICAgICAvLyBgaW1wb3J0IHsuLi59IGZyb20gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmLCB7Li4ufSBmcm9tICcuL2ZvbydgXG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdFRva2VuLCBgICR7ZGVmYXVsdEltcG9ydE5hbWV9LGApKTtcbiAgICAgIGlmIChzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICAgIC8vIGBpbXBvcnQgZGVmLCB7Li4ufSBmcm9tICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLiwgLi4ufSBmcm9tICcuL2ZvbydgXG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEJlZm9yZShjbG9zZUJyYWNlLCBzcGVjaWZpZXJzVGV4dCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlID09IG51bGwgJiYgc2hvdWxkQWRkU3BlY2lmaWVycykge1xuICAgICAgaWYgKGZpcnN0LnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGBpbXBvcnQgJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdFRva2VuLCBgIHske3NwZWNpZmllcnNUZXh0fX0gZnJvbWApKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGBpbXBvcnQgZGVmIGZyb20gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmLCB7Li4ufSBmcm9tICcuL2ZvbydgXG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0LnNwZWNpZmllcnNbMF0sIGAsIHske3NwZWNpZmllcnNUZXh0fX1gKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgIT0gbnVsbCAmJiBjbG9zZUJyYWNlICE9IG51bGwpIHtcbiAgICAgIC8vIGBpbXBvcnQgey4uLn0gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgey4uLiwgLi4ufSBmcm9tICcuL2ZvbydgXG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRCZWZvcmUoY2xvc2VCcmFjZSwgc3BlY2lmaWVyc1RleHQpKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgaW1wb3J0cyB3aG9zZSBzcGVjaWZpZXJzIGhhdmUgYmVlbiBtb3ZlZCBpbnRvIHRoZSBmaXJzdCBpbXBvcnQuXG4gICAgZm9yIChjb25zdCBzcGVjaWZpZXIgb2Ygc3BlY2lmaWVycykge1xuICAgICAgY29uc3QgaW1wb3J0Tm9kZSA9IHNwZWNpZmllci5pbXBvcnROb2RlO1xuICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmUoaW1wb3J0Tm9kZSkpO1xuXG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZSA9IFtpbXBvcnROb2RlLnJhbmdlWzFdLCBpbXBvcnROb2RlLnJhbmdlWzFdICsgMV07XG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnQgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKGNoYXJBZnRlckltcG9ydFJhbmdlWzBdLCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZVsxXSk7XG4gICAgICBpZiAoY2hhckFmdGVySW1wb3J0ID09PSAnXFxuJykge1xuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZVJhbmdlKGNoYXJBZnRlckltcG9ydFJhbmdlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGltcG9ydHMgd2hvc2UgZGVmYXVsdCBpbXBvcnQgaGFzIGJlZW4gbW92ZWQgdG8gdGhlIGZpcnN0IGltcG9ydCxcbiAgICAvLyBhbmQgc2lkZS1lZmZlY3Qtb25seSBpbXBvcnRzIHRoYXQgYXJlIHVubmVjZXNzYXJ5IGR1ZSB0byB0aGUgZmlyc3RcbiAgICAvLyBpbXBvcnQuXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHVubmVjZXNzYXJ5SW1wb3J0cykge1xuICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmUobm9kZSkpO1xuXG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZSA9IFtub2RlLnJhbmdlWzFdLCBub2RlLnJhbmdlWzFdICsgMV07XG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnQgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKGNoYXJBZnRlckltcG9ydFJhbmdlWzBdLCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZVsxXSk7XG4gICAgICBpZiAoY2hhckFmdGVySW1wb3J0ID09PSAnXFxuJykge1xuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZVJhbmdlKGNoYXJBZnRlckltcG9ydFJhbmdlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpeGVzO1xuICB9O1xufVxuXG5mdW5jdGlvbiBpc1B1bmN0dWF0b3Iobm9kZSwgdmFsdWUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ1B1bmN0dWF0b3InICYmIG5vZGUudmFsdWUgPT09IHZhbHVlO1xufVxuXG4vLyBHZXQgdGhlIG5hbWUgb2YgdGhlIGRlZmF1bHQgaW1wb3J0IG9mIGBub2RlYCwgaWYgYW55LlxuZnVuY3Rpb24gZ2V0RGVmYXVsdEltcG9ydE5hbWUobm9kZSkge1xuICBjb25zdCBkZWZhdWx0U3BlY2lmaWVyID0gbm9kZS5zcGVjaWZpZXJzXG4gICAgLmZpbmQoc3BlY2lmaWVyID0+IHNwZWNpZmllci50eXBlID09PSAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcicpO1xuICByZXR1cm4gZGVmYXVsdFNwZWNpZmllciAhPSBudWxsID8gZGVmYXVsdFNwZWNpZmllci5sb2NhbC5uYW1lIDogdW5kZWZpbmVkO1xufVxuXG4vLyBDaGVja3Mgd2hldGhlciBgbm9kZWAgaGFzIGEgbmFtZXNwYWNlIGltcG9ydC5cbmZ1bmN0aW9uIGhhc05hbWVzcGFjZShub2RlKSB7XG4gIGNvbnN0IHNwZWNpZmllcnMgPSBub2RlLnNwZWNpZmllcnNcbiAgICAuZmlsdGVyKHNwZWNpZmllciA9PiBzcGVjaWZpZXIudHlwZSA9PT0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpO1xuICByZXR1cm4gc3BlY2lmaWVycy5sZW5ndGggPiAwO1xufVxuXG4vLyBDaGVja3Mgd2hldGhlciBgbm9kZWAgaGFzIGFueSBub24tZGVmYXVsdCBzcGVjaWZpZXJzLlxuZnVuY3Rpb24gaGFzU3BlY2lmaWVycyhub2RlKSB7XG4gIGNvbnN0IHNwZWNpZmllcnMgPSBub2RlLnNwZWNpZmllcnNcbiAgICAuZmlsdGVyKHNwZWNpZmllciA9PiBzcGVjaWZpZXIudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpO1xuICByZXR1cm4gc3BlY2lmaWVycy5sZW5ndGggPiAwO1xufVxuXG4vLyBJdCdzIG5vdCBvYnZpb3VzIHdoYXQgdGhlIHVzZXIgd2FudHMgdG8gZG8gd2l0aCBjb21tZW50cyBhc3NvY2lhdGVkIHdpdGhcbi8vIGR1cGxpY2F0ZSBpbXBvcnRzLCBzbyBza2lwIGltcG9ydHMgd2l0aCBjb21tZW50cyB3aGVuIGF1dG9maXhpbmcuXG5mdW5jdGlvbiBoYXNQcm9ibGVtYXRpY0NvbW1lbnRzKG5vZGUsIHNvdXJjZUNvZGUpIHtcbiAgcmV0dXJuIChcbiAgICBoYXNDb21tZW50QmVmb3JlKG5vZGUsIHNvdXJjZUNvZGUpIHx8XG4gICAgaGFzQ29tbWVudEFmdGVyKG5vZGUsIHNvdXJjZUNvZGUpIHx8XG4gICAgaGFzQ29tbWVudEluc2lkZU5vblNwZWNpZmllcnMobm9kZSwgc291cmNlQ29kZSlcbiAgKTtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhIGNvbW1lbnQgKHRoYXQgZW5kcykgb24gdGhlIHByZXZpb3VzIGxpbmUgb3Igb25cbi8vIHRoZSBzYW1lIGxpbmUgYXMgYG5vZGVgIChzdGFydHMpLlxuZnVuY3Rpb24gaGFzQ29tbWVudEJlZm9yZShub2RlLCBzb3VyY2VDb2RlKSB7XG4gIHJldHVybiBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlKG5vZGUpXG4gICAgLnNvbWUoY29tbWVudCA9PiBjb21tZW50LmxvYy5lbmQubGluZSA+PSBub2RlLmxvYy5zdGFydC5saW5lIC0gMSk7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYSBjb21tZW50ICh0aGF0IHN0YXJ0cykgb24gdGhlIHNhbWUgbGluZSBhcyBgbm9kZWBcbi8vIChlbmRzKS5cbmZ1bmN0aW9uIGhhc0NvbW1lbnRBZnRlcihub2RlLCBzb3VyY2VDb2RlKSB7XG4gIHJldHVybiBzb3VyY2VDb2RlLmdldENvbW1lbnRzQWZ0ZXIobm9kZSlcbiAgICAuc29tZShjb21tZW50ID0+IGNvbW1lbnQubG9jLnN0YXJ0LmxpbmUgPT09IG5vZGUubG9jLmVuZC5saW5lKTtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhbnkgY29tbWVudHMgX2luc2lkZSxfIGV4Y2VwdCBpbnNpZGUgdGhlIGB7Li4ufWBcbi8vIHBhcnQgKGlmIGFueSkuXG5mdW5jdGlvbiBoYXNDb21tZW50SW5zaWRlTm9uU3BlY2lmaWVycyhub2RlLCBzb3VyY2VDb2RlKSB7XG4gIGNvbnN0IHRva2VucyA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5zKG5vZGUpO1xuICBjb25zdCBvcGVuQnJhY2VJbmRleCA9IHRva2Vucy5maW5kSW5kZXgodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgY29uc3QgY2xvc2VCcmFjZUluZGV4ID0gdG9rZW5zLmZpbmRJbmRleCh0b2tlbiA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd9JykpO1xuICAvLyBTbGljZSBhd2F5IHRoZSBmaXJzdCB0b2tlbiwgc2luY2Ugd2UncmUgbm8gbG9va2luZyBmb3IgY29tbWVudHMgX2JlZm9yZV9cbiAgLy8gYG5vZGVgIChvbmx5IGluc2lkZSkuIElmIHRoZXJlJ3MgYSBgey4uLn1gIHBhcnQsIGxvb2sgZm9yIGNvbW1lbnRzIGJlZm9yZVxuICAvLyB0aGUgYHtgLCBidXQgbm90IGJlZm9yZSB0aGUgYH1gIChoZW5jZSB0aGUgYCsxYHMpLlxuICBjb25zdCBzb21lVG9rZW5zID0gb3BlbkJyYWNlSW5kZXggPj0gMCAmJiBjbG9zZUJyYWNlSW5kZXggPj0gMFxuICAgID8gdG9rZW5zLnNsaWNlKDEsIG9wZW5CcmFjZUluZGV4ICsgMSkuY29uY2F0KHRva2Vucy5zbGljZShjbG9zZUJyYWNlSW5kZXggKyAxKSlcbiAgICA6IHRva2Vucy5zbGljZSgxKTtcbiAgcmV0dXJuIHNvbWVUb2tlbnMuc29tZSh0b2tlbiA9PiBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlKHRva2VuKS5sZW5ndGggPiAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCByZXBlYXRlZCBpbXBvcnQgb2YgdGhlIHNhbWUgbW9kdWxlIGluIG11bHRpcGxlIHBsYWNlcy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1kdXBsaWNhdGVzJyksXG4gICAgfSxcbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgY29uc2lkZXJRdWVyeVN0cmluZzoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3ByZWZlci1pbmxpbmUnOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgLy8gUHJlcGFyZSB0aGUgcmVzb2x2ZXIgZnJvbSBvcHRpb25zLlxuICAgIGNvbnN0IGNvbnNpZGVyUXVlcnlTdHJpbmdPcHRpb24gPSBjb250ZXh0Lm9wdGlvbnNbMF0gJiZcbiAgICAgIGNvbnRleHQub3B0aW9uc1swXVsnY29uc2lkZXJRdWVyeVN0cmluZyddO1xuICAgIGNvbnN0IGRlZmF1bHRSZXNvbHZlciA9IHNvdXJjZVBhdGggPT4gcmVzb2x2ZShzb3VyY2VQYXRoLCBjb250ZXh0KSB8fCBzb3VyY2VQYXRoO1xuICAgIGNvbnN0IHJlc29sdmVyID0gY29uc2lkZXJRdWVyeVN0cmluZ09wdGlvbiA/IChzb3VyY2VQYXRoID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gc291cmNlUGF0aC5tYXRjaCgvXihbXj9dKilcXD8oLiopJC8pO1xuICAgICAgaWYgKCFwYXJ0cykge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFJlc29sdmVyKHNvdXJjZVBhdGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmF1bHRSZXNvbHZlcihwYXJ0c1sxXSkgKyAnPycgKyBwYXJ0c1syXTtcbiAgICB9KSA6IGRlZmF1bHRSZXNvbHZlcjtcblxuICAgIGNvbnN0IG1vZHVsZU1hcHMgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRJbXBvcnRNYXAobikge1xuICAgICAgaWYgKCFtb2R1bGVNYXBzLmhhcyhuLnBhcmVudCkpIHtcbiAgICAgICAgbW9kdWxlTWFwcy5zZXQobi5wYXJlbnQsIHtcbiAgICAgICAgICBpbXBvcnRlZDogbmV3IE1hcCgpLFxuICAgICAgICAgIG5zSW1wb3J0ZWQ6IG5ldyBNYXAoKSxcbiAgICAgICAgICBkZWZhdWx0VHlwZXNJbXBvcnRlZDogbmV3IE1hcCgpLFxuICAgICAgICAgIG5hbWVkVHlwZXNJbXBvcnRlZDogbmV3IE1hcCgpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcCA9IG1vZHVsZU1hcHMuZ2V0KG4ucGFyZW50KTtcbiAgICAgIGlmIChuLmltcG9ydEtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICByZXR1cm4gbi5zcGVjaWZpZXJzLmxlbmd0aCA+IDAgJiYgbi5zcGVjaWZpZXJzWzBdLnR5cGUgPT09ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyA/IG1hcC5kZWZhdWx0VHlwZXNJbXBvcnRlZCA6IG1hcC5uYW1lZFR5cGVzSW1wb3J0ZWQ7XG4gICAgICB9XG4gICAgICBpZiAobi5zcGVjaWZpZXJzLnNvbWUoKHNwZWMpID0+IHNwZWMuaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSkge1xuICAgICAgICByZXR1cm4gbWFwLm5hbWVkVHlwZXNJbXBvcnRlZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhhc05hbWVzcGFjZShuKSA/IG1hcC5uc0ltcG9ydGVkIDogbWFwLmltcG9ydGVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbihuKSB7XG4gICAgICAgIC8vIHJlc29sdmVkIHBhdGggd2lsbCBjb3ZlciBhbGlhc2VkIGR1cGxpY2F0ZXNcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZXIobi5zb3VyY2UudmFsdWUpO1xuICAgICAgICBjb25zdCBpbXBvcnRNYXAgPSBnZXRJbXBvcnRNYXAobik7XG5cbiAgICAgICAgaWYgKGltcG9ydE1hcC5oYXMocmVzb2x2ZWRQYXRoKSkge1xuICAgICAgICAgIGltcG9ydE1hcC5nZXQocmVzb2x2ZWRQYXRoKS5wdXNoKG4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGltcG9ydE1hcC5zZXQocmVzb2x2ZWRQYXRoLCBbbl0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGNvbnN0IG1hcCBvZiBtb2R1bGVNYXBzLnZhbHVlcygpKSB7XG4gICAgICAgICAgY2hlY2tJbXBvcnRzKG1hcC5pbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgICAgY2hlY2tJbXBvcnRzKG1hcC5uc0ltcG9ydGVkLCBjb250ZXh0KTtcbiAgICAgICAgICBjaGVja0ltcG9ydHMobWFwLmRlZmF1bHRUeXBlc0ltcG9ydGVkLCBjb250ZXh0KTtcbiAgICAgICAgICBjaGVja0ltcG9ydHMobWFwLm5hbWVkVHlwZXNJbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=