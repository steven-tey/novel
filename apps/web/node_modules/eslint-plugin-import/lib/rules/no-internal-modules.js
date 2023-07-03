'use strict';var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid importing the submodules of other modules.',
      url: (0, _docsUrl2['default'])('no-internal-modules') },


    schema: [
    {
      anyOf: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string' } } },



        additionalProperties: false },

      {
        type: 'object',
        properties: {
          forbid: {
            type: 'array',
            items: {
              type: 'string' } } },



        additionalProperties: false }] }] },






  create: function () {function noReachingInside(context) {
      var options = context.options[0] || {};
      var allowRegexps = (options.allow || []).map(function (p) {return _minimatch2['default'].makeRe(p);});
      var forbidRegexps = (options.forbid || []).map(function (p) {return _minimatch2['default'].makeRe(p);});

      // minimatch patterns are expected to use / path separators, like import
      // statements, so normalize paths to use the same
      function normalizeSep(somePath) {
        return somePath.split('\\').join('/');
      }

      function toSteps(somePath) {
        return normalizeSep(somePath).
        split('/').
        reduce(function (acc, step) {
          if (!step || step === '.') {
            return acc;
          } else if (step === '..') {
            return acc.slice(0, -1);
          } else {
            return acc.concat(step);
          }
        }, []);
      }

      // test if reaching to this destination is allowed
      function reachingAllowed(importPath) {
        return allowRegexps.some(function (re) {return re.test(importPath);});
      }

      // test if reaching to this destination is forbidden
      function reachingForbidden(importPath) {
        return forbidRegexps.some(function (re) {return re.test(importPath);});
      }

      function isAllowViolation(importPath) {
        var steps = toSteps(importPath);

        var nonScopeSteps = steps.filter(function (step) {return step.indexOf('@') !== 0;});
        if (nonScopeSteps.length <= 1) return false;

        // before trying to resolve, see if the raw import (with relative
        // segments resolved) matches an allowed pattern
        var justSteps = steps.join('/');
        if (reachingAllowed(justSteps) || reachingAllowed('/' + String(justSteps))) return false;

        // if the import statement doesn't match directly, try to match the
        // resolved path if the import is resolvable
        var resolved = (0, _resolve2['default'])(importPath, context);
        if (!resolved || reachingAllowed(normalizeSep(resolved))) return false;

        // this import was not allowed by the allowed paths, and reaches
        // so it is a violation
        return true;
      }

      function isForbidViolation(importPath) {
        var steps = toSteps(importPath);

        // before trying to resolve, see if the raw import (with relative
        // segments resolved) matches a forbidden pattern
        var justSteps = steps.join('/');

        if (reachingForbidden(justSteps) || reachingForbidden('/' + String(justSteps))) return true;

        // if the import statement doesn't match directly, try to match the
        // resolved path if the import is resolvable
        var resolved = (0, _resolve2['default'])(importPath, context);
        if (resolved && reachingForbidden(normalizeSep(resolved))) return true;

        // this import was not forbidden by the forbidden paths so it is not a violation
        return false;
      }

      // find a directory that is being reached into, but which shouldn't be
      var isReachViolation = options.forbid ? isForbidViolation : isAllowViolation;

      function checkImportForReaching(importPath, node) {
        var potentialViolationTypes = ['parent', 'index', 'sibling', 'external', 'internal'];
        if (potentialViolationTypes.indexOf((0, _importType2['default'])(importPath, context)) !== -1 &&
        isReachViolation(importPath))
        {
          context.report({
            node: node,
            message: 'Reaching to "' + String(importPath) + '" is not allowed.' });

        }
      }

      return (0, _moduleVisitor2['default'])(function (source) {
        checkImportForReaching(source.value, source);
      }, { commonjs: true });
    }return noReachingInside;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1pbnRlcm5hbC1tb2R1bGVzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiYW55T2YiLCJwcm9wZXJ0aWVzIiwiYWxsb3ciLCJpdGVtcyIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiZm9yYmlkIiwiY3JlYXRlIiwibm9SZWFjaGluZ0luc2lkZSIsImNvbnRleHQiLCJvcHRpb25zIiwiYWxsb3dSZWdleHBzIiwibWFwIiwibWluaW1hdGNoIiwibWFrZVJlIiwicCIsImZvcmJpZFJlZ2V4cHMiLCJub3JtYWxpemVTZXAiLCJzb21lUGF0aCIsInNwbGl0Iiwiam9pbiIsInRvU3RlcHMiLCJyZWR1Y2UiLCJhY2MiLCJzdGVwIiwic2xpY2UiLCJjb25jYXQiLCJyZWFjaGluZ0FsbG93ZWQiLCJpbXBvcnRQYXRoIiwic29tZSIsInJlIiwidGVzdCIsInJlYWNoaW5nRm9yYmlkZGVuIiwiaXNBbGxvd1Zpb2xhdGlvbiIsInN0ZXBzIiwibm9uU2NvcGVTdGVwcyIsImZpbHRlciIsImluZGV4T2YiLCJsZW5ndGgiLCJqdXN0U3RlcHMiLCJyZXNvbHZlZCIsImlzRm9yYmlkVmlvbGF0aW9uIiwiaXNSZWFjaFZpb2xhdGlvbiIsImNoZWNrSW1wb3J0Rm9yUmVhY2hpbmciLCJub2RlIiwicG90ZW50aWFsVmlvbGF0aW9uVHlwZXMiLCJyZXBvcnQiLCJtZXNzYWdlIiwic291cmNlIiwidmFsdWUiLCJjb21tb25qcyJdLCJtYXBwaW5ncyI6ImFBQUEsc0M7O0FBRUEsc0Q7QUFDQSxnRDtBQUNBLGtFO0FBQ0EscUM7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxpQkFETjtBQUVKQyxtQkFBYSxtREFGVDtBQUdKQyxXQUFLLDBCQUFR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Q0QsT0FGTSxFQUVKLEVBQUVFLFVBQVUsSUFBWixFQUZJLENBQVA7QUFHRCxLQTVGRCxPQUFpQjFDLGdCQUFqQixJQXpDZSxFQUFqQiIsImZpbGUiOiJuby1pbnRlcm5hbC1tb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcbmltcG9ydCBtb2R1bGVWaXNpdG9yIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvbW9kdWxlVmlzaXRvcic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdGF0aWMgYW5hbHlzaXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgaW1wb3J0aW5nIHRoZSBzdWJtb2R1bGVzIG9mIG90aGVyIG1vZHVsZXMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8taW50ZXJuYWwtbW9kdWxlcycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmb3JiaWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbm9SZWFjaGluZ0luc2lkZShjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgICBjb25zdCBhbGxvd1JlZ2V4cHMgPSAob3B0aW9ucy5hbGxvdyB8fCBbXSkubWFwKHAgPT4gbWluaW1hdGNoLm1ha2VSZShwKSk7XG4gICAgY29uc3QgZm9yYmlkUmVnZXhwcyA9IChvcHRpb25zLmZvcmJpZCB8fCBbXSkubWFwKHAgPT4gbWluaW1hdGNoLm1ha2VSZShwKSk7XG5cbiAgICAvLyBtaW5pbWF0Y2ggcGF0dGVybnMgYXJlIGV4cGVjdGVkIHRvIHVzZSAvIHBhdGggc2VwYXJhdG9ycywgbGlrZSBpbXBvcnRcbiAgICAvLyBzdGF0ZW1lbnRzLCBzbyBub3JtYWxpemUgcGF0aHMgdG8gdXNlIHRoZSBzYW1lXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplU2VwKHNvbWVQYXRoKSB7XG4gICAgICByZXR1cm4gc29tZVBhdGguc3BsaXQoJ1xcXFwnKS5qb2luKCcvJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9TdGVwcyhzb21lUGF0aCkge1xuICAgICAgcmV0dXJuICBub3JtYWxpemVTZXAoc29tZVBhdGgpXG4gICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgc3RlcCkgPT4ge1xuICAgICAgICAgIGlmICghc3RlcCB8fCBzdGVwID09PSAnLicpIHtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGVwID09PSAnLi4nKSB7XG4gICAgICAgICAgICByZXR1cm4gYWNjLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFjYy5jb25jYXQoc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgLy8gdGVzdCBpZiByZWFjaGluZyB0byB0aGlzIGRlc3RpbmF0aW9uIGlzIGFsbG93ZWRcbiAgICBmdW5jdGlvbiByZWFjaGluZ0FsbG93ZWQoaW1wb3J0UGF0aCkge1xuICAgICAgcmV0dXJuIGFsbG93UmVnZXhwcy5zb21lKHJlID0+IHJlLnRlc3QoaW1wb3J0UGF0aCkpO1xuICAgIH1cblxuICAgIC8vIHRlc3QgaWYgcmVhY2hpbmcgdG8gdGhpcyBkZXN0aW5hdGlvbiBpcyBmb3JiaWRkZW5cbiAgICBmdW5jdGlvbiByZWFjaGluZ0ZvcmJpZGRlbihpbXBvcnRQYXRoKSB7XG4gICAgICByZXR1cm4gZm9yYmlkUmVnZXhwcy5zb21lKHJlID0+IHJlLnRlc3QoaW1wb3J0UGF0aCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWxsb3dWaW9sYXRpb24oaW1wb3J0UGF0aCkge1xuICAgICAgY29uc3Qgc3RlcHMgPSB0b1N0ZXBzKGltcG9ydFBhdGgpO1xuXG4gICAgICBjb25zdCBub25TY29wZVN0ZXBzID0gc3RlcHMuZmlsdGVyKHN0ZXAgPT4gc3RlcC5pbmRleE9mKCdAJykgIT09IDApO1xuICAgICAgaWYgKG5vblNjb3BlU3RlcHMubGVuZ3RoIDw9IDEpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gYmVmb3JlIHRyeWluZyB0byByZXNvbHZlLCBzZWUgaWYgdGhlIHJhdyBpbXBvcnQgKHdpdGggcmVsYXRpdmVcbiAgICAgIC8vIHNlZ21lbnRzIHJlc29sdmVkKSBtYXRjaGVzIGFuIGFsbG93ZWQgcGF0dGVyblxuICAgICAgY29uc3QganVzdFN0ZXBzID0gc3RlcHMuam9pbignLycpO1xuICAgICAgaWYgKHJlYWNoaW5nQWxsb3dlZChqdXN0U3RlcHMpIHx8IHJlYWNoaW5nQWxsb3dlZChgLyR7anVzdFN0ZXBzfWApKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIGlmIHRoZSBpbXBvcnQgc3RhdGVtZW50IGRvZXNuJ3QgbWF0Y2ggZGlyZWN0bHksIHRyeSB0byBtYXRjaCB0aGVcbiAgICAgIC8vIHJlc29sdmVkIHBhdGggaWYgdGhlIGltcG9ydCBpcyByZXNvbHZhYmxlXG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmUoaW1wb3J0UGF0aCwgY29udGV4dCk7XG4gICAgICBpZiAoIXJlc29sdmVkIHx8IHJlYWNoaW5nQWxsb3dlZChub3JtYWxpemVTZXAocmVzb2x2ZWQpKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyB0aGlzIGltcG9ydCB3YXMgbm90IGFsbG93ZWQgYnkgdGhlIGFsbG93ZWQgcGF0aHMsIGFuZCByZWFjaGVzXG4gICAgICAvLyBzbyBpdCBpcyBhIHZpb2xhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNGb3JiaWRWaW9sYXRpb24oaW1wb3J0UGF0aCkge1xuICAgICAgY29uc3Qgc3RlcHMgPSB0b1N0ZXBzKGltcG9ydFBhdGgpO1xuXG4gICAgICAvLyBiZWZvcmUgdHJ5aW5nIHRvIHJlc29sdmUsIHNlZSBpZiB0aGUgcmF3IGltcG9ydCAod2l0aCByZWxhdGl2ZVxuICAgICAgLy8gc2VnbWVudHMgcmVzb2x2ZWQpIG1hdGNoZXMgYSBmb3JiaWRkZW4gcGF0dGVyblxuICAgICAgY29uc3QganVzdFN0ZXBzID0gc3RlcHMuam9pbignLycpO1xuXG4gICAgICBpZiAocmVhY2hpbmdGb3JiaWRkZW4oanVzdFN0ZXBzKSB8fCByZWFjaGluZ0ZvcmJpZGRlbihgLyR7anVzdFN0ZXBzfWApKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgLy8gaWYgdGhlIGltcG9ydCBzdGF0ZW1lbnQgZG9lc24ndCBtYXRjaCBkaXJlY3RseSwgdHJ5IHRvIG1hdGNoIHRoZVxuICAgICAgLy8gcmVzb2x2ZWQgcGF0aCBpZiB0aGUgaW1wb3J0IGlzIHJlc29sdmFibGVcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShpbXBvcnRQYXRoLCBjb250ZXh0KTtcbiAgICAgIGlmIChyZXNvbHZlZCAmJiByZWFjaGluZ0ZvcmJpZGRlbihub3JtYWxpemVTZXAocmVzb2x2ZWQpKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgIC8vIHRoaXMgaW1wb3J0IHdhcyBub3QgZm9yYmlkZGVuIGJ5IHRoZSBmb3JiaWRkZW4gcGF0aHMgc28gaXQgaXMgbm90IGEgdmlvbGF0aW9uXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gZmluZCBhIGRpcmVjdG9yeSB0aGF0IGlzIGJlaW5nIHJlYWNoZWQgaW50bywgYnV0IHdoaWNoIHNob3VsZG4ndCBiZVxuICAgIGNvbnN0IGlzUmVhY2hWaW9sYXRpb24gPSBvcHRpb25zLmZvcmJpZCA/IGlzRm9yYmlkVmlvbGF0aW9uIDogaXNBbGxvd1Zpb2xhdGlvbjtcblxuICAgIGZ1bmN0aW9uIGNoZWNrSW1wb3J0Rm9yUmVhY2hpbmcoaW1wb3J0UGF0aCwgbm9kZSkge1xuICAgICAgY29uc3QgcG90ZW50aWFsVmlvbGF0aW9uVHlwZXMgPSBbJ3BhcmVudCcsICdpbmRleCcsICdzaWJsaW5nJywgJ2V4dGVybmFsJywgJ2ludGVybmFsJ107XG4gICAgICBpZiAocG90ZW50aWFsVmlvbGF0aW9uVHlwZXMuaW5kZXhPZihpbXBvcnRUeXBlKGltcG9ydFBhdGgsIGNvbnRleHQpKSAhPT0gLTEgJiZcbiAgICAgICAgaXNSZWFjaFZpb2xhdGlvbihpbXBvcnRQYXRoKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IGBSZWFjaGluZyB0byBcIiR7aW1wb3J0UGF0aH1cIiBpcyBub3QgYWxsb3dlZC5gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kdWxlVmlzaXRvcigoc291cmNlKSA9PiB7XG4gICAgICBjaGVja0ltcG9ydEZvclJlYWNoaW5nKHNvdXJjZS52YWx1ZSwgc291cmNlKTtcbiAgICB9LCB7IGNvbW1vbmpzOiB0cnVlIH0pO1xuICB9LFxufTtcbiJdfQ==