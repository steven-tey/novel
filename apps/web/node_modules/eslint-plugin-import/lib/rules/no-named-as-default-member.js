'use strict';





var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid use of exported name as property of default export.',
      url: (0, _docsUrl2['default'])('no-named-as-default-member') },

    schema: [] },


  create: function () {function create(context) {

      var fileImports = new Map();
      var allPropertyLookups = new Map();

      function handleImportDefault(node) {
        var declaration = (0, _importDeclaration2['default'])(context);
        var exportMap = _ExportMap2['default'].get(declaration.source.value, context);
        if (exportMap == null) return;

        if (exportMap.errors.length) {
          exportMap.reportErrors(context, declaration);
          return;
        }

        fileImports.set(node.local.name, {
          exportMap: exportMap,
          sourcePath: declaration.source.value });

      }

      function storePropertyLookup(objectName, propName, node) {
        var lookups = allPropertyLookups.get(objectName) || [];
        lookups.push({ node: node, propName: propName });
        allPropertyLookups.set(objectName, lookups);
      }

      function handlePropLookup(node) {
        var objectName = node.object.name;
        var propName = node.property.name;
        storePropertyLookup(objectName, propName, node);
      }

      function handleDestructuringAssignment(node) {
        var isDestructure =
        node.id.type === 'ObjectPattern' &&
        node.init != null &&
        node.init.type === 'Identifier';

        if (!isDestructure) return;

        var objectName = node.init.name;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
          for (var _iterator = node.id.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref = _step.value;var key = _ref.key;
            if (key == null) continue; // true for rest properties
            storePropertyLookup(objectName, key.name, key);
          }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
      }

      function handleProgramExit() {
        allPropertyLookups.forEach(function (lookups, objectName) {
          var fileImport = fileImports.get(objectName);
          if (fileImport == null) return;var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

            for (var _iterator2 = lookups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _ref2 = _step2.value;var propName = _ref2.propName,node = _ref2.node;
              // the default import can have a "default" property
              if (propName === 'default') continue;
              if (!fileImport.exportMap.namespace.has(propName)) continue;

              context.report({
                node: node,
                message:
                'Caution: `' + String(objectName) + '` also has a named export ' + ('`' + String(
                propName) + '`. Check if you meant to write ') + ('`import {' + String(
                propName) + '} from \'' + String(fileImport.sourcePath) + '\'` ') +
                'instead.' });


            }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
        });
      }

      return {
        'ImportDefaultSpecifier': handleImportDefault,
        'MemberExpression': handlePropLookup,
        'VariableDeclarator': handleDestructuringAssignment,
        'Program:exit': handleProgramExit };

    }return create;}() }; /**
                           * @fileoverview Rule to warn about potentially confused use of name exports
                           * @author Desmond Brand
                           * @copyright 2016 Desmond Brand. All rights reserved.
                           * See LICENSE in root directory for full license.
                           */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lZC1hcy1kZWZhdWx0LW1lbWJlci5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJmaWxlSW1wb3J0cyIsIk1hcCIsImFsbFByb3BlcnR5TG9va3VwcyIsImhhbmRsZUltcG9ydERlZmF1bHQiLCJub2RlIiwiZGVjbGFyYXRpb24iLCJleHBvcnRNYXAiLCJFeHBvcnRzIiwiZ2V0Iiwic291cmNlIiwidmFsdWUiLCJlcnJvcnMiLCJsZW5ndGgiLCJyZXBvcnRFcnJvcnMiLCJzZXQiLCJsb2NhbCIsIm5hbWUiLCJzb3VyY2VQYXRoIiwic3RvcmVQcm9wZXJ0eUxvb2t1cCIsIm9iamVjdE5hbWUiLCJwcm9wTmFtZSIsImxvb2t1cHMiLCJwdXNoIiwiaGFuZGxlUHJvcExvb2t1cCIsIm9iamVjdCIsInByb3BlcnR5IiwiaGFuZGxlRGVzdHJ1Y3R1cmluZ0Fzc2lnbm1lbnQiLCJpc0Rlc3RydWN0dXJlIiwiaWQiLCJpbml0IiwicHJvcGVydGllcyIsImtleSIsImhhbmRsZVByb2dyYW1FeGl0IiwiZm9yRWFjaCIsImZpbGVJbXBvcnQiLCJuYW1lc3BhY2UiLCJoYXMiLCJyZXBvcnQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSx5QztBQUNBLHlEO0FBQ0EscUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsa0JBRE47QUFFSkMsbUJBQWEsNERBRlQ7QUFHSkMsV0FBSywwQkFBUSw0QkFBUixDQUhELEVBRkY7O0FBT0pDLFlBQVEsRUFQSixFQURTOzs7QUFXZkMsUUFYZSwrQkFXUkMsT0FYUSxFQVdDOztBQUVkLFVBQU1DLGNBQWMsSUFB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RCxhQUFPO0FBQ0wsa0NBQTBCZCxtQkFEckI7QUFFTCw0QkFBb0JvQixnQkFGZjtBQUdMLDhCQUFzQkcsNkJBSGpCO0FBSUwsd0JBQWdCTSxpQkFKWCxFQUFQOztBQU1ELEtBeEZjLG1CQUFqQixDLENBZEEiLCJmaWxlIjoibm8tbmFtZWQtYXMtZGVmYXVsdC1tZW1iZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byB3YXJuIGFib3V0IHBvdGVudGlhbGx5IGNvbmZ1c2VkIHVzZSBvZiBuYW1lIGV4cG9ydHNcbiAqIEBhdXRob3IgRGVzbW9uZCBCcmFuZFxuICogQGNvcHlyaWdodCAyMDE2IERlc21vbmQgQnJhbmQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBTZWUgTElDRU5TRSBpbiByb290IGRpcmVjdG9yeSBmb3IgZnVsbCBsaWNlbnNlLlxuICovXG5pbXBvcnQgRXhwb3J0cyBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IGltcG9ydERlY2xhcmF0aW9uIGZyb20gJy4uL2ltcG9ydERlY2xhcmF0aW9uJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ0hlbHBmdWwgd2FybmluZ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgdXNlIG9mIGV4cG9ydGVkIG5hbWUgYXMgcHJvcGVydHkgb2YgZGVmYXVsdCBleHBvcnQuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tbmFtZWQtYXMtZGVmYXVsdC1tZW1iZXInKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcblxuICAgIGNvbnN0IGZpbGVJbXBvcnRzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGFsbFByb3BlcnR5TG9va3VwcyA9IG5ldyBNYXAoKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZUltcG9ydERlZmF1bHQobm9kZSkge1xuICAgICAgY29uc3QgZGVjbGFyYXRpb24gPSBpbXBvcnREZWNsYXJhdGlvbihjb250ZXh0KTtcbiAgICAgIGNvbnN0IGV4cG9ydE1hcCA9IEV4cG9ydHMuZ2V0KGRlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICBpZiAoZXhwb3J0TWFwID09IG51bGwpIHJldHVybjtcblxuICAgICAgaWYgKGV4cG9ydE1hcC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGV4cG9ydE1hcC5yZXBvcnRFcnJvcnMoY29udGV4dCwgZGVjbGFyYXRpb24pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZpbGVJbXBvcnRzLnNldChub2RlLmxvY2FsLm5hbWUsIHtcbiAgICAgICAgZXhwb3J0TWFwLFxuICAgICAgICBzb3VyY2VQYXRoOiBkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9yZVByb3BlcnR5TG9va3VwKG9iamVjdE5hbWUsIHByb3BOYW1lLCBub2RlKSB7XG4gICAgICBjb25zdCBsb29rdXBzID0gYWxsUHJvcGVydHlMb29rdXBzLmdldChvYmplY3ROYW1lKSB8fCBbXTtcbiAgICAgIGxvb2t1cHMucHVzaCh7IG5vZGUsIHByb3BOYW1lIH0pO1xuICAgICAgYWxsUHJvcGVydHlMb29rdXBzLnNldChvYmplY3ROYW1lLCBsb29rdXBzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVQcm9wTG9va3VwKG5vZGUpIHtcbiAgICAgIGNvbnN0IG9iamVjdE5hbWUgPSBub2RlLm9iamVjdC5uYW1lO1xuICAgICAgY29uc3QgcHJvcE5hbWUgPSBub2RlLnByb3BlcnR5Lm5hbWU7XG4gICAgICBzdG9yZVByb3BlcnR5TG9va3VwKG9iamVjdE5hbWUsIHByb3BOYW1lLCBub2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVEZXN0cnVjdHVyaW5nQXNzaWdubWVudChub2RlKSB7XG4gICAgICBjb25zdCBpc0Rlc3RydWN0dXJlID0gKFxuICAgICAgICBub2RlLmlkLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJyAmJlxuICAgICAgICBub2RlLmluaXQgIT0gbnVsbCAmJlxuICAgICAgICBub2RlLmluaXQudHlwZSA9PT0gJ0lkZW50aWZpZXInXG4gICAgICApO1xuICAgICAgaWYgKCFpc0Rlc3RydWN0dXJlKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IG9iamVjdE5hbWUgPSBub2RlLmluaXQubmFtZTtcbiAgICAgIGZvciAoY29uc3QgeyBrZXkgfSBvZiBub2RlLmlkLnByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKGtleSA9PSBudWxsKSBjb250aW51ZTsgIC8vIHRydWUgZm9yIHJlc3QgcHJvcGVydGllc1xuICAgICAgICBzdG9yZVByb3BlcnR5TG9va3VwKG9iamVjdE5hbWUsIGtleS5uYW1lLCBrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVByb2dyYW1FeGl0KCkge1xuICAgICAgYWxsUHJvcGVydHlMb29rdXBzLmZvckVhY2goKGxvb2t1cHMsIG9iamVjdE5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZUltcG9ydCA9IGZpbGVJbXBvcnRzLmdldChvYmplY3ROYW1lKTtcbiAgICAgICAgaWYgKGZpbGVJbXBvcnQgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgeyBwcm9wTmFtZSwgbm9kZSB9IG9mIGxvb2t1cHMpIHtcbiAgICAgICAgICAvLyB0aGUgZGVmYXVsdCBpbXBvcnQgY2FuIGhhdmUgYSBcImRlZmF1bHRcIiBwcm9wZXJ0eVxuICAgICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2RlZmF1bHQnKSBjb250aW51ZTtcbiAgICAgICAgICBpZiAoIWZpbGVJbXBvcnQuZXhwb3J0TWFwLm5hbWVzcGFjZS5oYXMocHJvcE5hbWUpKSBjb250aW51ZTtcblxuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAoXG4gICAgICAgICAgICAgIGBDYXV0aW9uOiBcXGAke29iamVjdE5hbWV9XFxgIGFsc28gaGFzIGEgbmFtZWQgZXhwb3J0IGAgK1xuICAgICAgICAgICAgICBgXFxgJHtwcm9wTmFtZX1cXGAuIENoZWNrIGlmIHlvdSBtZWFudCB0byB3cml0ZSBgICtcbiAgICAgICAgICAgICAgYFxcYGltcG9ydCB7JHtwcm9wTmFtZX19IGZyb20gJyR7ZmlsZUltcG9ydC5zb3VyY2VQYXRofSdcXGAgYCArXG4gICAgICAgICAgICAgICdpbnN0ZWFkLidcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcic6IGhhbmRsZUltcG9ydERlZmF1bHQsXG4gICAgICAnTWVtYmVyRXhwcmVzc2lvbic6IGhhbmRsZVByb3BMb29rdXAsXG4gICAgICAnVmFyaWFibGVEZWNsYXJhdG9yJzogaGFuZGxlRGVzdHJ1Y3R1cmluZ0Fzc2lnbm1lbnQsXG4gICAgICAnUHJvZ3JhbTpleGl0JzogaGFuZGxlUHJvZ3JhbUV4aXQsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=