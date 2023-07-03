'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid named default exports.',
      url: (0, _docsUrl2['default'])('no-named-default') },

    schema: [] },


  create: function () {function create(context) {
      return {
        'ImportDeclaration': function () {function ImportDeclaration(node) {
            node.specifiers.forEach(function (im) {
              if (im.importKind === 'type' || im.importKind === 'typeof') {
                return;
              }

              if (im.type === 'ImportSpecifier' && (im.imported.name || im.imported.value) === 'default') {
                context.report({
                  node: im.local,
                  message: 'Use default import syntax to import \'' + String(im.local.name) + '\'.' });
              }
            });
          }return ImportDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lZC1kZWZhdWx0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsIm5vZGUiLCJzcGVjaWZpZXJzIiwiZm9yRWFjaCIsImltIiwiaW1wb3J0S2luZCIsImltcG9ydGVkIiwibmFtZSIsInZhbHVlIiwicmVwb3J0IiwibG9jYWwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiYUFBQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGFBRE47QUFFSkMsbUJBQWEsK0JBRlQ7QUFHSkMsV0FBSywwQkFBUSxrQkFBUixDQUhELEVBRkY7O0FBT0pDLFlBQVEsRUFQSixFQURTOzs7QUFXZkMsUUFYZSwrQkFXUkMsT0FYUSxFQVdDO0FBQ2QsYUFBTztBQUNMLDBDQUFxQiwyQkFBVUMsSUFBVixFQUFnQjtBQUNuQ0EsaUJBQUtDLFVBQUwsQ0FBZ0JDLE9BQWhCLENBQXdCLFVBQVVDLEVBQVYsRUFBYztBQUNwQyxrQkFBSUEsR0FBR0MsVUFBSCxLQUFrQixNQUFsQixJQUE0QkQsR0FBR0MsVUFBSCxLQUFrQixRQUFsRCxFQUE0RDtBQUMxRDtBQUNEOztBQUVELGtCQUFJRCxHQUFHWCxJQUFILEtBQVksaUJBQVosSUFBaUMsQ0FBQ1csR0FBR0UsUUFBSCxDQUFZQyxJQUFaLElBQW9CSCxHQUFHRSxRQUFILENBQVlFLEtBQWpDLE1BQTRDLFNBQWpGLEVBQTRGO0FBQzFGUix3QkFBUVMsTUFBUixDQUFlO0FBQ2JSLHdCQUFNRyxHQUFHTSxLQURJO0FBRWJDLDZFQUFpRFAsR0FBR00sS0FBSCxDQUFTSCxJQUExRCxTQUZhLEVBQWY7QUFHRDtBQUNGLGFBVkQ7QUFXRCxXQVpELDRCQURLLEVBQVA7O0FBZUQsS0EzQmMsbUJBQWpCIiwiZmlsZSI6Im5vLW5hbWVkLWRlZmF1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBuYW1lZCBkZWZhdWx0IGV4cG9ydHMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tbmFtZWQtZGVmYXVsdCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIHJldHVybiB7XG4gICAgICAnSW1wb3J0RGVjbGFyYXRpb24nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAoaW0pIHtcbiAgICAgICAgICBpZiAoaW0uaW1wb3J0S2luZCA9PT0gJ3R5cGUnIHx8IGltLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGltLnR5cGUgPT09ICdJbXBvcnRTcGVjaWZpZXInICYmIChpbS5pbXBvcnRlZC5uYW1lIHx8IGltLmltcG9ydGVkLnZhbHVlKSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGU6IGltLmxvY2FsLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBgVXNlIGRlZmF1bHQgaW1wb3J0IHN5bnRheCB0byBpbXBvcnQgJyR7aW0ubG9jYWwubmFtZX0nLmAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=