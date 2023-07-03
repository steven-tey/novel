'use strict';var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _pkgUp = require('eslint-module-utils/pkgUp');var _pkgUp2 = _interopRequireDefault(_pkgUp);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getEntryPoint(context) {
  var pkgPath = (0, _pkgUp2['default'])({ cwd: context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename() });
  try {
    return require.resolve(_path2['default'].dirname(pkgPath));
  } catch (error) {
    // Assume the package has no entrypoint (e.g. CLI packages)
    // in which case require.resolve would throw.
    return null;
  }
}

function findScope(context, identifier) {var _context$getSourceCod =
  context.getSourceCode(),scopeManager = _context$getSourceCod.scopeManager;

  return scopeManager && scopeManager.scopes.slice().reverse().find(function (scope) {return scope.variables.some(function (variable) {return variable.identifiers.some(function (node) {return node.name === identifier;});});});
}

function findDefinition(objectScope, identifier) {
  var variable = objectScope.variables.find(function (variable) {return variable.name === identifier;});
  return variable.defs.find(function (def) {return def.name.name === identifier;});
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Module systems',
      description: 'Forbid import statements with CommonJS module.exports.',
      recommended: true },

    fixable: 'code',
    schema: [
    {
      'type': 'object',
      'properties': {
        'exceptions': { 'type': 'array' } },

      'additionalProperties': false }] },



  create: function () {function create(context) {
      var importDeclarations = [];
      var entryPoint = getEntryPoint(context);
      var options = context.options[0] || {};
      var alreadyReported = false;

      function report(node) {
        var fileName = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
        var isEntryPoint = entryPoint === fileName;
        var isIdentifier = node.object.type === 'Identifier';
        var hasKeywords = /^(module|exports)$/.test(node.object.name);
        var objectScope = hasKeywords && findScope(context, node.object.name);
        var variableDefinition = objectScope && findDefinition(objectScope, node.object.name);
        var isImportBinding = variableDefinition && variableDefinition.type === 'ImportBinding';
        var hasCJSExportReference = hasKeywords && (!objectScope || objectScope.type === 'module');
        var isException = !!options.exceptions && options.exceptions.some(function (glob) {return (0, _minimatch2['default'])(fileName, glob);});

        if (isIdentifier && hasCJSExportReference && !isEntryPoint && !isException && !isImportBinding) {
          importDeclarations.forEach(function (importDeclaration) {
            context.report({
              node: importDeclaration,
              message: 'Cannot use import declarations in modules that export using ' + 'CommonJS (module.exports = \'foo\' or exports.bar = \'hi\')' });


          });
          alreadyReported = true;
        }
      }

      return {
        ImportDeclaration: function () {function ImportDeclaration(node) {
            importDeclarations.push(node);
          }return ImportDeclaration;}(),
        MemberExpression: function () {function MemberExpression(node) {
            if (!alreadyReported) {
              report(node);
            }
          }return MemberExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1pbXBvcnQtbW9kdWxlLWV4cG9ydHMuanMiXSwibmFtZXMiOlsiZ2V0RW50cnlQb2ludCIsImNvbnRleHQiLCJwa2dQYXRoIiwiY3dkIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwicmVxdWlyZSIsInJlc29sdmUiLCJwYXRoIiwiZGlybmFtZSIsImVycm9yIiwiZmluZFNjb3BlIiwiaWRlbnRpZmllciIsImdldFNvdXJjZUNvZGUiLCJzY29wZU1hbmFnZXIiLCJzY29wZXMiLCJzbGljZSIsInJldmVyc2UiLCJmaW5kIiwic2NvcGUiLCJ2YXJpYWJsZXMiLCJzb21lIiwidmFyaWFibGUiLCJpZGVudGlmaWVycyIsIm5vZGUiLCJuYW1lIiwiZmluZERlZmluaXRpb24iLCJvYmplY3RTY29wZSIsImRlZnMiLCJkZWYiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiZml4YWJsZSIsInNjaGVtYSIsImNyZWF0ZSIsImltcG9ydERlY2xhcmF0aW9ucyIsImVudHJ5UG9pbnQiLCJvcHRpb25zIiwiYWxyZWFkeVJlcG9ydGVkIiwicmVwb3J0IiwiZmlsZU5hbWUiLCJpc0VudHJ5UG9pbnQiLCJpc0lkZW50aWZpZXIiLCJvYmplY3QiLCJoYXNLZXl3b3JkcyIsInRlc3QiLCJ2YXJpYWJsZURlZmluaXRpb24iLCJpc0ltcG9ydEJpbmRpbmciLCJoYXNDSlNFeHBvcnRSZWZlcmVuY2UiLCJpc0V4Y2VwdGlvbiIsImV4Y2VwdGlvbnMiLCJnbG9iIiwiZm9yRWFjaCIsImltcG9ydERlY2xhcmF0aW9uIiwibWVzc2FnZSIsIkltcG9ydERlY2xhcmF0aW9uIiwicHVzaCIsIk1lbWJlckV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiJhQUFBLHNDO0FBQ0EsNEI7QUFDQSxrRDs7QUFFQSxTQUFTQSxhQUFULENBQXVCQyxPQUF2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QixRQUFyRCxDQUE5QjtBQUNBLFlBQU1zQixjQUFjLENBQUMsQ0FBQ1osUUFBUWEsVUFBVixJQUF3QmIsUUFBUWEsVUFBUixDQUFtQm5DLElBQW5CLENBQXdCLHdCQUFRLDRCQUFVeUIsUUFBVixFQUFvQlcsSUFBcEIsQ0FBUixFQUF4QixDQUE1Qzs7QUFFQSxZQUFJVCxnQkFBZ0JNLHFCQUFoQixJQUF5QyxDQUFDUCxZQUExQyxJQUEwRCxDQUFDUSxXQUEzRCxJQUEwRSxDQUFDRixlQUEvRSxFQUFnRztBQUM5RlosNkJBQW1CaUIsT0FBbkIsQ0FBMkIsNkJBQXFCO0FBQzlDekQsb0JBQVE0QyxNQUFSLENBQWU7QUFDYnJCLG9CQUFNbUMsaUJBRE87QUFFYkMsdUJBQVMsOEhBRkksRUFBZjs7O0FBS0QsV0FORDtBQU9BaEIsNEJBQWtCLElBQWxCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPO0FBQ0xpQix5QkFESywwQ0FDYXJDLElBRGIsRUFDbUI7QUFDdEJpQiwrQkFBbUJxQixJQUFuQixDQUF3QnRDLElBQXhCO0FBQ0QsV0FISTtBQUlMdUMsd0JBSksseUNBSVl2QyxJQUpaLEVBSWtCO0FBQ3JCLGdCQUFJLENBQUNvQixlQUFMLEVBQXNCO0FBQ3BCQyxxQkFBT3JCLElBQVA7QUFDRDtBQUNGLFdBUkksNkJBQVA7O0FBVUQsS0ExRGMsbUJBQWpCIiwiZmlsZSI6Im5vLWltcG9ydC1tb2R1bGUtZXhwb3J0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHBrZ1VwIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcGtnVXAnO1xuXG5mdW5jdGlvbiBnZXRFbnRyeVBvaW50KGNvbnRleHQpIHtcbiAgY29uc3QgcGtnUGF0aCA9IHBrZ1VwKHsgY3dkOiBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKSB9KTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZS5yZXNvbHZlKHBhdGguZGlybmFtZShwa2dQYXRoKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gQXNzdW1lIHRoZSBwYWNrYWdlIGhhcyBubyBlbnRyeXBvaW50IChlLmcuIENMSSBwYWNrYWdlcylcbiAgICAvLyBpbiB3aGljaCBjYXNlIHJlcXVpcmUucmVzb2x2ZSB3b3VsZCB0aHJvdy5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kU2NvcGUoY29udGV4dCwgaWRlbnRpZmllcikge1xuICBjb25zdCB7IHNjb3BlTWFuYWdlciB9ID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG5cbiAgcmV0dXJuIHNjb3BlTWFuYWdlciAmJiBzY29wZU1hbmFnZXIuc2NvcGVzLnNsaWNlKCkucmV2ZXJzZSgpLmZpbmQoKHNjb3BlKSA9PiBzY29wZS52YXJpYWJsZXMuc29tZSh2YXJpYWJsZSA9PiB2YXJpYWJsZS5pZGVudGlmaWVycy5zb21lKChub2RlKSA9PiBub2RlLm5hbWUgPT09IGlkZW50aWZpZXIpKSk7XG59XG5cbmZ1bmN0aW9uIGZpbmREZWZpbml0aW9uKG9iamVjdFNjb3BlLCBpZGVudGlmaWVyKSB7XG4gIGNvbnN0IHZhcmlhYmxlID0gb2JqZWN0U2NvcGUudmFyaWFibGVzLmZpbmQodmFyaWFibGUgPT4gdmFyaWFibGUubmFtZSA9PT0gaWRlbnRpZmllcik7XG4gIHJldHVybiB2YXJpYWJsZS5kZWZzLmZpbmQoZGVmID0+IGRlZi5uYW1lLm5hbWUgPT09IGlkZW50aWZpZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ01vZHVsZSBzeXN0ZW1zJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yYmlkIGltcG9ydCBzdGF0ZW1lbnRzIHdpdGggQ29tbW9uSlMgbW9kdWxlLmV4cG9ydHMuJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgICAncHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnZXhjZXB0aW9ucyc6IHsgJ3R5cGUnOiAnYXJyYXknIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcyc6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGltcG9ydERlY2xhcmF0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGVudHJ5UG9pbnQgPSBnZXRFbnRyeVBvaW50KGNvbnRleHQpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgbGV0IGFscmVhZHlSZXBvcnRlZCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gcmVwb3J0KG5vZGUpIHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCk7XG4gICAgICBjb25zdCBpc0VudHJ5UG9pbnQgPSBlbnRyeVBvaW50ID09PSBmaWxlTmFtZTtcbiAgICAgIGNvbnN0IGlzSWRlbnRpZmllciA9IG5vZGUub2JqZWN0LnR5cGUgPT09ICdJZGVudGlmaWVyJztcbiAgICAgIGNvbnN0IGhhc0tleXdvcmRzID0gKC9eKG1vZHVsZXxleHBvcnRzKSQvKS50ZXN0KG5vZGUub2JqZWN0Lm5hbWUpO1xuICAgICAgY29uc3Qgb2JqZWN0U2NvcGUgPSBoYXNLZXl3b3JkcyAmJiBmaW5kU2NvcGUoY29udGV4dCwgbm9kZS5vYmplY3QubmFtZSk7XG4gICAgICBjb25zdCB2YXJpYWJsZURlZmluaXRpb24gPSBvYmplY3RTY29wZSAmJiBmaW5kRGVmaW5pdGlvbihvYmplY3RTY29wZSwgbm9kZS5vYmplY3QubmFtZSk7XG4gICAgICBjb25zdCBpc0ltcG9ydEJpbmRpbmcgPSB2YXJpYWJsZURlZmluaXRpb24gJiYgdmFyaWFibGVEZWZpbml0aW9uLnR5cGUgPT09ICdJbXBvcnRCaW5kaW5nJztcbiAgICAgIGNvbnN0IGhhc0NKU0V4cG9ydFJlZmVyZW5jZSA9IGhhc0tleXdvcmRzICYmICghb2JqZWN0U2NvcGUgfHwgb2JqZWN0U2NvcGUudHlwZSA9PT0gJ21vZHVsZScpO1xuICAgICAgY29uc3QgaXNFeGNlcHRpb24gPSAhIW9wdGlvbnMuZXhjZXB0aW9ucyAmJiBvcHRpb25zLmV4Y2VwdGlvbnMuc29tZShnbG9iID0+IG1pbmltYXRjaChmaWxlTmFtZSwgZ2xvYikpO1xuXG4gICAgICBpZiAoaXNJZGVudGlmaWVyICYmIGhhc0NKU0V4cG9ydFJlZmVyZW5jZSAmJiAhaXNFbnRyeVBvaW50ICYmICFpc0V4Y2VwdGlvbiAmJiAhaXNJbXBvcnRCaW5kaW5nKSB7XG4gICAgICAgIGltcG9ydERlY2xhcmF0aW9ucy5mb3JFYWNoKGltcG9ydERlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlOiBpbXBvcnREZWNsYXJhdGlvbixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBDYW5ub3QgdXNlIGltcG9ydCBkZWNsYXJhdGlvbnMgaW4gbW9kdWxlcyB0aGF0IGV4cG9ydCB1c2luZyBgICtcbiAgICAgICAgICAgICAgYENvbW1vbkpTIChtb2R1bGUuZXhwb3J0cyA9ICdmb28nIG9yIGV4cG9ydHMuYmFyID0gJ2hpJylgLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgYWxyZWFkeVJlcG9ydGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpbXBvcnREZWNsYXJhdGlvbnMucHVzaChub2RlKTtcbiAgICAgIH0sXG4gICAgICBNZW1iZXJFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKCFhbHJlYWR5UmVwb3J0ZWQpIHtcbiAgICAgICAgICByZXBvcnQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=