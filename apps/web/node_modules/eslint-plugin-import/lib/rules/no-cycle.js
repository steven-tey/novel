'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @fileOverview Ensures that no imported module imports the linted module.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @author Ben Mosher
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importType = require('../core/importType');
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

var traversed = new Set();

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid a module from importing a module with a dependency path back to itself.',
      url: (0, _docsUrl2['default'])('no-cycle') },

    schema: [(0, _moduleVisitor.makeOptionsSchema)({
      maxDepth: {
        anyOf: [
        {
          description: 'maximum dependency depth to traverse',
          type: 'integer',
          minimum: 1 },

        {
          'enum': ['∞'],
          type: 'string' }] },



      ignoreExternal: {
        description: 'ignore external modules',
        type: 'boolean',
        'default': false },

      allowUnsafeDynamicCyclicDependency: {
        description: 'Allow cyclic dependency if there is at least one dynamic import in the chain',
        type: 'boolean',
        'default': false } })] },




  create: function () {function create(context) {
      var myPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      if (myPath === '<text>') return {}; // can't cycle-check a non-file

      var options = context.options[0] || {};
      var maxDepth = typeof options.maxDepth === 'number' ? options.maxDepth : Infinity;
      var ignoreModule = function () {function ignoreModule(name) {return options.ignoreExternal && (0, _importType.isExternalModule)(
          name,
          (0, _resolve2['default'])(name, context),
          context);}return ignoreModule;}();


      function checkSourceValue(sourceNode, importer) {
        if (ignoreModule(sourceNode.value)) {
          return; // ignore external modules
        }
        if (options.allowUnsafeDynamicCyclicDependency && (
        // Ignore `import()`
        importer.type === 'ImportExpression' ||
        // `require()` calls are always checked (if possible)
        importer.type === 'CallExpression' && importer.callee.name !== 'require')) {
          return; // cycle via dynamic import allowed by config
        }

        if (
        importer.type === 'ImportDeclaration' && (
        // import type { Foo } (TS and Flow)
        importer.importKind === 'type' ||
        // import { type Foo } (Flow)
        importer.specifiers.every(function (_ref) {var importKind = _ref.importKind;return importKind === 'type';})))

        {
          return; // ignore type imports
        }

        var imported = _ExportMap2['default'].get(sourceNode.value, context);

        if (imported == null) {
          return; // no-unresolved territory
        }

        if (imported.path === myPath) {
          return; // no-self-import territory
        }

        var untraversed = [{ mget: function () {function mget() {return imported;}return mget;}(), route: [] }];
        function detectCycle(_ref2) {var mget = _ref2.mget,route = _ref2.route;
          var m = mget();
          if (m == null) return;
          if (traversed.has(m.path)) return;
          traversed.add(m.path);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

            for (var _iterator = m.imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref3 = _step.value;var _ref4 = _slicedToArray(_ref3, 2);var path = _ref4[0];var _ref4$ = _ref4[1];var getter = _ref4$.getter;var declarations = _ref4$.declarations;
              if (traversed.has(path)) continue;
              var toTraverse = [].concat(_toConsumableArray(declarations)).filter(function (_ref5) {var source = _ref5.source,isOnlyImportingTypes = _ref5.isOnlyImportingTypes;return (
                  !ignoreModule(source.value) &&
                  // Ignore only type imports
                  !isOnlyImportingTypes);});


              /*
                                             If cyclic dependency is allowed via dynamic import, skip checking if any module is imported dynamically
                                             */
              if (options.allowUnsafeDynamicCyclicDependency && toTraverse.some(function (d) {return d.dynamic;})) return;

              /*
                                                                                                                           Only report as a cycle if there are any import declarations that are considered by
                                                                                                                           the rule. For example:
                                                                                                                            a.ts:
                                                                                                                           import { foo } from './b' // should not be reported as a cycle
                                                                                                                            b.ts:
                                                                                                                           import type { Bar } from './a'
                                                                                                                           */


              if (path === myPath && toTraverse.length > 0) return true;
              if (route.length + 1 < maxDepth) {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
                  for (var _iterator2 = toTraverse[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _ref6 = _step2.value;var source = _ref6.source;
                    untraversed.push({ mget: getter, route: route.concat(source) });
                  }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
              }
            }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
        }

        while (untraversed.length > 0) {
          var next = untraversed.shift(); // bfs!
          if (detectCycle(next)) {
            var message = next.route.length > 0 ? 'Dependency cycle via ' + String(
            routeString(next.route)) :
            'Dependency cycle detected.';
            context.report(importer, message);
            return;
          }
        }
      }

      return Object.assign((0, _moduleVisitor2['default'])(checkSourceValue, context.options[0]), {
        'Program:exit': function () {function ProgramExit() {
            traversed.clear();
          }return ProgramExit;}() });

    }return create;}() };


function routeString(route) {
  return route.map(function (s) {return String(s.value) + ':' + String(s.loc.start.line);}).join('=>');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1jeWNsZS5qcyJdLCJuYW1lcyI6WyJ0cmF2ZXJzZWQiLCJTZXQiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsIm1heERlcHRoIiwiYW55T2YiLCJtaW5pbXVtIiwiaWdub3JlRXh0ZXJuYWwiLCJhbGxvd1Vuc2FmZUR5bmFtaWNDeWNsaWNEZXBlbmRlbmN5IiwiY3JlYXRlIiwiY29udGV4dCIsIm15UGF0aCIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm9wdGlvbnMiLCJJbmZpbml0eSIsImlnbm9yZU1vZHVsZSIsIm5hbWUiLCJjaGVja1NvdXJjZVZhbHVlIiwic291cmNlTm9kZSIsImltcG9ydGVyIiwidmFsdWUiLCJjYWxsZWUiLCJpbXBvcnRLaW5kIiwic3BlY2lmaWVycyIsImV2ZXJ5IiwiaW1wb3J0ZWQiLCJFeHBvcnRzIiwiZ2V0IiwicGF0aCIsInVudHJhdmVyc2VkIiwibWdldCIsInJvdXRlIiwiZGV0ZWN0Q3ljbGUiLCJtIiwiaGFzIiwiYWRkIiwiaW1wb3J0cyIsImdldHRlciIsImRlY2xhcmF0aW9ucyIsInRvVHJhdmVyc2UiLCJmaWx0ZXIiLCJzb3VyY2UiLCJpc09ubHlJbXBvcnRpbmdUeXBlcyIsInNvbWUiLCJkIiwiZHluYW1pYyIsImxlbmd0aCIsInB1c2giLCJjb25jYXQiLCJuZXh0Iiwic2hpZnQiLCJtZXNzYWdlIiwicm91dGVTdHJpbmciLCJyZXBvcnQiLCJPYmplY3QiLCJhc3NpZ24iLCJjbGVhciIsIm1hcCIsInMiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJqb2luIl0sIm1hcHBpbmdzIjoic29CQUFBOzs7OztBQUtBLHNEO0FBQ0EseUM7QUFDQTtBQUNBLGtFO0FBQ0EscUM7O0FBRUEsSUFBTUEsWUFBWSxJQUFJQyxHQUFKLEVBQWxCOztBQUVBQyxPQUFPQyxPQUFQLEdB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O0FBQ2xDLGNBQUlsQixZQUFZaUIsSUFBWixDQUFKLEVBQXVCO0FBQ3JCLGdCQUFNRSxVQUFXRixLQUFLbEIsS0FBTCxDQUFXZSxNQUFYLEdBQW9CLENBQXBCO0FBQ1dNLHdCQUFZSCxLQUFLbEIsS0FBakIsQ0FEWDtBQUViLHdDQUZKO0FBR0F0QixvQkFBUTRDLE1BQVIsQ0FBZWxDLFFBQWYsRUFBeUJnQyxPQUF6QjtBQUNBO0FBQ0Q7QUFDRjtBQUNGOztBQUVELGFBQU9HLE9BQU9DLE1BQVAsQ0FBYyxnQ0FBY3RDLGdCQUFkLEVBQWdDUixRQUFRSSxPQUFSLENBQWdCLENBQWhCLENBQWhDLENBQWQsRUFBbUU7QUFDeEUscUNBQWdCLHVCQUFNO0FBQ3BCckIsc0JBQVVnRSxLQUFWO0FBQ0QsV0FGRCxzQkFEd0UsRUFBbkUsQ0FBUDs7QUFLRCxLQXhJYyxtQkFBakI7OztBQTJJQSxTQUFTSixXQUFULENBQXFCckIsS0FBckIsRUFBNEI7QUFDMUIsU0FBT0EsTUFBTTBCLEdBQU4sQ0FBVSw0QkFBUUMsRUFBRXRDLEtBQVYsaUJBQW1Cc0MsRUFBRUMsR0FBRixDQUFNQyxLQUFOLENBQVlDLElBQS9CLEdBQVYsRUFBaURDLElBQWpELENBQXNELElBQXRELENBQVA7QUFDRCIsImZpbGUiOiJuby1jeWNsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlldyBFbnN1cmVzIHRoYXQgbm8gaW1wb3J0ZWQgbW9kdWxlIGltcG9ydHMgdGhlIGxpbnRlZCBtb2R1bGUuXG4gKiBAYXV0aG9yIEJlbiBNb3NoZXJcbiAqL1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCB7IGlzRXh0ZXJuYWxNb2R1bGUgfSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnO1xuaW1wb3J0IG1vZHVsZVZpc2l0b3IsIHsgbWFrZU9wdGlvbnNTY2hlbWEgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmNvbnN0IHRyYXZlcnNlZCA9IG5ldyBTZXQoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdGF0aWMgYW5hbHlzaXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgYSBtb2R1bGUgZnJvbSBpbXBvcnRpbmcgYSBtb2R1bGUgd2l0aCBhIGRlcGVuZGVuY3kgcGF0aCBiYWNrIHRvIGl0c2VsZi4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1jeWNsZScpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbbWFrZU9wdGlvbnNTY2hlbWEoe1xuICAgICAgbWF4RGVwdGg6IHtcbiAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ21heGltdW0gZGVwZW5kZW5jeSBkZXB0aCB0byB0cmF2ZXJzZScsXG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgICBtaW5pbXVtOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZW51bTogWyfiiJ4nXSxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgaWdub3JlRXh0ZXJuYWw6IHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdpZ25vcmUgZXh0ZXJuYWwgbW9kdWxlcycsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYWxsb3dVbnNhZmVEeW5hbWljQ3ljbGljRGVwZW5kZW5jeToge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ0FsbG93IGN5Y2xpYyBkZXBlbmRlbmN5IGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBkeW5hbWljIGltcG9ydCBpbiB0aGUgY2hhaW4nLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KV0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBteVBhdGggPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcbiAgICBpZiAobXlQYXRoID09PSAnPHRleHQ+JykgcmV0dXJuIHt9OyAvLyBjYW4ndCBjeWNsZS1jaGVjayBhIG5vbi1maWxlXG5cbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IG1heERlcHRoID0gdHlwZW9mIG9wdGlvbnMubWF4RGVwdGggPT09ICdudW1iZXInID8gb3B0aW9ucy5tYXhEZXB0aCA6IEluZmluaXR5O1xuICAgIGNvbnN0IGlnbm9yZU1vZHVsZSA9IChuYW1lKSA9PiBvcHRpb25zLmlnbm9yZUV4dGVybmFsICYmIGlzRXh0ZXJuYWxNb2R1bGUoXG4gICAgICBuYW1lLFxuICAgICAgcmVzb2x2ZShuYW1lLCBjb250ZXh0KSxcbiAgICAgIGNvbnRleHQsXG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrU291cmNlVmFsdWUoc291cmNlTm9kZSwgaW1wb3J0ZXIpIHtcbiAgICAgIGlmIChpZ25vcmVNb2R1bGUoc291cmNlTm9kZS52YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBpZ25vcmUgZXh0ZXJuYWwgbW9kdWxlc1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuYWxsb3dVbnNhZmVEeW5hbWljQ3ljbGljRGVwZW5kZW5jeSAmJiAoXG4gICAgICAgIC8vIElnbm9yZSBgaW1wb3J0KClgXG4gICAgICAgIGltcG9ydGVyLnR5cGUgPT09ICdJbXBvcnRFeHByZXNzaW9uJyB8fFxuICAgICAgICAvLyBgcmVxdWlyZSgpYCBjYWxscyBhcmUgYWx3YXlzIGNoZWNrZWQgKGlmIHBvc3NpYmxlKVxuICAgICAgICAoaW1wb3J0ZXIudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJiBpbXBvcnRlci5jYWxsZWUubmFtZSAhPT0gJ3JlcXVpcmUnKSkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBjeWNsZSB2aWEgZHluYW1pYyBpbXBvcnQgYWxsb3dlZCBieSBjb25maWdcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBpbXBvcnRlci50eXBlID09PSAnSW1wb3J0RGVjbGFyYXRpb24nICYmIChcbiAgICAgICAgICAvLyBpbXBvcnQgdHlwZSB7IEZvbyB9IChUUyBhbmQgRmxvdylcbiAgICAgICAgICBpbXBvcnRlci5pbXBvcnRLaW5kID09PSAndHlwZScgfHxcbiAgICAgICAgICAvLyBpbXBvcnQgeyB0eXBlIEZvbyB9IChGbG93KVxuICAgICAgICAgIGltcG9ydGVyLnNwZWNpZmllcnMuZXZlcnkoKHsgaW1wb3J0S2luZCB9KSA9PiBpbXBvcnRLaW5kID09PSAndHlwZScpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICByZXR1cm47IC8vIGlnbm9yZSB0eXBlIGltcG9ydHNcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW1wb3J0ZWQgPSBFeHBvcnRzLmdldChzb3VyY2VOb2RlLnZhbHVlLCBjb250ZXh0KTtcblxuICAgICAgaWYgKGltcG9ydGVkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuOyAgLy8gbm8tdW5yZXNvbHZlZCB0ZXJyaXRvcnlcbiAgICAgIH1cblxuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IG15UGF0aCkge1xuICAgICAgICByZXR1cm47ICAvLyBuby1zZWxmLWltcG9ydCB0ZXJyaXRvcnlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdW50cmF2ZXJzZWQgPSBbeyBtZ2V0OiAoKSA9PiBpbXBvcnRlZCwgcm91dGU6W10gfV07XG4gICAgICBmdW5jdGlvbiBkZXRlY3RDeWNsZSh7IG1nZXQsIHJvdXRlIH0pIHtcbiAgICAgICAgY29uc3QgbSA9IG1nZXQoKTtcbiAgICAgICAgaWYgKG0gPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpZiAodHJhdmVyc2VkLmhhcyhtLnBhdGgpKSByZXR1cm47XG4gICAgICAgIHRyYXZlcnNlZC5hZGQobS5wYXRoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IFtwYXRoLCB7IGdldHRlciwgZGVjbGFyYXRpb25zIH1dIG9mIG0uaW1wb3J0cykge1xuICAgICAgICAgIGlmICh0cmF2ZXJzZWQuaGFzKHBhdGgpKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCB0b1RyYXZlcnNlID0gWy4uLmRlY2xhcmF0aW9uc10uZmlsdGVyKCh7IHNvdXJjZSwgaXNPbmx5SW1wb3J0aW5nVHlwZXMgfSkgPT5cbiAgICAgICAgICAgICFpZ25vcmVNb2R1bGUoc291cmNlLnZhbHVlKSAmJlxuICAgICAgICAgICAgLy8gSWdub3JlIG9ubHkgdHlwZSBpbXBvcnRzXG4gICAgICAgICAgICAhaXNPbmx5SW1wb3J0aW5nVHlwZXMsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgSWYgY3ljbGljIGRlcGVuZGVuY3kgaXMgYWxsb3dlZCB2aWEgZHluYW1pYyBpbXBvcnQsIHNraXAgY2hlY2tpbmcgaWYgYW55IG1vZHVsZSBpcyBpbXBvcnRlZCBkeW5hbWljYWxseVxuICAgICAgICAgICovXG4gICAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dVbnNhZmVEeW5hbWljQ3ljbGljRGVwZW5kZW5jeSAmJiB0b1RyYXZlcnNlLnNvbWUoZCA9PiBkLmR5bmFtaWMpKSByZXR1cm47XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgIE9ubHkgcmVwb3J0IGFzIGEgY3ljbGUgaWYgdGhlcmUgYXJlIGFueSBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgYXJlIGNvbnNpZGVyZWQgYnlcbiAgICAgICAgICB0aGUgcnVsZS4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBhLnRzOlxuICAgICAgICAgIGltcG9ydCB7IGZvbyB9IGZyb20gJy4vYicgLy8gc2hvdWxkIG5vdCBiZSByZXBvcnRlZCBhcyBhIGN5Y2xlXG5cbiAgICAgICAgICBiLnRzOlxuICAgICAgICAgIGltcG9ydCB0eXBlIHsgQmFyIH0gZnJvbSAnLi9hJ1xuICAgICAgICAgICovXG4gICAgICAgICAgaWYgKHBhdGggPT09IG15UGF0aCAmJiB0b1RyYXZlcnNlLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmIChyb3V0ZS5sZW5ndGggKyAxIDwgbWF4RGVwdGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgeyBzb3VyY2UgfSBvZiB0b1RyYXZlcnNlKSB7XG4gICAgICAgICAgICAgIHVudHJhdmVyc2VkLnB1c2goeyBtZ2V0OiBnZXR0ZXIsIHJvdXRlOiByb3V0ZS5jb25jYXQoc291cmNlKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHVudHJhdmVyc2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHVudHJhdmVyc2VkLnNoaWZ0KCk7IC8vIGJmcyFcbiAgICAgICAgaWYgKGRldGVjdEN5Y2xlKG5leHQpKSB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IChuZXh0LnJvdXRlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gYERlcGVuZGVuY3kgY3ljbGUgdmlhICR7cm91dGVTdHJpbmcobmV4dC5yb3V0ZSl9YFxuICAgICAgICAgICAgOiAnRGVwZW5kZW5jeSBjeWNsZSBkZXRlY3RlZC4nKTtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbXBvcnRlciwgbWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obW9kdWxlVmlzaXRvcihjaGVja1NvdXJjZVZhbHVlLCBjb250ZXh0Lm9wdGlvbnNbMF0pLCB7XG4gICAgICAnUHJvZ3JhbTpleGl0JzogKCkgPT4ge1xuICAgICAgICB0cmF2ZXJzZWQuY2xlYXIoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiByb3V0ZVN0cmluZyhyb3V0ZSkge1xuICByZXR1cm4gcm91dGUubWFwKHMgPT4gYCR7cy52YWx1ZX06JHtzLmxvYy5zdGFydC5saW5lfWApLmpvaW4oJz0+Jyk7XG59XG4iXX0=