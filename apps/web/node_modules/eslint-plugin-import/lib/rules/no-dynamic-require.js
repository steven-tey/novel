'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isRequire(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Identifier' &&
  node.callee.name === 'require' &&
  node.arguments.length >= 1;
}

function isDynamicImport(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Import';
}

function isStaticValue(arg) {
  return arg.type === 'Literal' ||
  arg.type === 'TemplateLiteral' && arg.expressions.length === 0;
}

var dynamicImportErrorMessage = 'Calls to import() should use string literals';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid `require()` calls with expressions.',
      url: (0, _docsUrl2['default'])('no-dynamic-require') },

    schema: [
    {
      type: 'object',
      properties: {
        esmodule: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      return {
        CallExpression: function () {function CallExpression(node) {
            if (!node.arguments[0] || isStaticValue(node.arguments[0])) {
              return;
            }
            if (isRequire(node)) {
              return context.report({
                node: node,
                message: 'Calls to require() should use string literals' });

            }
            if (options.esmodule && isDynamicImport(node)) {
              return context.report({
                node: node,
                message: dynamicImportErrorMessage });

            }
          }return CallExpression;}(),
        ImportExpression: function () {function ImportExpression(node) {
            if (!options.esmodule || isStaticValue(node.source)) {
              return;
            }
            return context.report({
              node: node,
              message: dynamicImportErrorMessage });

          }return ImportExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1keW5hbWljLXJlcXVpcmUuanMiXSwibmFtZXMiOlsiaXNSZXF1aXJlIiwibm9kZSIsImNhbGxlZSIsInR5cGUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiaXNEeW5hbWljSW1wb3J0IiwiaXNTdGF0aWNWYWx1ZSIsImFyZyIsImV4cHJlc3Npb25zIiwiZHluYW1pY0ltcG9ydEVycm9yTWVzc2FnZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiZXNtb2R1bGUiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsImNvbnRleHQiLCJvcHRpb25zIiwiQ2FsbEV4cHJlc3Npb24iLCJyZXBvcnQiLCJtZXNzYWdlIiwiSW1wb3J0RXhwcmVzc2lvbiIsInNvdXJjZSJdLCJtYXBwaW5ncyI6ImFBQUEscUM7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUI7QUFDdkIsU0FBT0E7QUFDTEEsT0FBS0MsTUFEQTtBQUVMRCxPQUFLQyxNQUFMLENBQVlDLElBQVosS0FBcUIsWUFGaEI7QUFHTEYsT0FBS0MsTUFBTCxDQUFZRSxJQUFaLEtBQXFCLFNBSGhCO0FBSUxILE9BQUtJLFNBQUwsQ0FBZUMsTUFBZixJQUF5QixDQUozQjtBQUtEOztBQUVELFNBQVNDLGVBQVQsQ0FBeUJOLElBQXpCLEVBQStCO0FBQzdCLFNBQU9BO0FBQ0xBLE9BQUtDLE1BREE7QUFFTEQsT0FBS0MsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBRnZCO0FBR0Q7O0FBRUQsU0FBU0ssYUFBVCxDQUF1QkMsR0FBdkIsRUFBNEI7QUFDMUIsU0FBT0EsSUFBSU4sSUFBSixLQUFhLFNBQWI7QUFDSk0sTUFBSU4sSUFBSixLQUFhLGlCQUFiLElBQWtDTSxJQUFJQyxXQUFKLENBQWdCSixNQUFoQixLQUEyQixDQURoRTtBQUVEOztBQUVELElBQU1LLDRCQUE0Qiw4Q0FBbEM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKWCxVQUFNLFlBREY7QUFFSlksVUFBTTtBQUNKQyxnQkFBVSxpQkFETjtBQUVKQyxtQkFBYSw0Q0FGVDtBQUdKQyxXQUFLLDBCQUFRLG9CQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUTtBQUNOO0FBQ0VoQixZQUFNLFFBRFI7QUFFRWlCLGtCQUFZO0FBQ1ZDLGtCQUFVO0FBQ1JsQixnQkFBTSxTQURFLEVBREEsRUFGZDs7O0FBT0VtQiw0QkFBc0IsS0FQeEIsRUFETSxDQVBKLEVBRFM7Ozs7O0FBcUJmQyxRQXJCZSwrQkFxQlJDLE9BckJRLEVBcUJDO0FBQ2QsVUFBTUMsVUFBVUQsUUFBUUMsT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUF0Qzs7QUFFQSxhQUFPO0FBQ0xDLHNCQURLLHVDQUNVekIsSUFEVixFQUNnQjtBQUNuQixnQkFBSSxDQUFDQSxLQUFLSSxTQUFMLENBQWUsQ0FBZixDQUFELElBQXNCRyxjQUFjUCxLQUFLSSxTQUFMLENBQWUsQ0FBZixDQUFkLENBQTFCLEVBQTREO0FBQzFEO0FBQ0Q7QUFDRCxnQkFBSUwsVUFBVUMsSUFBVixDQUFKLEVBQXFCO0FBQ25CLHFCQUFPdUIsUUFBUUcsTUFBUixDQUFlO0FBQ3BCMUIsMEJBRG9CO0FBRXBCMkIseUJBQVMsK0NBRlcsRUFBZixDQUFQOztBQUlEO0FBQ0QsZ0JBQUlILFFBQVFKLFFBQVIsSUFBb0JkLGdCQUFnQk4sSUFBaEIsQ0FBeEIsRUFBK0M7QUFDN0MscUJBQU91QixRQUFRRyxNQUFSLENBQWU7QUFDcEIxQiwwQkFEb0I7QUFFcEIyQix5QkFBU2pCLHlCQUZXLEVBQWYsQ0FBUDs7QUFJRDtBQUNGLFdBakJJO0FBa0JMa0Isd0JBbEJLLHlDQWtCWTVCLElBbEJaLEVBa0JrQjtBQUNyQixnQkFBSSxDQUFDd0IsUUFBUUosUUFBVCxJQUFxQmIsY0FBY1AsS0FBSzZCLE1BQW5CLENBQXpCLEVBQXFEO0FBQ25EO0FBQ0Q7QUFDRCxtQkFBT04sUUFBUUcsTUFBUixDQUFlO0FBQ3BCMUIsd0JBRG9CO0FBRXBCMkIsdUJBQVNqQix5QkFGVyxFQUFmLENBQVA7O0FBSUQsV0ExQkksNkJBQVA7O0FBNEJELEtBcERjLG1CQUFqQiIsImZpbGUiOiJuby1keW5hbWljLXJlcXVpcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gaXNSZXF1aXJlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiZcbiAgICBub2RlLmNhbGxlZSAmJlxuICAgIG5vZGUuY2FsbGVlLnR5cGUgPT09ICdJZGVudGlmaWVyJyAmJlxuICAgIG5vZGUuY2FsbGVlLm5hbWUgPT09ICdyZXF1aXJlJyAmJlxuICAgIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA+PSAxO1xufVxuXG5mdW5jdGlvbiBpc0R5bmFtaWNJbXBvcnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJlxuICAgIG5vZGUuY2FsbGVlICYmXG4gICAgbm9kZS5jYWxsZWUudHlwZSA9PT0gJ0ltcG9ydCc7XG59XG5cbmZ1bmN0aW9uIGlzU3RhdGljVmFsdWUoYXJnKSB7XG4gIHJldHVybiBhcmcudHlwZSA9PT0gJ0xpdGVyYWwnIHx8XG4gICAgKGFyZy50eXBlID09PSAnVGVtcGxhdGVMaXRlcmFsJyAmJiBhcmcuZXhwcmVzc2lvbnMubGVuZ3RoID09PSAwKTtcbn1cblxuY29uc3QgZHluYW1pY0ltcG9ydEVycm9yTWVzc2FnZSA9ICdDYWxscyB0byBpbXBvcnQoKSBzaG91bGQgdXNlIHN0cmluZyBsaXRlcmFscyc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yYmlkIGByZXF1aXJlKClgIGNhbGxzIHdpdGggZXhwcmVzc2lvbnMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tZHluYW1pYy1yZXF1aXJlJyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBlc21vZHVsZToge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUuYXJndW1lbnRzWzBdIHx8IGlzU3RhdGljVmFsdWUobm9kZS5hcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1JlcXVpcmUobm9kZSkpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdDYWxscyB0byByZXF1aXJlKCkgc2hvdWxkIHVzZSBzdHJpbmcgbGl0ZXJhbHMnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmVzbW9kdWxlICYmIGlzRHluYW1pY0ltcG9ydChub2RlKSkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogZHluYW1pY0ltcG9ydEVycm9yTWVzc2FnZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEltcG9ydEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZXNtb2R1bGUgfHwgaXNTdGF0aWNWYWx1ZShub2RlLnNvdXJjZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IGR5bmFtaWNJbXBvcnRFcnJvck1lc3NhZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==