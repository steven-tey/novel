'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _isGlob = require('is-glob');var _isGlob2 = _interopRequireDefault(_isGlob);
var _minimatch = require('minimatch');
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var containsPath = function containsPath(filepath, target) {
  var relative = _path2['default'].relative(target, filepath);
  return relative === '' || !relative.startsWith('..');
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Enforce which files can be imported in a given folder.',
      url: (0, _docsUrl2['default'])('no-restricted-paths') },


    schema: [
    {
      type: 'object',
      properties: {
        zones: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              target: {
                anyOf: [
                { type: 'string' },
                {
                  type: 'array',
                  items: { type: 'string' },
                  uniqueItems: true,
                  minLength: 1 }] },



              from: {
                anyOf: [
                { type: 'string' },
                {
                  type: 'array',
                  items: { type: 'string' },
                  uniqueItems: true,
                  minLength: 1 }] },



              except: {
                type: 'array',
                items: {
                  type: 'string' },

                uniqueItems: true },

              message: { type: 'string' } },

            additionalProperties: false } },


        basePath: { type: 'string' } },

      additionalProperties: false }] },




  create: function () {function noRestrictedPaths(context) {
      var options = context.options[0] || {};
      var restrictedPaths = options.zones || [];
      var basePath = options.basePath || process.cwd();
      var currentFilename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      var matchingZones = restrictedPaths.filter(function (zone) {
        return [].concat(zone.target).
        map(function (target) {return _path2['default'].resolve(basePath, target);}).
        some(function (targetPath) {return isMatchingTargetPath(currentFilename, targetPath);});
      });

      function isMatchingTargetPath(filename, targetPath) {
        if ((0, _isGlob2['default'])(targetPath)) {
          var mm = new _minimatch.Minimatch(targetPath);
          return mm.match(filename);
        }

        return containsPath(filename, targetPath);
      }

      function isValidExceptionPath(absoluteFromPath, absoluteExceptionPath) {
        var relativeExceptionPath = _path2['default'].relative(absoluteFromPath, absoluteExceptionPath);

        return (0, _importType2['default'])(relativeExceptionPath, context) !== 'parent';
      }

      function areBothGlobPatternAndAbsolutePath(areGlobPatterns) {
        return areGlobPatterns.some(function (isGlob) {return isGlob;}) && areGlobPatterns.some(function (isGlob) {return !isGlob;});
      }

      function reportInvalidExceptionPath(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be descendants of the configured `from` path for that zone.' });

      }

      function reportInvalidExceptionMixedGlobAndNonGlob(node) {
        context.report({
          node: node,
          message: 'Restricted path `from` must contain either only glob patterns or none' });

      }

      function reportInvalidExceptionGlob(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be glob patterns when `from` contains glob patterns' });

      }

      function computeMixedGlobAndAbsolutePathValidator() {
        return {
          isPathRestricted: function () {function isPathRestricted() {return true;}return isPathRestricted;}(),
          hasValidExceptions: false,
          reportInvalidException: reportInvalidExceptionMixedGlobAndNonGlob };

      }

      function computeGlobPatternPathValidator(absoluteFrom, zoneExcept) {
        var isPathException = void 0;

        var mm = new _minimatch.Minimatch(absoluteFrom);
        var isPathRestricted = function () {function isPathRestricted(absoluteImportPath) {return mm.match(absoluteImportPath);}return isPathRestricted;}();
        var hasValidExceptions = zoneExcept.every(_isGlob2['default']);

        if (hasValidExceptions) {
          var exceptionsMm = zoneExcept.map(function (except) {return new _minimatch.Minimatch(except);});
          isPathException = function () {function isPathException(absoluteImportPath) {return exceptionsMm.some(function (mm) {return mm.match(absoluteImportPath);});}return isPathException;}();
        }

        var reportInvalidException = reportInvalidExceptionGlob;

        return {
          isPathRestricted: isPathRestricted,
          hasValidExceptions: hasValidExceptions,
          isPathException: isPathException,
          reportInvalidException: reportInvalidException };

      }

      function computeAbsolutePathValidator(absoluteFrom, zoneExcept) {
        var isPathException = void 0;

        var isPathRestricted = function () {function isPathRestricted(absoluteImportPath) {return containsPath(absoluteImportPath, absoluteFrom);}return isPathRestricted;}();

        var absoluteExceptionPaths = zoneExcept.
        map(function (exceptionPath) {return _path2['default'].resolve(absoluteFrom, exceptionPath);});
        var hasValidExceptions = absoluteExceptionPaths.
        every(function (absoluteExceptionPath) {return isValidExceptionPath(absoluteFrom, absoluteExceptionPath);});

        if (hasValidExceptions) {
          isPathException = function () {function isPathException(absoluteImportPath) {return absoluteExceptionPaths.some(
              function (absoluteExceptionPath) {return containsPath(absoluteImportPath, absoluteExceptionPath);});}return isPathException;}();

        }

        var reportInvalidException = reportInvalidExceptionPath;

        return {
          isPathRestricted: isPathRestricted,
          hasValidExceptions: hasValidExceptions,
          isPathException: isPathException,
          reportInvalidException: reportInvalidException };

      }

      function reportInvalidExceptions(validators, node) {
        validators.forEach(function (validator) {return validator.reportInvalidException(node);});
      }

      function reportImportsInRestrictedZone(validators, node, importPath, customMessage) {
        validators.forEach(function () {
          context.report({
            node: node,
            message: 'Unexpected path "{{importPath}}" imported in restricted zone.' + (customMessage ? ' ' + String(customMessage) : ''),
            data: { importPath: importPath } });

        });
      }

      var makePathValidators = function () {function makePathValidators(zoneFrom) {var zoneExcept = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          var allZoneFrom = [].concat(zoneFrom);
          var areGlobPatterns = allZoneFrom.map(_isGlob2['default']);

          if (areBothGlobPatternAndAbsolutePath(areGlobPatterns)) {
            return [computeMixedGlobAndAbsolutePathValidator()];
          }

          var isGlobPattern = areGlobPatterns.every(function (isGlob) {return isGlob;});

          return allZoneFrom.map(function (singleZoneFrom) {
            var absoluteFrom = _path2['default'].resolve(basePath, singleZoneFrom);

            if (isGlobPattern) {
              return computeGlobPatternPathValidator(absoluteFrom, zoneExcept);
            }
            return computeAbsolutePathValidator(absoluteFrom, zoneExcept);
          });
        }return makePathValidators;}();

      var validators = [];

      function checkForRestrictedImportPath(importPath, node) {
        var absoluteImportPath = (0, _resolve2['default'])(importPath, context);

        if (!absoluteImportPath) {
          return;
        }

        matchingZones.forEach(function (zone, index) {
          if (!validators[index]) {
            validators[index] = makePathValidators(zone.from, zone.except);
          }

          var applicableValidatorsForImportPath = validators[index].filter(function (validator) {return validator.isPathRestricted(absoluteImportPath);});

          var validatorsWithInvalidExceptions = applicableValidatorsForImportPath.filter(function (validator) {return !validator.hasValidExceptions;});
          reportInvalidExceptions(validatorsWithInvalidExceptions, node);

          var applicableValidatorsForImportPathExcludingExceptions = applicableValidatorsForImportPath.
          filter(function (validator) {return validator.hasValidExceptions;}).
          filter(function (validator) {return !validator.isPathException(absoluteImportPath);});
          reportImportsInRestrictedZone(applicableValidatorsForImportPathExcludingExceptions, node, importPath, zone.message);
        });
      }

      return (0, _moduleVisitor2['default'])(function (source) {
        checkForRestrictedImportPath(source.value, source);
      }, { commonjs: true });
    }return noRestrictedPaths;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1yZXN0cmljdGVkLXBhdGhzLmpzIl0sIm5hbWVzIjpbImNvbnRhaW5zUGF0aCIsImZpbGVwYXRoIiwidGFyZ2V0IiwicmVsYXRpdmUiLCJwYXRoIiwic3RhcnRzV2l0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsInpvbmVzIiwibWluSXRlbXMiLCJpdGVtcyIsImFueU9mIiwidW5pcXVlSXRlbXMiLCJtaW5MZW5ndGgiLCJmcm9tIiwiZXhjZXB0IiwibWVzc2FnZSIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiYmFzZVBhdGgiLCJjcmVhdGUiLCJub1Jlc3RyaWN0ZWRQYXRocyIsImNvbnRleHQiLCJvcHRpb25zIiwicmVzdHJpY3RlZFBhdGhzIiwicHJvY2VzcyIsImN3ZCIsImN1cnJlbnRGaWxlbmFtZSIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hdGNoaW5nWm9uZXMiLCJmaWx0ZXIiLCJ6b25lIiwiY29uY2F0IiwibWFwIiwicmVzb2x2ZSIsInNvbWUiLCJpc01hdGNoaW5nVGFyZ2V0UGF0aCIsInRhcmdldFBhdGgiLCJmaWxlbmFtZSIsIm1tIiwiTWluaW1hdGNoIiwibWF0Y2giLCJpc1ZhbGlkRXhjZXB0aW9uUGF0aCIsImFic29sdXRlRnJvbVBhdGgiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGgiLCJyZWxhdGl2ZUV4Y2VwdGlvblBhdGgiLCJhcmVCb3RoR2xvYlBhdHRlcm5BbmRBYnNvbHV0ZVBhdGgiLCJhcmVHbG9iUGF0dGVybnMiLCJpc0dsb2IiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aCIsIm5vZGUiLCJyZXBvcnQiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uTWl4ZWRHbG9iQW5kTm9uR2xvYiIsInJlcG9ydEludmFsaWRFeGNlcHRpb25HbG9iIiwiY29tcHV0ZU1peGVkR2xvYkFuZEFic29sdXRlUGF0aFZhbGlkYXRvciIsImlzUGF0aFJlc3RyaWN0ZWQiLCJoYXNWYWxpZEV4Y2VwdGlvbnMiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uIiwiY29tcHV0ZUdsb2JQYXR0ZXJuUGF0aFZhbGlkYXRvciIsImFic29sdXRlRnJvbSIsInpvbmVFeGNlcHQiLCJpc1BhdGhFeGNlcHRpb24iLCJhYnNvbHV0ZUltcG9ydFBhdGgiLCJldmVyeSIsImV4Y2VwdGlvbnNNbSIsImNvbXB1dGVBYnNvbHV0ZVBhdGhWYWxpZGF0b3IiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzIiwiZXhjZXB0aW9uUGF0aCIsInJlcG9ydEludmFsaWRFeGNlcHRpb25zIiwidmFsaWRhdG9ycyIsImZvckVhY2giLCJ2YWxpZGF0b3IiLCJyZXBvcnRJbXBvcnRzSW5SZXN0cmljdGVkWm9uZSIsImltcG9ydFBhdGgiLCJjdXN0b21NZXNzYWdlIiwiZGF0YSIsIm1ha2VQYXRoVmFsaWRhdG9ycyIsInpvbmVGcm9tIiwiYWxsWm9uZUZyb20iLCJpc0dsb2JQYXR0ZXJuIiwic2luZ2xlWm9uZUZyb20iLCJjaGVja0ZvclJlc3RyaWN0ZWRJbXBvcnRQYXRoIiwiaW5kZXgiLCJhcHBsaWNhYmxlVmFsaWRhdG9yc0ZvckltcG9ydFBhdGgiLCJ2YWxpZGF0b3JzV2l0aEludmFsaWRFeGNlcHRpb25zIiwiYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoRXhjbHVkaW5nRXhjZXB0aW9ucyIsInNvdXJjZSIsInZhbHVlIiwiY29tbW9uanMiXSwibWFwcGluZ3MiOiJhQUFBLDRCOztBQUVBLHNEO0FBQ0Esa0U7QUFDQSxpQztBQUNBO0FBQ0EscUM7QUFDQSxnRDs7QUFFQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsUUFBRCxFQUFXQyxNQUFYLEVBQXNCO0FBQ3pDLE1BQU1DLFdBQVdDLGtCQUFLRCxRQUFMLENBQWNELE1BQWQsRUFBc0JELFFBQXRCLENBQWpCO0FBQ0EsU0FBT0UsYUFB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QWMsVUFBQ3NFLE1BQUQsRUFBWTtBQUMvQkwscUNBQTZCSyxPQUFPQyxLQUFwQyxFQUEyQ0QsTUFBM0M7QUFDRCxPQUZNLEVBRUosRUFBRUUsVUFBVSxJQUFaLEVBRkksQ0FBUDtBQUdELEtBMUtELE9BQWlCcEUsaUJBQWpCLElBNURlLEVBQWpCIiwiZmlsZSI6Im5vLXJlc3RyaWN0ZWQtcGF0aHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBtb2R1bGVWaXNpdG9yIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvbW9kdWxlVmlzaXRvcic7XG5pbXBvcnQgaXNHbG9iIGZyb20gJ2lzLWdsb2InO1xuaW1wb3J0IHsgTWluaW1hdGNoIH0gZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcblxuY29uc3QgY29udGFpbnNQYXRoID0gKGZpbGVwYXRoLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcmVsYXRpdmUgPSBwYXRoLnJlbGF0aXZlKHRhcmdldCwgZmlsZXBhdGgpO1xuICByZXR1cm4gcmVsYXRpdmUgPT09ICcnIHx8ICFyZWxhdGl2ZS5zdGFydHNXaXRoKCcuLicpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdGF0aWMgYW5hbHlzaXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbmZvcmNlIHdoaWNoIGZpbGVzIGNhbiBiZSBpbXBvcnRlZCBpbiBhIGdpdmVuIGZvbGRlci4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1yZXN0cmljdGVkLXBhdGhzJyksXG4gICAgfSxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHpvbmVzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgbWluSXRlbXM6IDEsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmcm9tOiB7XG4gICAgICAgICAgICAgICAgICBhbnlPZjogW1xuICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgdW5pcXVlSXRlbXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAxLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4Y2VwdDoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmFzZVBhdGg6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbm9SZXN0cmljdGVkUGF0aHMoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgcmVzdHJpY3RlZFBhdGhzID0gb3B0aW9ucy56b25lcyB8fCBbXTtcbiAgICBjb25zdCBiYXNlUGF0aCA9IG9wdGlvbnMuYmFzZVBhdGggfHwgcHJvY2Vzcy5jd2QoKTtcbiAgICBjb25zdCBjdXJyZW50RmlsZW5hbWUgPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcbiAgICBjb25zdCBtYXRjaGluZ1pvbmVzID0gcmVzdHJpY3RlZFBhdGhzLmZpbHRlcigoem9uZSkgPT4ge1xuICAgICAgcmV0dXJuIFtdLmNvbmNhdCh6b25lLnRhcmdldClcbiAgICAgICAgLm1hcCh0YXJnZXQgPT4gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCB0YXJnZXQpKVxuICAgICAgICAuc29tZSh0YXJnZXRQYXRoID0+IGlzTWF0Y2hpbmdUYXJnZXRQYXRoKGN1cnJlbnRGaWxlbmFtZSwgdGFyZ2V0UGF0aCkpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaXNNYXRjaGluZ1RhcmdldFBhdGgoZmlsZW5hbWUsIHRhcmdldFBhdGgpIHtcbiAgICAgIGlmIChpc0dsb2IodGFyZ2V0UGF0aCkpIHtcbiAgICAgICAgY29uc3QgbW0gPSBuZXcgTWluaW1hdGNoKHRhcmdldFBhdGgpO1xuICAgICAgICByZXR1cm4gbW0ubWF0Y2goZmlsZW5hbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGFpbnNQYXRoKGZpbGVuYW1lLCB0YXJnZXRQYXRoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkRXhjZXB0aW9uUGF0aChhYnNvbHV0ZUZyb21QYXRoLCBhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlRXhjZXB0aW9uUGF0aCA9IHBhdGgucmVsYXRpdmUoYWJzb2x1dGVGcm9tUGF0aCwgYWJzb2x1dGVFeGNlcHRpb25QYXRoKTtcblxuICAgICAgcmV0dXJuIGltcG9ydFR5cGUocmVsYXRpdmVFeGNlcHRpb25QYXRoLCBjb250ZXh0KSAhPT0gJ3BhcmVudCc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXJlQm90aEdsb2JQYXR0ZXJuQW5kQWJzb2x1dGVQYXRoKGFyZUdsb2JQYXR0ZXJucykge1xuICAgICAgcmV0dXJuIGFyZUdsb2JQYXR0ZXJucy5zb21lKChpc0dsb2IpID0+IGlzR2xvYikgJiYgYXJlR2xvYlBhdHRlcm5zLnNvbWUoKGlzR2xvYikgPT4gIWlzR2xvYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwb3J0SW52YWxpZEV4Y2VwdGlvblBhdGgobm9kZSkge1xuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlLFxuICAgICAgICBtZXNzYWdlOiAnUmVzdHJpY3RlZCBwYXRoIGV4Y2VwdGlvbnMgbXVzdCBiZSBkZXNjZW5kYW50cyBvZiB0aGUgY29uZmlndXJlZCBgZnJvbWAgcGF0aCBmb3IgdGhhdCB6b25lLicsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBvcnRJbnZhbGlkRXhjZXB0aW9uTWl4ZWRHbG9iQW5kTm9uR2xvYihub2RlKSB7XG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG5vZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdSZXN0cmljdGVkIHBhdGggYGZyb21gIG11c3QgY29udGFpbiBlaXRoZXIgb25seSBnbG9iIHBhdHRlcm5zIG9yIG5vbmUnLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwb3J0SW52YWxpZEV4Y2VwdGlvbkdsb2Iobm9kZSkge1xuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlLFxuICAgICAgICBtZXNzYWdlOiAnUmVzdHJpY3RlZCBwYXRoIGV4Y2VwdGlvbnMgbXVzdCBiZSBnbG9iIHBhdHRlcm5zIHdoZW4gYGZyb21gIGNvbnRhaW5zIGdsb2IgcGF0dGVybnMnLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZU1peGVkR2xvYkFuZEFic29sdXRlUGF0aFZhbGlkYXRvcigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUGF0aFJlc3RyaWN0ZWQ6ICgpID0+IHRydWUsXG4gICAgICAgIGhhc1ZhbGlkRXhjZXB0aW9uczogZmFsc2UsXG4gICAgICAgIHJlcG9ydEludmFsaWRFeGNlcHRpb246IHJlcG9ydEludmFsaWRFeGNlcHRpb25NaXhlZEdsb2JBbmROb25HbG9iLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlR2xvYlBhdHRlcm5QYXRoVmFsaWRhdG9yKGFic29sdXRlRnJvbSwgem9uZUV4Y2VwdCkge1xuICAgICAgbGV0IGlzUGF0aEV4Y2VwdGlvbjtcblxuICAgICAgY29uc3QgbW0gPSBuZXcgTWluaW1hdGNoKGFic29sdXRlRnJvbSk7XG4gICAgICBjb25zdCBpc1BhdGhSZXN0cmljdGVkID0gKGFic29sdXRlSW1wb3J0UGF0aCkgPT4gbW0ubWF0Y2goYWJzb2x1dGVJbXBvcnRQYXRoKTtcbiAgICAgIGNvbnN0IGhhc1ZhbGlkRXhjZXB0aW9ucyA9IHpvbmVFeGNlcHQuZXZlcnkoaXNHbG9iKTtcblxuICAgICAgaWYgKGhhc1ZhbGlkRXhjZXB0aW9ucykge1xuICAgICAgICBjb25zdCBleGNlcHRpb25zTW0gPSB6b25lRXhjZXB0Lm1hcCgoZXhjZXB0KSA9PiBuZXcgTWluaW1hdGNoKGV4Y2VwdCkpO1xuICAgICAgICBpc1BhdGhFeGNlcHRpb24gPSAoYWJzb2x1dGVJbXBvcnRQYXRoKSA9PiBleGNlcHRpb25zTW0uc29tZSgobW0pID0+IG1tLm1hdGNoKGFic29sdXRlSW1wb3J0UGF0aCkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXBvcnRJbnZhbGlkRXhjZXB0aW9uID0gcmVwb3J0SW52YWxpZEV4Y2VwdGlvbkdsb2I7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUGF0aFJlc3RyaWN0ZWQsXG4gICAgICAgIGhhc1ZhbGlkRXhjZXB0aW9ucyxcbiAgICAgICAgaXNQYXRoRXhjZXB0aW9uLFxuICAgICAgICByZXBvcnRJbnZhbGlkRXhjZXB0aW9uLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlQWJzb2x1dGVQYXRoVmFsaWRhdG9yKGFic29sdXRlRnJvbSwgem9uZUV4Y2VwdCkge1xuICAgICAgbGV0IGlzUGF0aEV4Y2VwdGlvbjtcblxuICAgICAgY29uc3QgaXNQYXRoUmVzdHJpY3RlZCA9IChhYnNvbHV0ZUltcG9ydFBhdGgpID0+IGNvbnRhaW5zUGF0aChhYnNvbHV0ZUltcG9ydFBhdGgsIGFic29sdXRlRnJvbSk7XG5cbiAgICAgIGNvbnN0IGFic29sdXRlRXhjZXB0aW9uUGF0aHMgPSB6b25lRXhjZXB0XG4gICAgICAgIC5tYXAoKGV4Y2VwdGlvblBhdGgpID0+IHBhdGgucmVzb2x2ZShhYnNvbHV0ZUZyb20sIGV4Y2VwdGlvblBhdGgpKTtcbiAgICAgIGNvbnN0IGhhc1ZhbGlkRXhjZXB0aW9ucyA9IGFic29sdXRlRXhjZXB0aW9uUGF0aHNcbiAgICAgICAgLmV2ZXJ5KChhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpID0+IGlzVmFsaWRFeGNlcHRpb25QYXRoKGFic29sdXRlRnJvbSwgYWJzb2x1dGVFeGNlcHRpb25QYXRoKSk7XG5cbiAgICAgIGlmIChoYXNWYWxpZEV4Y2VwdGlvbnMpIHtcbiAgICAgICAgaXNQYXRoRXhjZXB0aW9uID0gKGFic29sdXRlSW1wb3J0UGF0aCkgPT4gYWJzb2x1dGVFeGNlcHRpb25QYXRocy5zb21lKFxuICAgICAgICAgIChhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpID0+IGNvbnRhaW5zUGF0aChhYnNvbHV0ZUltcG9ydFBhdGgsIGFic29sdXRlRXhjZXB0aW9uUGF0aCksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcG9ydEludmFsaWRFeGNlcHRpb24gPSByZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNQYXRoUmVzdHJpY3RlZCxcbiAgICAgICAgaGFzVmFsaWRFeGNlcHRpb25zLFxuICAgICAgICBpc1BhdGhFeGNlcHRpb24sXG4gICAgICAgIHJlcG9ydEludmFsaWRFeGNlcHRpb24sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEludmFsaWRFeGNlcHRpb25zKHZhbGlkYXRvcnMsIG5vZGUpIHtcbiAgICAgIHZhbGlkYXRvcnMuZm9yRWFjaCh2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnJlcG9ydEludmFsaWRFeGNlcHRpb24obm9kZSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEltcG9ydHNJblJlc3RyaWN0ZWRab25lKHZhbGlkYXRvcnMsIG5vZGUsIGltcG9ydFBhdGgsIGN1c3RvbU1lc3NhZ2UpIHtcbiAgICAgIHZhbGlkYXRvcnMuZm9yRWFjaCgoKSA9PiB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IGBVbmV4cGVjdGVkIHBhdGggXCJ7e2ltcG9ydFBhdGh9fVwiIGltcG9ydGVkIGluIHJlc3RyaWN0ZWQgem9uZS4ke2N1c3RvbU1lc3NhZ2UgPyBgICR7Y3VzdG9tTWVzc2FnZX1gIDogJyd9YCxcbiAgICAgICAgICBkYXRhOiB7IGltcG9ydFBhdGggfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlUGF0aFZhbGlkYXRvcnMgPSAoem9uZUZyb20sIHpvbmVFeGNlcHQgPSBbXSkgPT4ge1xuICAgICAgY29uc3QgYWxsWm9uZUZyb20gPSBbXS5jb25jYXQoem9uZUZyb20pO1xuICAgICAgY29uc3QgYXJlR2xvYlBhdHRlcm5zID0gYWxsWm9uZUZyb20ubWFwKGlzR2xvYik7XG5cbiAgICAgIGlmIChhcmVCb3RoR2xvYlBhdHRlcm5BbmRBYnNvbHV0ZVBhdGgoYXJlR2xvYlBhdHRlcm5zKSkge1xuICAgICAgICByZXR1cm4gW2NvbXB1dGVNaXhlZEdsb2JBbmRBYnNvbHV0ZVBhdGhWYWxpZGF0b3IoKV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzR2xvYlBhdHRlcm4gPSBhcmVHbG9iUGF0dGVybnMuZXZlcnkoKGlzR2xvYikgPT4gaXNHbG9iKTtcblxuICAgICAgcmV0dXJuIGFsbFpvbmVGcm9tLm1hcChzaW5nbGVab25lRnJvbSA9PiB7XG4gICAgICAgIGNvbnN0IGFic29sdXRlRnJvbSA9IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgc2luZ2xlWm9uZUZyb20pO1xuXG4gICAgICAgIGlmIChpc0dsb2JQYXR0ZXJuKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXB1dGVHbG9iUGF0dGVyblBhdGhWYWxpZGF0b3IoYWJzb2x1dGVGcm9tLCB6b25lRXhjZXB0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcHV0ZUFic29sdXRlUGF0aFZhbGlkYXRvcihhYnNvbHV0ZUZyb20sIHpvbmVFeGNlcHQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRm9yUmVzdHJpY3RlZEltcG9ydFBhdGgoaW1wb3J0UGF0aCwgbm9kZSkge1xuICAgICAgY29uc3QgYWJzb2x1dGVJbXBvcnRQYXRoID0gcmVzb2x2ZShpbXBvcnRQYXRoLCBjb250ZXh0KTtcblxuICAgICAgaWYgKCFhYnNvbHV0ZUltcG9ydFBhdGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtYXRjaGluZ1pvbmVzLmZvckVhY2goKHpvbmUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICghdmFsaWRhdG9yc1tpbmRleF0pIHtcbiAgICAgICAgICB2YWxpZGF0b3JzW2luZGV4XSA9IG1ha2VQYXRoVmFsaWRhdG9ycyh6b25lLmZyb20sIHpvbmUuZXhjZXB0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aCA9IHZhbGlkYXRvcnNbaW5kZXhdLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLmlzUGF0aFJlc3RyaWN0ZWQoYWJzb2x1dGVJbXBvcnRQYXRoKSk7XG5cbiAgICAgICAgY29uc3QgdmFsaWRhdG9yc1dpdGhJbnZhbGlkRXhjZXB0aW9ucyA9IGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aC5maWx0ZXIodmFsaWRhdG9yID0+ICF2YWxpZGF0b3IuaGFzVmFsaWRFeGNlcHRpb25zKTtcbiAgICAgICAgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbnModmFsaWRhdG9yc1dpdGhJbnZhbGlkRXhjZXB0aW9ucywgbm9kZSk7XG5cbiAgICAgICAgY29uc3QgYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoRXhjbHVkaW5nRXhjZXB0aW9ucyA9IGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aFxuICAgICAgICAgIC5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci5oYXNWYWxpZEV4Y2VwdGlvbnMpXG4gICAgICAgICAgLmZpbHRlcih2YWxpZGF0b3IgPT4gIXZhbGlkYXRvci5pc1BhdGhFeGNlcHRpb24oYWJzb2x1dGVJbXBvcnRQYXRoKSk7XG4gICAgICAgIHJlcG9ydEltcG9ydHNJblJlc3RyaWN0ZWRab25lKGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aEV4Y2x1ZGluZ0V4Y2VwdGlvbnMsIG5vZGUsIGltcG9ydFBhdGgsIHpvbmUubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kdWxlVmlzaXRvcigoc291cmNlKSA9PiB7XG4gICAgICBjaGVja0ZvclJlc3RyaWN0ZWRJbXBvcnRQYXRoKHNvdXJjZS52YWx1ZSwgc291cmNlKTtcbiAgICB9LCB7IGNvbW1vbmpzOiB0cnVlIH0pO1xuICB9LFxufTtcbiJdfQ==