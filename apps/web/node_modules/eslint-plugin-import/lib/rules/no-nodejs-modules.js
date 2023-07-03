'use strict';var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function reportIfMissing(context, node, allowed, name) {
  if (allowed.indexOf(name) === -1 && (0, _importType2['default'])(name, context) === 'builtin') {
    context.report(node, 'Do not import Node.js builtin module "' + name + '"');
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Module systems',
      description: 'Forbid Node.js builtin modules.',
      url: (0, _docsUrl2['default'])('no-nodejs-modules') },

    schema: [
    {
      type: 'object',
      properties: {
        allow: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string' } } },



      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};
      var allowed = options.allow || [];

      return (0, _moduleVisitor2['default'])(function (source, node) {
        reportIfMissing(context, node, allowed, source.value);
      }, { commonjs: true });
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1ub2RlanMtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJyZXBvcnRJZk1pc3NpbmciLCJjb250ZXh0Iiwibm9kZSIsImFsbG93ZWQiLCJuYW1lIiwiaW5kZXhPZiIsInJlcG9ydCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsImFsbG93IiwidW5pcXVlSXRlbXMiLCJpdGVtcyIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiY3JlYXRlIiwib3B0aW9ucyIsInNvdXJjZSIsInZhbHVlIiwiY29tbW9uanMiXSwibWFwcGluZ3MiOiJhQUFBLGdEO0FBQ0Esa0U7QUFDQSxxQzs7QUFFQSxTQUFTQSxlQUFULENBQXlCQyxPQUF6QixFQUFrQ0MsSUFBbEMsRUFBd0NDLE9BQXhDLEVBQWlEQyxJQUFqRCxFQUF1RDtBQUNyRCxNQUFJRCxRQUFRRSxPQUFSLENBQWdCRCxJQUFoQixNQUEwQixDQUFDLENBQTNCLElBQWdDLDZCQUFXQSxJQUFYLEVBQWlCSCxPQUFqQixNQUE4QixTQUFsRSxFQUE2RTtBQUMzRUEsWUFBUUssTUFBUixDQUFlSixJQUFmLEVBQXFCLDJDQUEyQ0UsSUFBM0MsR0FBa0QsR0FBdkU7QUFDRDtBQUNGOztBQUVERyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsZ0JBRE47QUFFSkMsbUJBQWEsaUNBRlQ7QUFHSkMsV0FBSywwQkFBUSxtQkFBUixDQUhELEVBRkY7O0FBT0pDLFlBQVE7QUFDTjtBQUNFTCxZQUFNLFFBRFI7QUFFRU0sa0JBQVk7QUFDVkMsZUFBTztBQUNMUCxnQkFBTSxPQUREO0FBRUxRLHVCQUFhLElBRlI7QUFHTEMsaUJBQU87QUFDTFQsa0JBQU0sUUFERCxFQUhGLEVBREcsRUFGZDs7OztBQVdFVSw0QkFBc0IsS0FYeEIsRUFETSxDQVBKLEVBRFM7Ozs7O0FBeUJmQyxRQXpCZSwrQkF5QlJwQixPQXpCUSxFQXlCQztBQUNkLFVBQU1xQixVQUFVckIsUUFBUXFCLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFBdEM7QUFDQSxVQUFNbkIsVUFBVW1CLFFBQVFMLEtBQVIsSUFBaUIsRUFBakM7O0FBRUEsYUFBTyxnQ0FBYyxVQUFDTSxNQUFELEVBQVNyQixJQUFULEVBQWtCO0FBQ3JDRix3QkFBZ0JDLE9BQWhCLEVBQXlCQyxJQUF6QixFQUErQkMsT0FBL0IsRUFBd0NvQixPQUFPQyxLQUEvQztBQUNELE9BRk0sRUFFSixFQUFFQyxVQUFVLElBQVosRUFGSSxDQUFQO0FBR0QsS0FoQ2MsbUJBQWpCIiwiZmlsZSI6Im5vLW5vZGVqcy1tb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcbmltcG9ydCBtb2R1bGVWaXNpdG9yIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvbW9kdWxlVmlzaXRvcic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gcmVwb3J0SWZNaXNzaW5nKGNvbnRleHQsIG5vZGUsIGFsbG93ZWQsIG5hbWUpIHtcbiAgaWYgKGFsbG93ZWQuaW5kZXhPZihuYW1lKSA9PT0gLTEgJiYgaW1wb3J0VHlwZShuYW1lLCBjb250ZXh0KSA9PT0gJ2J1aWx0aW4nKSB7XG4gICAgY29udGV4dC5yZXBvcnQobm9kZSwgJ0RvIG5vdCBpbXBvcnQgTm9kZS5qcyBidWlsdGluIG1vZHVsZSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdNb2R1bGUgc3lzdGVtcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBOb2RlLmpzIGJ1aWx0aW4gbW9kdWxlcy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1ub2RlanMtbW9kdWxlcycpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IGFsbG93ZWQgPSBvcHRpb25zLmFsbG93IHx8IFtdO1xuXG4gICAgcmV0dXJuIG1vZHVsZVZpc2l0b3IoKHNvdXJjZSwgbm9kZSkgPT4ge1xuICAgICAgcmVwb3J0SWZNaXNzaW5nKGNvbnRleHQsIG5vZGUsIGFsbG93ZWQsIHNvdXJjZS52YWx1ZSk7XG4gICAgfSwgeyBjb21tb25qczogdHJ1ZSB9KTtcbiAgfSxcbn07XG4iXX0=