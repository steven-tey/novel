'use strict';var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Ensure a default export is present, given a default import.',
      url: (0, _docsUrl2['default'])('default') },

    schema: [] },


  create: function () {function create(context) {

      function checkDefault(specifierType, node) {

        var defaultSpecifier = node.specifiers.find(
        function (specifier) {return specifier.type === specifierType;});


        if (!defaultSpecifier) return;
        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null) return;

        if (imports.errors.length) {
          imports.reportErrors(context, node);
        } else if (imports.get('default') === undefined) {
          context.report({
            node: defaultSpecifier,
            message: 'No default export found in imported module "' + String(node.source.value) + '".' });

        }
      }

      return {
        'ImportDeclaration': checkDefault.bind(null, 'ImportDefaultSpecifier'),
        'ExportNamedDeclaration': checkDefault.bind(null, 'ExportDefaultSpecifier') };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9kZWZhdWx0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImNoZWNrRGVmYXVsdCIsInNwZWNpZmllclR5cGUiLCJub2RlIiwiZGVmYXVsdFNwZWNpZmllciIsInNwZWNpZmllcnMiLCJmaW5kIiwic3BlY2lmaWVyIiwiaW1wb3J0cyIsIkV4cG9ydHMiLCJnZXQiLCJzb3VyY2UiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsInVuZGVmaW5lZCIsInJlcG9ydCIsIm1lc3NhZ2UiLCJiaW5kIl0sIm1hcHBpbmdzIjoiYUFBQSx5QztBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsaUJBRE47QUFFSkMsbUJBQWEsNkRBRlQ7QUFHSkMsV0FBSywwQkFBUSxTQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUSxFQVBKLEVBRFM7OztBQVdmQyxRQVhlLCtCQVdSQyxPQVhRLEVBV0M7O0FBRWQsZUFBU0MsWUFBVCxDQUFzQkMsYUFBdEIsRUFBcUNDLElBQXJDLEVBQTJDOztBQUV6QyxZQUFNQyxtQkFBbUJELEtBQUtFLFVBQUwsQ0FBZ0JDLElBQWhCO0FBQ3ZCLHFDQUFhQyxVQUFVZCxJQUFWLEtBQW1CUyxhQUFoQyxFQUR1QixDQUF6Qjs7O0FBSUEsWUFBSSxDQUFDRSxnQkFBTCxFQUF1QjtBQUN2QixZQUFNSSxVQUFVQyx1QkFBUUMsR0FBUixDQUFZUCxLQUFLUSxNQUFMLENBQVlDLEtBQXhCLEVBQStCWixPQUEvQixDQUFoQjtBQUNBLFlBQUlRLFdBQVcsSUFBZixFQUFxQjs7QUFFckIsWUFBSUEsUUFBUUssTUFBUixDQUFlQyxNQUFuQixFQUEyQjtBQUN6Qk4sa0JBQVFPLFlBQVIsQ0FBcUJmLE9BQXJCLEVBQThCRyxJQUE5QjtBQUNELFNBRkQsTUFFTyxJQUFJSyxRQUFRRSxHQUFSLENBQVksU0FBWixNQUEyQk0sU0FBL0IsRUFBMEM7QUFDL0NoQixrQkFBUWlCLE1BQVIsQ0FBZTtBQUNiZCxrQkFBTUMsZ0JBRE87QUFFYmMsNkVBQXdEZixLQUFLUSxNQUFMLENBQVlDLEtBQXBFLFFBRmEsRUFBZjs7QUFJRDtBQUNGOztBQUVELGFBQU87QUFDTCw2QkFBcUJYLGFBQWFrQixJQUFiLENBQWtCLElBQWxCLEVBQXdCLHdCQUF4QixDQURoQjtBQUVMLGtDQUEwQmxCLGFBQWFrQixJQUFiLENBQWtCLElBQWxCLEVBQXdCLHdCQUF4QixDQUZyQixFQUFQOztBQUlELEtBckNjLG1CQUFqQiIsImZpbGUiOiJkZWZhdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0YXRpYyBhbmFseXNpcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Vuc3VyZSBhIGRlZmF1bHQgZXhwb3J0IGlzIHByZXNlbnQsIGdpdmVuIGEgZGVmYXVsdCBpbXBvcnQuJyxcbiAgICAgIHVybDogZG9jc1VybCgnZGVmYXVsdCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuXG4gICAgZnVuY3Rpb24gY2hlY2tEZWZhdWx0KHNwZWNpZmllclR5cGUsIG5vZGUpIHtcblxuICAgICAgY29uc3QgZGVmYXVsdFNwZWNpZmllciA9IG5vZGUuc3BlY2lmaWVycy5maW5kKFxuICAgICAgICBzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLnR5cGUgPT09IHNwZWNpZmllclR5cGUsXG4gICAgICApO1xuXG4gICAgICBpZiAoIWRlZmF1bHRTcGVjaWZpZXIpIHJldHVybjtcbiAgICAgIGNvbnN0IGltcG9ydHMgPSBFeHBvcnRzLmdldChub2RlLnNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgaW1wb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgbm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGltcG9ydHMuZ2V0KCdkZWZhdWx0JykgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZTogZGVmYXVsdFNwZWNpZmllcixcbiAgICAgICAgICBtZXNzYWdlOiBgTm8gZGVmYXVsdCBleHBvcnQgZm91bmQgaW4gaW1wb3J0ZWQgbW9kdWxlIFwiJHtub2RlLnNvdXJjZS52YWx1ZX1cIi5gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ0ltcG9ydERlY2xhcmF0aW9uJzogY2hlY2tEZWZhdWx0LmJpbmQobnVsbCwgJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInKSxcbiAgICAgICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJzogY2hlY2tEZWZhdWx0LmJpbmQobnVsbCwgJ0V4cG9ydERlZmF1bHRTcGVjaWZpZXInKSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==