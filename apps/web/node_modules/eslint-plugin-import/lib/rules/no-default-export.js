'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid default exports.',
      url: (0, _docsUrl2['default'])('no-default-export') },

    schema: [] },


  create: function () {function create(context) {
      // ignore non-modules
      if (context.parserOptions.sourceType !== 'module') {
        return {};
      }

      var preferNamed = 'Prefer named exports.';
      var noAliasDefault = function () {function noAliasDefault(_ref) {var local = _ref.local;return 'Do not alias `' + String(local.name) + '` as `default`. Just export `' + String(local.name) + '` itself instead.';}return noAliasDefault;}();

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {var _ref2 =
            context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref2.loc;
            context.report({ node: node, message: preferNamed, loc: loc });
          }return ExportDefaultDeclaration;}(),

        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            node.specifiers.filter(function (specifier) {return (specifier.exported.name || specifier.exported.value) === 'default';}).forEach(function (specifier) {var _ref3 =
              context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref3.loc;
              if (specifier.type === 'ExportDefaultSpecifier') {
                context.report({ node: node, message: preferNamed, loc: loc });
              } else if (specifier.type === 'ExportSpecifier') {
                context.report({ node: node, message: noAliasDefault(specifier), loc: loc });
              }
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZWZhdWx0LWV4cG9ydC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJwYXJzZXJPcHRpb25zIiwic291cmNlVHlwZSIsInByZWZlck5hbWVkIiwibm9BbGlhc0RlZmF1bHQiLCJsb2NhbCIsIm5hbWUiLCJFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24iLCJub2RlIiwiZ2V0U291cmNlQ29kZSIsImdldEZpcnN0VG9rZW5zIiwibG9jIiwicmVwb3J0IiwibWVzc2FnZSIsIkV4cG9ydE5hbWVkRGVjbGFyYXRpb24iLCJzcGVjaWZpZXJzIiwiZmlsdGVyIiwic3BlY2lmaWVyIiwiZXhwb3J0ZWQiLCJ2YWx1ZSIsImZvckVhY2giXSwibWFwcGluZ3MiOiJhQUFBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsYUFETjtBQUVKQyxtQkFBYSx5QkFGVDtBQUdKQyxXQUFLLDBCQUFRLG1CQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUSxFQVBKLEVBRFM7OztBQVdmQyxRQVhlLCtCQVdSQyxPQVhRLEVBV0M7QUFDZDtBQUNBLFVBQUlBLFFBQVFDLGFBQVIsQ0FBc0JDLFVBQXRCLEtBQXFDLFFBQXpDLEVBQW1EO0FBQ2pELGVBQU8sRUFBUDtBQUNEOztBQUVELFVBQU1DLGNBQWMsdUJBQXBCO0FBQ0EsVUFBTUMsOEJBQWlCLFNBQWpCQSxjQUFpQixZQUFHQyxLQUFILFFBQUdBLEtBQUgsa0NBQWlDQSxNQUFNQyxJQUF2Qyw2Q0FBK0VELE1BQU1DLElBQXJGLHlCQUFqQix5QkFBTjs7QUFFQSxhQUFPO0FBQ0xDLGdDQURLLGlEQUNvQkMsSUFEcEIsRUFDMEI7QUFDYlIsb0JBQVFTLGFBQVIsR0FBd0JDLGNBQXhCLENBQXVDRixJQUF2QyxFQUE2QyxDQUE3QyxLQUFtRCxFQUR0QyxDQUNyQkcsR0FEcUIsU0FDckJBLEdBRHFCO0FBRTdCWCxvQkFBUVksTUFBUixDQUFlLEVBQUVKLFVBQUYsRUFBUUssU0FBU1YsV0FBakIsRUFBOEJRLFFBQTlCLEVBQWY7QUFDRCxXQUpJOztBQU1MRyw4QkFOSywrQ0FNa0JOLElBTmxCLEVBTXdCO0FBQzNCQSxpQkFBS08sVUFBTCxDQUFnQkMsTUFBaEIsQ0FBdUIsNkJBQWEsQ0FBQ0MsVUFBVUMsUUFBVixDQUFtQlosSUFBbkIsSUFBMkJXLFVBQVVDLFFBQVYsQ0FBbUJDLEtBQS9DLE1BQTBELFNBQXZFLEVBQXZCLEVBQXlHQyxPQUF6RyxDQUFpSCxxQkFBYTtBQUM1R3BCLHNCQUFRUyxhQUFSLEdBQXdCQyxjQUF4QixDQUF1Q0YsSUFBdkMsRUFBNkMsQ0FBN0MsS0FBbUQsRUFEeUQsQ0FDcEhHLEdBRG9ILFNBQ3BIQSxHQURvSDtBQUU1SCxrQkFBSU0sVUFBVXhCLElBQVYsS0FBbUIsd0JBQXZCLEVBQWlEO0FBQy9DTyx3QkFBUVksTUFBUixDQUFlLEVBQUVKLFVBQUYsRUFBUUssU0FBU1YsV0FBakIsRUFBOEJRLFFBQTlCLEVBQWY7QUFDRCxlQUZELE1BRU8sSUFBSU0sVUFBVXhCLElBQVYsS0FBbUIsaUJBQXZCLEVBQTBDO0FBQy9DTyx3QkFBUVksTUFBUixDQUFlLEVBQUVKLFVBQUYsRUFBUUssU0FBU1QsZUFBZWEsU0FBZixDQUFqQixFQUE0Q04sUUFBNUMsRUFBZjtBQUNEO0FBQ0YsYUFQRDtBQVFELFdBZkksbUNBQVA7O0FBaUJELEtBckNjLG1CQUFqQiIsImZpbGUiOiJuby1kZWZhdWx0LWV4cG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0eWxlIGd1aWRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yYmlkIGRlZmF1bHQgZXhwb3J0cy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1kZWZhdWx0LWV4cG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIC8vIGlnbm9yZSBub24tbW9kdWxlc1xuICAgIGlmIChjb250ZXh0LnBhcnNlck9wdGlvbnMuc291cmNlVHlwZSAhPT0gJ21vZHVsZScpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVmZXJOYW1lZCA9ICdQcmVmZXIgbmFtZWQgZXhwb3J0cy4nO1xuICAgIGNvbnN0IG5vQWxpYXNEZWZhdWx0ID0gKHsgbG9jYWwgfSkgPT4gYERvIG5vdCBhbGlhcyBcXGAke2xvY2FsLm5hbWV9XFxgIGFzIFxcYGRlZmF1bHRcXGAuIEp1c3QgZXhwb3J0IFxcYCR7bG9jYWwubmFtZX1cXGAgaXRzZWxmIGluc3RlYWQuYDtcblxuICAgIHJldHVybiB7XG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBjb25zdCB7IGxvYyB9ID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuZ2V0Rmlyc3RUb2tlbnMobm9kZSlbMV0gfHwge307XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogcHJlZmVyTmFtZWQsIGxvYyB9KTtcbiAgICAgIH0sXG5cbiAgICAgIEV4cG9ydE5hbWVkRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBub2RlLnNwZWNpZmllcnMuZmlsdGVyKHNwZWNpZmllciA9PiAoc3BlY2lmaWVyLmV4cG9ydGVkLm5hbWUgfHwgc3BlY2lmaWVyLmV4cG9ydGVkLnZhbHVlKSA9PT0gJ2RlZmF1bHQnKS5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgY29uc3QgeyBsb2MgfSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpLmdldEZpcnN0VG9rZW5zKG5vZGUpWzFdIHx8IHt9O1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0V4cG9ydERlZmF1bHRTcGVjaWZpZXInKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IHByZWZlck5hbWVkLCBsb2MgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0V4cG9ydFNwZWNpZmllcicpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogbm9BbGlhc0RlZmF1bHQoc3BlY2lmaWVyKSwgbG9jICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==