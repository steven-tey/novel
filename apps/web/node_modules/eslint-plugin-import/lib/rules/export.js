'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);
var _arrayPrototype = require('array.prototype.flatmap');var _arrayPrototype2 = _interopRequireDefault(_arrayPrototype);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

/*
                                                                                                                                                                                                                        Notes on TypeScript namespaces aka TSModuleDeclaration:
                                                                                                                                                                                                                        
                                                                                                                                                                                                                        There are two forms:
                                                                                                                                                                                                                        - active namespaces: namespace Foo {} / module Foo {}
                                                                                                                                                                                                                        - ambient modules; declare module "eslint-plugin-import" {}
                                                                                                                                                                                                                        
                                                                                                                                                                                                                        active namespaces:
                                                                                                                                                                                                                        - cannot contain a default export
                                                                                                                                                                                                                        - cannot contain an export all
                                                                                                                                                                                                                        - cannot contain a multi name export (export { a, b })
                                                                                                                                                                                                                        - can have active namespaces nested within them
                                                                                                                                                                                                                        
                                                                                                                                                                                                                        ambient namespaces:
                                                                                                                                                                                                                        - can only be defined in .d.ts files
                                                                                                                                                                                                                        - cannot be nested within active namespaces
                                                                                                                                                                                                                        - have no other restrictions
                                                                                                                                                                                                                        */

var rootProgram = 'root';
var tsTypePrefix = 'type:';

/**
                             * Detect function overloads like:
                             * ```ts
                             * export function foo(a: number);
                             * export function foo(a: string);
                             * export function foo(a: number|string) { return a; }
                             * ```
                             * @param {Set<Object>} nodes
                             * @returns {boolean}
                             */
function isTypescriptFunctionOverloads(nodes) {
  var nodesArr = Array.from(nodes);

  var idents = (0, _arrayPrototype2['default'])(nodesArr, function (node) {return (
      node.declaration && (
      node.declaration.type === 'TSDeclareFunction' // eslint 6+
      || node.declaration.type === 'TSEmptyBodyFunctionDeclaration' // eslint 4-5
      ) ?
      node.declaration.id.name :
      []);});

  if (new Set(idents).size !== idents.length) {
    return true;
  }

  var types = new Set(nodesArr.map(function (node) {return node.parent.type;}));
  if (!types.has('TSDeclareFunction')) {
    return false;
  }
  if (types.size === 1) {
    return true;
  }
  if (types.size === 2 && types.has('FunctionDeclaration')) {
    return true;
  }
  return false;
}

/**
   * Detect merging Namespaces with Classes, Functions, or Enums like:
   * ```ts
   * export class Foo { }
   * export namespace Foo { }
   * ```
   * @param {Set<Object>} nodes
   * @returns {boolean}
   */
function isTypescriptNamespaceMerging(nodes) {
  var types = new Set(Array.from(nodes, function (node) {return node.parent.type;}));
  var noNamespaceNodes = Array.from(nodes).filter(function (node) {return node.parent.type !== 'TSModuleDeclaration';});

  return types.has('TSModuleDeclaration') && (

  types.size === 1
  // Merging with functions
  || types.size === 2 && (types.has('FunctionDeclaration') || types.has('TSDeclareFunction')) ||
  types.size === 3 && types.has('FunctionDeclaration') && types.has('TSDeclareFunction')
  // Merging with classes or enums
  || types.size === 2 && (types.has('ClassDeclaration') || types.has('TSEnumDeclaration')) && noNamespaceNodes.length === 1);

}

/**
   * Detect if a typescript namespace node should be reported as multiple export:
   * ```ts
   * export class Foo { }
   * export function Foo();
   * export namespace Foo { }
   * ```
   * @param {Object} node
   * @param {Set<Object>} nodes
   * @returns {boolean}
   */
function shouldSkipTypescriptNamespace(node, nodes) {
  var types = new Set(Array.from(nodes, function (node) {return node.parent.type;}));

  return !isTypescriptNamespaceMerging(nodes) &&
  node.parent.type === 'TSModuleDeclaration' && (

  types.has('TSEnumDeclaration') ||
  types.has('ClassDeclaration') ||
  types.has('FunctionDeclaration') ||
  types.has('TSDeclareFunction'));

}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid any invalid exports, i.e. re-export of the same name.',
      url: (0, _docsUrl2['default'])('export') },

    schema: [] },


  create: function () {function create(context) {
      var namespace = new Map([[rootProgram, new Map()]]);

      function addNamed(name, node, parent, isType) {
        if (!namespace.has(parent)) {
          namespace.set(parent, new Map());
        }
        var named = namespace.get(parent);

        var key = isType ? '' + tsTypePrefix + String(name) : name;
        var nodes = named.get(key);

        if (nodes == null) {
          nodes = new Set();
          named.set(key, nodes);
        }

        nodes.add(node);
      }

      function getParent(node) {
        if (node.parent && node.parent.type === 'TSModuleBlock') {
          return node.parent.parent;
        }

        // just in case somehow a non-ts namespace export declaration isn't directly
        // parented to the root Program node
        return rootProgram;
      }

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {
            addNamed('default', node, getParent(node));
          }return ExportDefaultDeclaration;}(),

        ExportSpecifier: function () {function ExportSpecifier(node) {
            addNamed(
            node.exported.name || node.exported.value,
            node.exported,
            getParent(node.parent));

          }return ExportSpecifier;}(),

        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            if (node.declaration == null) return;

            var parent = getParent(node);
            // support for old TypeScript versions
            var isTypeVariableDecl = node.declaration.kind === 'type';

            if (node.declaration.id != null) {
              if ((0, _arrayIncludes2['default'])([
              'TSTypeAliasDeclaration',
              'TSInterfaceDeclaration'],
              node.declaration.type)) {
                addNamed(node.declaration.id.name, node.declaration.id, parent, true);
              } else {
                addNamed(node.declaration.id.name, node.declaration.id, parent, isTypeVariableDecl);
              }
            }

            if (node.declaration.declarations != null) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
                for (var _iterator = node.declaration.declarations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var declaration = _step.value;
                  (0, _ExportMap.recursivePatternCapture)(declaration.id, function (v) {return (
                      addNamed(v.name, v, parent, isTypeVariableDecl));});
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }
          }return ExportNamedDeclaration;}(),

        ExportAllDeclaration: function () {function ExportAllDeclaration(node) {
            if (node.source == null) return; // not sure if this is ever true

            // `export * as X from 'path'` does not conflict
            if (node.exported && node.exported.name) return;

            var remoteExports = _ExportMap2['default'].get(node.source.value, context);
            if (remoteExports == null) return;

            if (remoteExports.errors.length) {
              remoteExports.reportErrors(context, node);
              return;
            }

            var parent = getParent(node);

            var any = false;
            remoteExports.forEach(function (v, name) {
              if (name !== 'default') {
                any = true; // poor man's filter
                addNamed(name, node, parent);
              }
            });

            if (!any) {
              context.report(
              node.source, 'No named exports found in module \'' + String(
              node.source.value) + '\'.');

            }
          }return ExportAllDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
              for (var _iterator2 = namespace[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _ref = _step2.value;var _ref2 = _slicedToArray(_ref, 2);var named = _ref2[1];var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
                  for (var _iterator3 = named[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var _ref3 = _step3.value;var _ref4 = _slicedToArray(_ref3, 2);var name = _ref4[0];var nodes = _ref4[1];
                    if (nodes.size <= 1) continue;

                    if (isTypescriptFunctionOverloads(nodes) || isTypescriptNamespaceMerging(nodes)) continue;var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {

                      for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
                        if (shouldSkipTypescriptNamespace(node, nodes)) continue;

                        if (name === 'default') {
                          context.report(node, 'Multiple default exports.');
                        } else {
                          context.report(
                          node, 'Multiple exports of name \'' + String(
                          name.replace(tsTypePrefix, '')) + '\'.');

                        }
                      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
                  }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
              }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHBvcnQuanMiXSwibmFtZXMiOlsicm9vdFByb2dyYW0iLCJ0c1R5cGVQcmVmaXgiLCJpc1R5cGVzY3JpcHRGdW5jdGlvbk92ZXJsb2FkcyIsIm5vZGVzIiwibm9kZXNBcnIiLCJBcnJheSIsImZyb20iLCJpZGVudHMiLCJub2RlIiwiZGVjbGFyYXRpb24iLCJ0eXBlIiwiaWQiLCJuYW1lIiwiU2V0Iiwic2l6ZSIsImxlbmd0aCIsInR5cGVzIiwibWFwIiwicGFyZW50IiwiaGFzIiwiaXNUeXBlc2NyaXB0TmFtZXNwYWNlTWVyZ2luZyIsIm5vTmFtZXNwYWNlTm9kZXMiLCJmaWx0ZXIiLCJzaG91bGRTa2lwVHlwZXNjcmlwdE5hbWVzcGFjZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0IiwibmFtZXNwYWNlIiwiTWFwIiwiYWRkTmFtZWQiLCJpc1R5cGUiLCJzZXQiLCJuYW1lZCIsImdldCIsImtleSIsImFkZCIsImdldFBhcmVudCIsIkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbiIsIkV4cG9ydFNwZWNpZmllciIsImV4cG9ydGVkIiwidmFsdWUiLCJFeHBvcnROYW1lZERlY2xhcmF0aW9uIiwiaXNUeXBlVmFyaWFibGVEZWNsIiwia2luZCIsImRlY2xhcmF0aW9ucyIsInYiLCJFeHBvcnRBbGxEZWNsYXJhdGlvbiIsInNvdXJjZSIsInJlbW90ZUV4cG9ydHMiLCJFeHBvcnRNYXAiLCJlcnJvcnMiLCJyZXBvcnRFcnJvcnMiLCJhbnkiLCJmb3JFYWNoIiwicmVwb3J0IiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6InFvQkFBQSx5QztBQUNBLHFDO0FBQ0EsK0M7QUFDQSx5RDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxJQUFNQSxjQUFjLE1BQXBCO0FBQ0EsSUFBTUMsZUFBZSxPQUFyQjs7QUFFQTs7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Q3lDLEdBQUwsRUFBVTtBQUNSMUIsc0JBQVE0QixNQUFSO0FBQ0VyRCxtQkFBSzhDLE1BRFA7QUFFdUM5QyxtQkFBSzhDLE1BQUwsQ0FBWVAsS0FGbkQ7O0FBSUQ7QUFDRixXQXJFSTs7QUF1RUwscUNBQWdCLHVCQUFZO0FBQzFCLG9DQUF3QmIsU0FBeEIsbUlBQW1DLGlFQUFyQkssS0FBcUI7QUFDakMsd0NBQTRCQSxLQUE1QixtSUFBbUMsbUVBQXZCM0IsSUFBdUIsZ0JBQWpCVCxLQUFpQjtBQUNqQyx3QkFBSUEsTUFBTVcsSUFBTixJQUFjLENBQWxCLEVBQXFCOztBQUVyQix3QkFBSVosOEJBQThCQyxLQUE5QixLQUF3Q2lCLDZCQUE2QmpCLEtBQTdCLENBQTVDLEVBQWlGLFNBSGhEOztBQUtqQyw0Q0FBbUJBLEtBQW5CLG1JQUEwQixLQUFmSyxJQUFlO0FBQ3hCLDRCQUFJZSw4QkFBOEJmLElBQTlCLEVBQW9DTCxLQUFwQyxDQUFKLEVBQWdEOztBQUVoRCw0QkFBSVMsU0FBUyxTQUFiLEVBQXdCO0FBQ3RCcUIsa0NBQVE0QixNQUFSLENBQWVyRCxJQUFmLEVBQXFCLDJCQUFyQjtBQUNELHlCQUZELE1BRU87QUFDTHlCLGtDQUFRNEIsTUFBUjtBQUNFckQsOEJBREY7QUFFK0JJLCtCQUFLa0QsT0FBTCxDQUFhN0QsWUFBYixFQUEyQixFQUEzQixDQUYvQjs7QUFJRDtBQUNGLHVCQWhCZ0M7QUFpQmxDLG1CQWxCZ0M7QUFtQmxDLGVBcEJ5QjtBQXFCM0IsV0FyQkQsc0JBdkVLLEVBQVA7O0FBOEZELEtBdkljLG1CQUFqQiIsImZpbGUiOiJleHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhwb3J0TWFwLCB7IHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlIH0gZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuaW1wb3J0IGluY2x1ZGVzIGZyb20gJ2FycmF5LWluY2x1ZGVzJztcbmltcG9ydCBmbGF0TWFwIGZyb20gJ2FycmF5LnByb3RvdHlwZS5mbGF0bWFwJztcblxuLypcbk5vdGVzIG9uIFR5cGVTY3JpcHQgbmFtZXNwYWNlcyBha2EgVFNNb2R1bGVEZWNsYXJhdGlvbjpcblxuVGhlcmUgYXJlIHR3byBmb3Jtczpcbi0gYWN0aXZlIG5hbWVzcGFjZXM6IG5hbWVzcGFjZSBGb28ge30gLyBtb2R1bGUgRm9vIHt9XG4tIGFtYmllbnQgbW9kdWxlczsgZGVjbGFyZSBtb2R1bGUgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiIHt9XG5cbmFjdGl2ZSBuYW1lc3BhY2VzOlxuLSBjYW5ub3QgY29udGFpbiBhIGRlZmF1bHQgZXhwb3J0XG4tIGNhbm5vdCBjb250YWluIGFuIGV4cG9ydCBhbGxcbi0gY2Fubm90IGNvbnRhaW4gYSBtdWx0aSBuYW1lIGV4cG9ydCAoZXhwb3J0IHsgYSwgYiB9KVxuLSBjYW4gaGF2ZSBhY3RpdmUgbmFtZXNwYWNlcyBuZXN0ZWQgd2l0aGluIHRoZW1cblxuYW1iaWVudCBuYW1lc3BhY2VzOlxuLSBjYW4gb25seSBiZSBkZWZpbmVkIGluIC5kLnRzIGZpbGVzXG4tIGNhbm5vdCBiZSBuZXN0ZWQgd2l0aGluIGFjdGl2ZSBuYW1lc3BhY2VzXG4tIGhhdmUgbm8gb3RoZXIgcmVzdHJpY3Rpb25zXG4qL1xuXG5jb25zdCByb290UHJvZ3JhbSA9ICdyb290JztcbmNvbnN0IHRzVHlwZVByZWZpeCA9ICd0eXBlOic7XG5cbi8qKlxuICogRGV0ZWN0IGZ1bmN0aW9uIG92ZXJsb2FkcyBsaWtlOlxuICogYGBgdHNcbiAqIGV4cG9ydCBmdW5jdGlvbiBmb28oYTogbnVtYmVyKTtcbiAqIGV4cG9ydCBmdW5jdGlvbiBmb28oYTogc3RyaW5nKTtcbiAqIGV4cG9ydCBmdW5jdGlvbiBmb28oYTogbnVtYmVyfHN0cmluZykgeyByZXR1cm4gYTsgfVxuICogYGBgXG4gKiBAcGFyYW0ge1NldDxPYmplY3Q+fSBub2Rlc1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVHlwZXNjcmlwdEZ1bmN0aW9uT3ZlcmxvYWRzKG5vZGVzKSB7XG4gIGNvbnN0IG5vZGVzQXJyID0gQXJyYXkuZnJvbShub2Rlcyk7XG5cbiAgY29uc3QgaWRlbnRzID0gZmxhdE1hcChub2Rlc0FyciwgKG5vZGUpID0+IChcbiAgICBub2RlLmRlY2xhcmF0aW9uICYmIChcbiAgICAgIG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ1RTRGVjbGFyZUZ1bmN0aW9uJyAvLyBlc2xpbnQgNitcbiAgICAgIHx8IG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ1RTRW1wdHlCb2R5RnVuY3Rpb25EZWNsYXJhdGlvbicgLy8gZXNsaW50IDQtNVxuICAgIClcbiAgICAgID8gbm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lXG4gICAgICA6IFtdXG4gICkpO1xuICBpZiAobmV3IFNldChpZGVudHMpLnNpemUgIT09IGlkZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IHR5cGVzID0gbmV3IFNldChub2Rlc0Fyci5tYXAobm9kZSA9PiBub2RlLnBhcmVudC50eXBlKSk7XG4gIGlmICghdHlwZXMuaGFzKCdUU0RlY2xhcmVGdW5jdGlvbicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlcy5zaXplID09PSAxKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHR5cGVzLnNpemUgPT09IDIgJiYgdHlwZXMuaGFzKCdGdW5jdGlvbkRlY2xhcmF0aW9uJykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogRGV0ZWN0IG1lcmdpbmcgTmFtZXNwYWNlcyB3aXRoIENsYXNzZXMsIEZ1bmN0aW9ucywgb3IgRW51bXMgbGlrZTpcbiAqIGBgYHRzXG4gKiBleHBvcnQgY2xhc3MgRm9vIHsgfVxuICogZXhwb3J0IG5hbWVzcGFjZSBGb28geyB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U2V0PE9iamVjdD59IG5vZGVzXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNUeXBlc2NyaXB0TmFtZXNwYWNlTWVyZ2luZyhub2Rlcykge1xuICBjb25zdCB0eXBlcyA9IG5ldyBTZXQoQXJyYXkuZnJvbShub2Rlcywgbm9kZSA9PiBub2RlLnBhcmVudC50eXBlKSk7XG4gIGNvbnN0IG5vTmFtZXNwYWNlTm9kZXMgPSBBcnJheS5mcm9tKG5vZGVzKS5maWx0ZXIoKG5vZGUpID0+IG5vZGUucGFyZW50LnR5cGUgIT09ICdUU01vZHVsZURlY2xhcmF0aW9uJyk7XG5cbiAgcmV0dXJuIHR5cGVzLmhhcygnVFNNb2R1bGVEZWNsYXJhdGlvbicpXG4gICAgJiYgKFxuICAgICAgdHlwZXMuc2l6ZSA9PT0gMVxuICAgICAgLy8gTWVyZ2luZyB3aXRoIGZ1bmN0aW9uc1xuICAgICAgfHwgKHR5cGVzLnNpemUgPT09IDIgJiYgKHR5cGVzLmhhcygnRnVuY3Rpb25EZWNsYXJhdGlvbicpIHx8IHR5cGVzLmhhcygnVFNEZWNsYXJlRnVuY3Rpb24nKSkpXG4gICAgICB8fCAodHlwZXMuc2l6ZSA9PT0gMyAmJiB0eXBlcy5oYXMoJ0Z1bmN0aW9uRGVjbGFyYXRpb24nKSAmJiB0eXBlcy5oYXMoJ1RTRGVjbGFyZUZ1bmN0aW9uJykpXG4gICAgICAvLyBNZXJnaW5nIHdpdGggY2xhc3NlcyBvciBlbnVtc1xuICAgICAgfHwgKHR5cGVzLnNpemUgPT09IDIgJiYgKHR5cGVzLmhhcygnQ2xhc3NEZWNsYXJhdGlvbicpIHx8IHR5cGVzLmhhcygnVFNFbnVtRGVjbGFyYXRpb24nKSkgJiYgbm9OYW1lc3BhY2VOb2Rlcy5sZW5ndGggPT09IDEpXG4gICAgKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgYSB0eXBlc2NyaXB0IG5hbWVzcGFjZSBub2RlIHNob3VsZCBiZSByZXBvcnRlZCBhcyBtdWx0aXBsZSBleHBvcnQ6XG4gKiBgYGB0c1xuICogZXhwb3J0IGNsYXNzIEZvbyB7IH1cbiAqIGV4cG9ydCBmdW5jdGlvbiBGb28oKTtcbiAqIGV4cG9ydCBuYW1lc3BhY2UgRm9vIHsgfVxuICogYGBgXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuICogQHBhcmFtIHtTZXQ8T2JqZWN0Pn0gbm9kZXNcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBzaG91bGRTa2lwVHlwZXNjcmlwdE5hbWVzcGFjZShub2RlLCBub2Rlcykge1xuICBjb25zdCB0eXBlcyA9IG5ldyBTZXQoQXJyYXkuZnJvbShub2Rlcywgbm9kZSA9PiBub2RlLnBhcmVudC50eXBlKSk7XG5cbiAgcmV0dXJuICFpc1R5cGVzY3JpcHROYW1lc3BhY2VNZXJnaW5nKG5vZGVzKVxuICAgICYmIG5vZGUucGFyZW50LnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJ1xuICAgICYmIChcbiAgICAgIHR5cGVzLmhhcygnVFNFbnVtRGVjbGFyYXRpb24nKVxuICAgICAgfHwgdHlwZXMuaGFzKCdDbGFzc0RlY2xhcmF0aW9uJylcbiAgICAgIHx8IHR5cGVzLmhhcygnRnVuY3Rpb25EZWNsYXJhdGlvbicpXG4gICAgICB8fCB0eXBlcy5oYXMoJ1RTRGVjbGFyZUZ1bmN0aW9uJylcbiAgICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ0hlbHBmdWwgd2FybmluZ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgYW55IGludmFsaWQgZXhwb3J0cywgaS5lLiByZS1leHBvcnQgb2YgdGhlIHNhbWUgbmFtZS4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdleHBvcnQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgTWFwKFtbcm9vdFByb2dyYW0sIG5ldyBNYXAoKV1dKTtcblxuICAgIGZ1bmN0aW9uIGFkZE5hbWVkKG5hbWUsIG5vZGUsIHBhcmVudCwgaXNUeXBlKSB7XG4gICAgICBpZiAoIW5hbWVzcGFjZS5oYXMocGFyZW50KSkge1xuICAgICAgICBuYW1lc3BhY2Uuc2V0KHBhcmVudCwgbmV3IE1hcCgpKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5hbWVkID0gbmFtZXNwYWNlLmdldChwYXJlbnQpO1xuXG4gICAgICBjb25zdCBrZXkgPSBpc1R5cGUgPyBgJHt0c1R5cGVQcmVmaXh9JHtuYW1lfWAgOiBuYW1lO1xuICAgICAgbGV0IG5vZGVzID0gbmFtZWQuZ2V0KGtleSk7XG5cbiAgICAgIGlmIChub2RlcyA9PSBudWxsKSB7XG4gICAgICAgIG5vZGVzID0gbmV3IFNldCgpO1xuICAgICAgICBuYW1lZC5zZXQoa2V5LCBub2Rlcyk7XG4gICAgICB9XG5cbiAgICAgIG5vZGVzLmFkZChub2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJlbnQobm9kZSkge1xuICAgICAgaWYgKG5vZGUucGFyZW50ICYmIG5vZGUucGFyZW50LnR5cGUgPT09ICdUU01vZHVsZUJsb2NrJykge1xuICAgICAgICByZXR1cm4gbm9kZS5wYXJlbnQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICAvLyBqdXN0IGluIGNhc2Ugc29tZWhvdyBhIG5vbi10cyBuYW1lc3BhY2UgZXhwb3J0IGRlY2xhcmF0aW9uIGlzbid0IGRpcmVjdGx5XG4gICAgICAvLyBwYXJlbnRlZCB0byB0aGUgcm9vdCBQcm9ncmFtIG5vZGVcbiAgICAgIHJldHVybiByb290UHJvZ3JhbTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgYWRkTmFtZWQoJ2RlZmF1bHQnLCBub2RlLCBnZXRQYXJlbnQobm9kZSkpO1xuICAgICAgfSxcblxuICAgICAgRXhwb3J0U3BlY2lmaWVyKG5vZGUpIHtcbiAgICAgICAgYWRkTmFtZWQoXG4gICAgICAgICAgbm9kZS5leHBvcnRlZC5uYW1lIHx8IG5vZGUuZXhwb3J0ZWQudmFsdWUsXG4gICAgICAgICAgbm9kZS5leHBvcnRlZCxcbiAgICAgICAgICBnZXRQYXJlbnQobm9kZS5wYXJlbnQpLFxuICAgICAgICApO1xuICAgICAgfSxcblxuICAgICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uID09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwYXJlbnQgPSBnZXRQYXJlbnQobm9kZSk7XG4gICAgICAgIC8vIHN1cHBvcnQgZm9yIG9sZCBUeXBlU2NyaXB0IHZlcnNpb25zXG4gICAgICAgIGNvbnN0IGlzVHlwZVZhcmlhYmxlRGVjbCA9IG5vZGUuZGVjbGFyYXRpb24ua2luZCA9PT0gJ3R5cGUnO1xuXG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLmlkICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAoaW5jbHVkZXMoW1xuICAgICAgICAgICAgJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nLFxuICAgICAgICAgICAgJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nLFxuICAgICAgICAgIF0sIG5vZGUuZGVjbGFyYXRpb24udHlwZSkpIHtcbiAgICAgICAgICAgIGFkZE5hbWVkKG5vZGUuZGVjbGFyYXRpb24uaWQubmFtZSwgbm9kZS5kZWNsYXJhdGlvbi5pZCwgcGFyZW50LCB0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkTmFtZWQobm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lLCBub2RlLmRlY2xhcmF0aW9uLmlkLCBwYXJlbnQsIGlzVHlwZVZhcmlhYmxlRGVjbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zICE9IG51bGwpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGRlY2xhcmF0aW9uIG9mIG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShkZWNsYXJhdGlvbi5pZCwgdiA9PlxuICAgICAgICAgICAgICBhZGROYW1lZCh2Lm5hbWUsIHYsIHBhcmVudCwgaXNUeXBlVmFyaWFibGVEZWNsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBFeHBvcnRBbGxEZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnNvdXJjZSA9PSBudWxsKSByZXR1cm47IC8vIG5vdCBzdXJlIGlmIHRoaXMgaXMgZXZlciB0cnVlXG5cbiAgICAgICAgLy8gYGV4cG9ydCAqIGFzIFggZnJvbSAncGF0aCdgIGRvZXMgbm90IGNvbmZsaWN0XG4gICAgICAgIGlmIChub2RlLmV4cG9ydGVkICYmIG5vZGUuZXhwb3J0ZWQubmFtZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZUV4cG9ydHMgPSBFeHBvcnRNYXAuZ2V0KG5vZGUuc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlbW90ZUV4cG9ydHMgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChyZW1vdGVFeHBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICByZW1vdGVFeHBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBub2RlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXJlbnQgPSBnZXRQYXJlbnQobm9kZSk7XG5cbiAgICAgICAgbGV0IGFueSA9IGZhbHNlO1xuICAgICAgICByZW1vdGVFeHBvcnRzLmZvckVhY2goKHYsIG5hbWUpID0+IHtcbiAgICAgICAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICBhbnkgPSB0cnVlOyAvLyBwb29yIG1hbidzIGZpbHRlclxuICAgICAgICAgICAgYWRkTmFtZWQobmFtZSwgbm9kZSwgcGFyZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghYW55KSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBub2RlLnNvdXJjZSxcbiAgICAgICAgICAgIGBObyBuYW1lZCBleHBvcnRzIGZvdW5kIGluIG1vZHVsZSAnJHtub2RlLnNvdXJjZS52YWx1ZX0nLmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChjb25zdCBbLCBuYW1lZF0gb2YgbmFtZXNwYWNlKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBbbmFtZSwgbm9kZXNdIG9mIG5hbWVkKSB7XG4gICAgICAgICAgICBpZiAobm9kZXMuc2l6ZSA8PSAxKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKGlzVHlwZXNjcmlwdEZ1bmN0aW9uT3ZlcmxvYWRzKG5vZGVzKSB8fCBpc1R5cGVzY3JpcHROYW1lc3BhY2VNZXJnaW5nKG5vZGVzKSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcFR5cGVzY3JpcHROYW1lc3BhY2Uobm9kZSwgbm9kZXMpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZSwgJ011bHRpcGxlIGRlZmF1bHQgZXhwb3J0cy4nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICBgTXVsdGlwbGUgZXhwb3J0cyBvZiBuYW1lICcke25hbWUucmVwbGFjZSh0c1R5cGVQcmVmaXgsICcnKX0nLmAsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==