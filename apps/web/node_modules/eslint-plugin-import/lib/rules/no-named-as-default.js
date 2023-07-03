'use strict';var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid use of exported name as identifier of default export.',
      url: (0, _docsUrl2['default'])('no-named-as-default') },

    schema: [] },


  create: function () {function create(context) {
      function checkDefault(nameKey, defaultSpecifier) {
        // #566: default is a valid specifier
        if (defaultSpecifier[nameKey].name === 'default') return;

        var declaration = (0, _importDeclaration2['default'])(context);

        var imports = _ExportMap2['default'].get(declaration.source.value, context);
        if (imports == null) return;

        if (imports.errors.length) {
          imports.reportErrors(context, declaration);
          return;
        }

        if (imports.has('default') &&
        imports.has(defaultSpecifier[nameKey].name)) {

          context.report(defaultSpecifier,
          'Using exported name \'' + defaultSpecifier[nameKey].name +
          '\' as identifier for default export.');

        }
      }
      return {
        'ImportDefaultSpecifier': checkDefault.bind(null, 'local'),
        'ExportDefaultSpecifier': checkDefault.bind(null, 'exported') };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lZC1hcy1kZWZhdWx0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImNoZWNrRGVmYXVsdCIsIm5hbWVLZXkiLCJkZWZhdWx0U3BlY2lmaWVyIiwibmFtZSIsImRlY2xhcmF0aW9uIiwiaW1wb3J0cyIsIkV4cG9ydHMiLCJnZXQiLCJzb3VyY2UiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsImhhcyIsInJlcG9ydCIsImJpbmQiXSwibWFwcGluZ3MiOiJhQUFBLHlDO0FBQ0EseUQ7QUFDQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGtCQUROO0FBRUpDLG1CQUFhLDhEQUZUO0FBR0pDLFdBQUssMEJBQVEscUJBQVIsQ0FIRCxFQUZGOztBQU9KQyxZQUFRLEVBUEosRUFEUzs7O0FBV2ZDLFFBWGUsK0JBV1JDLE9BWFEsRUFXQztBQUNkLGVBQVNDLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQStCQyxnQkFBL0IsRUFBaUQ7QUFDL0M7QUFDQSxZQUFJQSxpQkFBaUJELE9BQWpCLEVBQTBCRSxJQUExQixLQUFtQyxTQUF2QyxFQUFrRDs7QUFFbEQsWUFBTUMsY0FBYyxvQ0FBa0JMLE9BQWxCLENBQXBCOztBQUVBLFlBQU1NLFVBQVVDLHVCQUFRQyxHQUFSLENBQVlILFlBQVlJLE1BQVosQ0FBbUJDLEtBQS9CLEVBQXNDVixPQUF0QyxDQUFoQjtBQUNBLFlBQUlNLFdBQVcsSUFBZixFQUFxQjs7QUFFckIsWUFBSUEsUUFBUUssTUFBUixDQUFlQyxNQUFuQixFQUEyQjtBQUN6Qk4sa0JBQVFPLFlBQVIsQ0FBcUJiLE9BQXJCLEVBQThCSyxXQUE5QjtBQUNBO0FBQ0Q7O0FBRUQsWUFBSUMsUUFBUVEsR0FBUixDQUFZLFNBQVo7QUFDQVIsZ0JBQVFRLEdBQVIsQ0FBWVgsaUJBQWlCRCxPQUFqQixFQUEwQkUsSUFBdEMsQ0FESixFQUNpRDs7QUFFL0NKLGtCQUFRZSxNQUFSLENBQWVaLGdCQUFmO0FBQ0UscUNBQTJCQSxpQkFBaUJELE9BQWpCLEVBQTBCRSxJQUFyRDtBQUNBLGdEQUZGOztBQUlEO0FBQ0Y7QUFDRCxhQUFPO0FBQ0wsa0NBQTBCSCxhQUFhZSxJQUFiLENBQWtCLElBQWxCLEVBQXdCLE9BQXhCLENBRHJCO0FBRUwsa0NBQTBCZixhQUFhZSxJQUFiLENBQWtCLElBQWxCLEVBQXdCLFVBQXhCLENBRnJCLEVBQVA7O0FBSUQsS0F2Q2MsbUJBQWpCIiwiZmlsZSI6Im5vLW5hbWVkLWFzLWRlZmF1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhwb3J0cyBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IGltcG9ydERlY2xhcmF0aW9uIGZyb20gJy4uL2ltcG9ydERlY2xhcmF0aW9uJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ0hlbHBmdWwgd2FybmluZ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgdXNlIG9mIGV4cG9ydGVkIG5hbWUgYXMgaWRlbnRpZmllciBvZiBkZWZhdWx0IGV4cG9ydC4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1uYW1lZC1hcy1kZWZhdWx0JyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgZnVuY3Rpb24gY2hlY2tEZWZhdWx0KG5hbWVLZXksIGRlZmF1bHRTcGVjaWZpZXIpIHtcbiAgICAgIC8vICM1NjY6IGRlZmF1bHQgaXMgYSB2YWxpZCBzcGVjaWZpZXJcbiAgICAgIGlmIChkZWZhdWx0U3BlY2lmaWVyW25hbWVLZXldLm5hbWUgPT09ICdkZWZhdWx0JykgcmV0dXJuO1xuXG4gICAgICBjb25zdCBkZWNsYXJhdGlvbiA9IGltcG9ydERlY2xhcmF0aW9uKGNvbnRleHQpO1xuXG4gICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQoZGVjbGFyYXRpb24uc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgIGlmIChpbXBvcnRzID09IG51bGwpIHJldHVybjtcblxuICAgICAgaWYgKGltcG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBkZWNsYXJhdGlvbik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGltcG9ydHMuaGFzKCdkZWZhdWx0JykgJiZcbiAgICAgICAgICBpbXBvcnRzLmhhcyhkZWZhdWx0U3BlY2lmaWVyW25hbWVLZXldLm5hbWUpKSB7XG5cbiAgICAgICAgY29udGV4dC5yZXBvcnQoZGVmYXVsdFNwZWNpZmllcixcbiAgICAgICAgICAnVXNpbmcgZXhwb3J0ZWQgbmFtZSBcXCcnICsgZGVmYXVsdFNwZWNpZmllcltuYW1lS2V5XS5uYW1lICtcbiAgICAgICAgICAnXFwnIGFzIGlkZW50aWZpZXIgZm9yIGRlZmF1bHQgZXhwb3J0LicpO1xuXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcic6IGNoZWNrRGVmYXVsdC5iaW5kKG51bGwsICdsb2NhbCcpLFxuICAgICAgJ0V4cG9ydERlZmF1bHRTcGVjaWZpZXInOiBjaGVja0RlZmF1bHQuYmluZChudWxsLCAnZXhwb3J0ZWQnKSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==