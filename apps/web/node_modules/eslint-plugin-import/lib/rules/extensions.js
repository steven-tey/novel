'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _importType = require('../core/importType');
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var enumValues = { 'enum': ['always', 'ignorePackages', 'never'] };
var patternProperties = {
  type: 'object',
  patternProperties: { '.*': enumValues } };

var properties = {
  type: 'object',
  properties: {
    'pattern': patternProperties,
    'ignorePackages': { type: 'boolean' } } };



function buildProperties(context) {

  var result = {
    defaultConfig: 'never',
    pattern: {},
    ignorePackages: false };


  context.options.forEach(function (obj) {

    // If this is a string, set defaultConfig to its value
    if (typeof obj === 'string') {
      result.defaultConfig = obj;
      return;
    }

    // If this is not the new structure, transfer all props to result.pattern
    if (obj.pattern === undefined && obj.ignorePackages === undefined) {
      Object.assign(result.pattern, obj);
      return;
    }

    // If pattern is provided, transfer all props
    if (obj.pattern !== undefined) {
      Object.assign(result.pattern, obj.pattern);
    }

    // If ignorePackages is provided, transfer it to result
    if (obj.ignorePackages !== undefined) {
      result.ignorePackages = obj.ignorePackages;
    }
  });

  if (result.defaultConfig === 'ignorePackages') {
    result.defaultConfig = 'always';
    result.ignorePackages = true;
  }

  return result;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Ensure consistent use of file extension within the import path.',
      url: (0, _docsUrl2['default'])('extensions') },


    schema: {
      anyOf: [
      {
        type: 'array',
        items: [enumValues],
        additionalItems: false },

      {
        type: 'array',
        items: [
        enumValues,
        properties],

        additionalItems: false },

      {
        type: 'array',
        items: [properties],
        additionalItems: false },

      {
        type: 'array',
        items: [patternProperties],
        additionalItems: false },

      {
        type: 'array',
        items: [
        enumValues,
        patternProperties],

        additionalItems: false }] } },





  create: function () {function create(context) {

      var props = buildProperties(context);

      function getModifier(extension) {
        return props.pattern[extension] || props.defaultConfig;
      }

      function isUseOfExtensionRequired(extension, isPackage) {
        return getModifier(extension) === 'always' && (!props.ignorePackages || !isPackage);
      }

      function isUseOfExtensionForbidden(extension) {
        return getModifier(extension) === 'never';
      }

      function isResolvableWithoutExtension(file) {
        var extension = _path2['default'].extname(file);
        var fileWithoutExtension = file.slice(0, -extension.length);
        var resolvedFileWithoutExtension = (0, _resolve2['default'])(fileWithoutExtension, context);

        return resolvedFileWithoutExtension === (0, _resolve2['default'])(file, context);
      }

      function isExternalRootModule(file) {
        var slashCount = file.split('/').length - 1;

        if (slashCount === 0) return true;
        if ((0, _importType.isScoped)(file) && slashCount <= 1) return true;
        return false;
      }

      function checkFileExtension(source, node) {
        // bail if the declaration doesn't have a source, e.g. "export { foo };", or if it's only partially typed like in an editor
        if (!source || !source.value) return;

        var importPathWithQueryString = source.value;

        // don't enforce anything on builtins
        if ((0, _importType.isBuiltIn)(importPathWithQueryString, context.settings)) return;

        var importPath = importPathWithQueryString.replace(/\?(.*)$/, '');

        // don't enforce in root external packages as they may have names with `.js`.
        // Like `import Decimal from decimal.js`)
        if (isExternalRootModule(importPath)) return;

        var resolvedPath = (0, _resolve2['default'])(importPath, context);

        // get extension from resolved path, if possible.
        // for unresolved, use source value.
        var extension = _path2['default'].extname(resolvedPath || importPath).substring(1);

        // determine if this is a module
        var isPackage = (0, _importType.isExternalModule)(
        importPath,
        (0, _resolve2['default'])(importPath, context),
        context) ||
        (0, _importType.isScoped)(importPath);

        if (!extension || !importPath.endsWith('.' + String(extension))) {
          // ignore type-only imports and exports
          if (node.importKind === 'type' || node.exportKind === 'type') return;
          var extensionRequired = isUseOfExtensionRequired(extension, isPackage);
          var extensionForbidden = isUseOfExtensionForbidden(extension);
          if (extensionRequired && !extensionForbidden) {
            context.report({
              node: source,
              message: 'Missing file extension ' + (
              extension ? '"' + String(extension) + '" ' : '') + 'for "' + String(importPathWithQueryString) + '"' });

          }
        } else if (extension) {
          if (isUseOfExtensionForbidden(extension) && isResolvableWithoutExtension(importPath)) {
            context.report({
              node: source,
              message: 'Unexpected use of file extension "' + String(extension) + '" for "' + String(importPathWithQueryString) + '"' });

          }
        }
      }

      return (0, _moduleVisitor2['default'])(checkFileExtension, { commonjs: true });
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHRlbnNpb25zLmpzIl0sIm5hbWVzIjpbImVudW1WYWx1ZXMiLCJwYXR0ZXJuUHJvcGVydGllcyIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiYnVpbGRQcm9wZXJ0aWVzIiwiY29udGV4dCIsInJlc3VsdCIsImRlZmF1bHRDb25maWciLCJwYXR0ZXJuIiwiaWdub3JlUGFja2FnZXMiLCJvcHRpb25zIiwiZm9yRWFjaCIsIm9iaiIsInVuZGVmaW5lZCIsIk9iamVjdCIsImFzc2lnbiIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJhbnlPZiIsIml0ZW1zIiwiYWRkaXRpb25hbEl0ZW1zIiwiY3JlYXRlIiwicHJvcHMiLCJnZXRNb2RpZmllciIsImV4dGVuc2lvbiIsImlzVXNlT2ZFeHRlbnNpb25SZXF1aXJlZCIsImlzUGFja2FnZSIsImlzVXNlT2ZFeHRlbnNpb25Gb3JiaWRkZW4iLCJpc1Jlc29sdmFibGVXaXRob3V0RXh0ZW5zaW9uIiwiZmlsZSIsInBhdGgiLCJleHRuYW1lIiwiZmlsZVdpdGhvdXRFeHRlbnNpb24iLCJzbGljZSIsImxlbmd0aCIsInJlc29sdmVkRmlsZVdpdGhvdXRFeHRlbnNpb24iLCJpc0V4dGVybmFsUm9vdE1vZHVsZSIsInNsYXNoQ291bnQiLCJzcGxpdCIsImNoZWNrRmlsZUV4dGVuc2lvbiIsInNvdXJjZSIsIm5vZGUiLCJ2YWx1ZSIsImltcG9ydFBhdGhXaXRoUXVlcnlTdHJpbmciLCJzZXR0aW5ncyIsImltcG9ydFBhdGgiLCJyZXBsYWNlIiwicmVzb2x2ZWRQYXRoIiwic3Vic3RyaW5nIiwiZW5kc1dpdGgiLCJpbXBvcnRLaW5kIiwiZXhwb3J0S2luZCIsImV4dGVuc2lvblJlcXVpcmVkIiwiZXh0ZW5zaW9uRm9yYmlkZGVuIiwicmVwb3J0IiwibWVzc2FnZSIsImNvbW1vbmpzIl0sIm1hcHBpbmdzIjoiYUFB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YSxFQUFmOztBQUlEO0FBQ0Y7QUFDRjs7QUFFRCxhQUFPLGdDQUFjSixrQkFBZCxFQUFrQyxFQUFFaUIsVUFBVSxJQUFaLEVBQWxDLENBQVA7QUFDRCxLQWpJYyxtQkFBakIiLCJmaWxlIjoiZXh0ZW5zaW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IHsgaXNCdWlsdEluLCBpc0V4dGVybmFsTW9kdWxlLCBpc1Njb3BlZCB9IGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmNvbnN0IGVudW1WYWx1ZXMgPSB7IGVudW06IFsgJ2Fsd2F5cycsICdpZ25vcmVQYWNrYWdlcycsICduZXZlcicgXSB9O1xuY29uc3QgcGF0dGVyblByb3BlcnRpZXMgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwYXR0ZXJuUHJvcGVydGllczogeyAnLionOiBlbnVtVmFsdWVzIH0sXG59O1xuY29uc3QgcHJvcGVydGllcyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAncGF0dGVybic6IHBhdHRlcm5Qcm9wZXJ0aWVzLFxuICAgICdpZ25vcmVQYWNrYWdlcyc6IHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBidWlsZFByb3BlcnRpZXMoY29udGV4dCkge1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICBkZWZhdWx0Q29uZmlnOiAnbmV2ZXInLFxuICAgIHBhdHRlcm46IHt9LFxuICAgIGlnbm9yZVBhY2thZ2VzOiBmYWxzZSxcbiAgfTtcblxuICBjb250ZXh0Lm9wdGlvbnMuZm9yRWFjaChvYmogPT4ge1xuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHN0cmluZywgc2V0IGRlZmF1bHRDb25maWcgdG8gaXRzIHZhbHVlXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXN1bHQuZGVmYXVsdENvbmZpZyA9IG9iajtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIGlzIG5vdCB0aGUgbmV3IHN0cnVjdHVyZSwgdHJhbnNmZXIgYWxsIHByb3BzIHRvIHJlc3VsdC5wYXR0ZXJuXG4gICAgaWYgKG9iai5wYXR0ZXJuID09PSB1bmRlZmluZWQgJiYgb2JqLmlnbm9yZVBhY2thZ2VzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0LnBhdHRlcm4sIG9iaik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgcGF0dGVybiBpcyBwcm92aWRlZCwgdHJhbnNmZXIgYWxsIHByb3BzXG4gICAgaWYgKG9iai5wYXR0ZXJuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0LnBhdHRlcm4sIG9iai5wYXR0ZXJuKTtcbiAgICB9XG5cbiAgICAvLyBJZiBpZ25vcmVQYWNrYWdlcyBpcyBwcm92aWRlZCwgdHJhbnNmZXIgaXQgdG8gcmVzdWx0XG4gICAgaWYgKG9iai5pZ25vcmVQYWNrYWdlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQuaWdub3JlUGFja2FnZXMgPSBvYmouaWdub3JlUGFja2FnZXM7XG4gICAgfVxuICB9KTtcblxuICBpZiAocmVzdWx0LmRlZmF1bHRDb25maWcgPT09ICdpZ25vcmVQYWNrYWdlcycpIHtcbiAgICByZXN1bHQuZGVmYXVsdENvbmZpZyA9ICdhbHdheXMnO1xuICAgIHJlc3VsdC5pZ25vcmVQYWNrYWdlcyA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0eWxlIGd1aWRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5zdXJlIGNvbnNpc3RlbnQgdXNlIG9mIGZpbGUgZXh0ZW5zaW9uIHdpdGhpbiB0aGUgaW1wb3J0IHBhdGguJyxcbiAgICAgIHVybDogZG9jc1VybCgnZXh0ZW5zaW9ucycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IHtcbiAgICAgIGFueU9mOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiBbZW51bVZhbHVlc10sXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIGVudW1WYWx1ZXMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IFtwcm9wZXJ0aWVzXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczogW3BhdHRlcm5Qcm9wZXJ0aWVzXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgZW51bVZhbHVlcyxcbiAgICAgICAgICAgIHBhdHRlcm5Qcm9wZXJ0aWVzLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuXG4gICAgY29uc3QgcHJvcHMgPSBidWlsZFByb3BlcnRpZXMoY29udGV4dCk7XG5cbiAgICBmdW5jdGlvbiBnZXRNb2RpZmllcihleHRlbnNpb24pIHtcbiAgICAgIHJldHVybiBwcm9wcy5wYXR0ZXJuW2V4dGVuc2lvbl0gfHwgcHJvcHMuZGVmYXVsdENvbmZpZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1VzZU9mRXh0ZW5zaW9uUmVxdWlyZWQoZXh0ZW5zaW9uLCBpc1BhY2thZ2UpIHtcbiAgICAgIHJldHVybiBnZXRNb2RpZmllcihleHRlbnNpb24pID09PSAnYWx3YXlzJyAmJiAoIXByb3BzLmlnbm9yZVBhY2thZ2VzIHx8ICFpc1BhY2thZ2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXNlT2ZFeHRlbnNpb25Gb3JiaWRkZW4oZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gZ2V0TW9kaWZpZXIoZXh0ZW5zaW9uKSA9PT0gJ25ldmVyJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1Jlc29sdmFibGVXaXRob3V0RXh0ZW5zaW9uKGZpbGUpIHtcbiAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlKTtcbiAgICAgIGNvbnN0IGZpbGVXaXRob3V0RXh0ZW5zaW9uID0gZmlsZS5zbGljZSgwLCAtZXh0ZW5zaW9uLmxlbmd0aCk7XG4gICAgICBjb25zdCByZXNvbHZlZEZpbGVXaXRob3V0RXh0ZW5zaW9uID0gcmVzb2x2ZShmaWxlV2l0aG91dEV4dGVuc2lvbiwgY29udGV4dCk7XG5cbiAgICAgIHJldHVybiByZXNvbHZlZEZpbGVXaXRob3V0RXh0ZW5zaW9uID09PSByZXNvbHZlKGZpbGUsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRXh0ZXJuYWxSb290TW9kdWxlKGZpbGUpIHtcbiAgICAgIGNvbnN0IHNsYXNoQ291bnQgPSBmaWxlLnNwbGl0KCcvJykubGVuZ3RoIC0gMTtcblxuICAgICAgaWYgKHNsYXNoQ291bnQgPT09IDApICByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChpc1Njb3BlZChmaWxlKSAmJiBzbGFzaENvdW50IDw9IDEpIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrRmlsZUV4dGVuc2lvbihzb3VyY2UsIG5vZGUpIHtcbiAgICAgIC8vIGJhaWwgaWYgdGhlIGRlY2xhcmF0aW9uIGRvZXNuJ3QgaGF2ZSBhIHNvdXJjZSwgZS5nLiBcImV4cG9ydCB7IGZvbyB9O1wiLCBvciBpZiBpdCdzIG9ubHkgcGFydGlhbGx5IHR5cGVkIGxpa2UgaW4gYW4gZWRpdG9yXG4gICAgICBpZiAoIXNvdXJjZSB8fCAhc291cmNlLnZhbHVlKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGltcG9ydFBhdGhXaXRoUXVlcnlTdHJpbmcgPSBzb3VyY2UudmFsdWU7XG5cbiAgICAgIC8vIGRvbid0IGVuZm9yY2UgYW55dGhpbmcgb24gYnVpbHRpbnNcbiAgICAgIGlmIChpc0J1aWx0SW4oaW1wb3J0UGF0aFdpdGhRdWVyeVN0cmluZywgY29udGV4dC5zZXR0aW5ncykpIHJldHVybjtcblxuICAgICAgY29uc3QgaW1wb3J0UGF0aCA9IGltcG9ydFBhdGhXaXRoUXVlcnlTdHJpbmcucmVwbGFjZSgvXFw/KC4qKSQvLCAnJyk7XG5cbiAgICAgIC8vIGRvbid0IGVuZm9yY2UgaW4gcm9vdCBleHRlcm5hbCBwYWNrYWdlcyBhcyB0aGV5IG1heSBoYXZlIG5hbWVzIHdpdGggYC5qc2AuXG4gICAgICAvLyBMaWtlIGBpbXBvcnQgRGVjaW1hbCBmcm9tIGRlY2ltYWwuanNgKVxuICAgICAgaWYgKGlzRXh0ZXJuYWxSb290TW9kdWxlKGltcG9ydFBhdGgpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IHJlc29sdmUoaW1wb3J0UGF0aCwgY29udGV4dCk7XG5cbiAgICAgIC8vIGdldCBleHRlbnNpb24gZnJvbSByZXNvbHZlZCBwYXRoLCBpZiBwb3NzaWJsZS5cbiAgICAgIC8vIGZvciB1bnJlc29sdmVkLCB1c2Ugc291cmNlIHZhbHVlLlxuICAgICAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKHJlc29sdmVkUGF0aCB8fCBpbXBvcnRQYXRoKS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgIC8vIGRldGVybWluZSBpZiB0aGlzIGlzIGEgbW9kdWxlXG4gICAgICBjb25zdCBpc1BhY2thZ2UgPSBpc0V4dGVybmFsTW9kdWxlKFxuICAgICAgICBpbXBvcnRQYXRoLFxuICAgICAgICByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpLFxuICAgICAgICBjb250ZXh0LFxuICAgICAgKSB8fCBpc1Njb3BlZChpbXBvcnRQYXRoKTtcblxuICAgICAgaWYgKCFleHRlbnNpb24gfHwgIWltcG9ydFBhdGguZW5kc1dpdGgoYC4ke2V4dGVuc2lvbn1gKSkge1xuICAgICAgICAvLyBpZ25vcmUgdHlwZS1vbmx5IGltcG9ydHMgYW5kIGV4cG9ydHNcbiAgICAgICAgaWYgKG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnIHx8IG5vZGUuZXhwb3J0S2luZCA9PT0gJ3R5cGUnKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvblJlcXVpcmVkID0gaXNVc2VPZkV4dGVuc2lvblJlcXVpcmVkKGV4dGVuc2lvbiwgaXNQYWNrYWdlKTtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uRm9yYmlkZGVuID0gaXNVc2VPZkV4dGVuc2lvbkZvcmJpZGRlbihleHRlbnNpb24pO1xuICAgICAgICBpZiAoZXh0ZW5zaW9uUmVxdWlyZWQgJiYgIWV4dGVuc2lvbkZvcmJpZGRlbikge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHNvdXJjZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAgIGBNaXNzaW5nIGZpbGUgZXh0ZW5zaW9uICR7ZXh0ZW5zaW9uID8gYFwiJHtleHRlbnNpb259XCIgYCA6ICcnfWZvciBcIiR7aW1wb3J0UGF0aFdpdGhRdWVyeVN0cmluZ31cImAsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZXh0ZW5zaW9uKSB7XG4gICAgICAgIGlmIChpc1VzZU9mRXh0ZW5zaW9uRm9yYmlkZGVuKGV4dGVuc2lvbikgJiYgaXNSZXNvbHZhYmxlV2l0aG91dEV4dGVuc2lvbihpbXBvcnRQYXRoKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHNvdXJjZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBVbmV4cGVjdGVkIHVzZSBvZiBmaWxlIGV4dGVuc2lvbiBcIiR7ZXh0ZW5zaW9ufVwiIGZvciBcIiR7aW1wb3J0UGF0aFdpdGhRdWVyeVN0cmluZ31cImAsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kdWxlVmlzaXRvcihjaGVja0ZpbGVFeHRlbnNpb24sIHsgY29tbW9uanM6IHRydWUgfSk7XG4gIH0sXG59O1xuIl19