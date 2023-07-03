'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);

var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function report(context, node) {
  context.report({
    node: node,
    message: 'Imported module should be assigned' });

}

function testIsAllow(globs, filename, source) {
  if (!Array.isArray(globs)) {
    return false; // default doesn't allow any patterns
  }

  var filePath = void 0;

  if (source[0] !== '.' && source[0] !== '/') {// a node module
    filePath = source;
  } else {
    filePath = _path2['default'].resolve(_path2['default'].dirname(filename), source); // get source absolute path
  }

  return globs.find(function (glob) {return (
      (0, _minimatch2['default'])(filePath, glob) ||
      (0, _minimatch2['default'])(filePath, _path2['default'].join(process.cwd(), glob)));}) !==
  undefined;
}

function create(context) {
  var options = context.options[0] || {};
  var filename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
  var isAllow = function isAllow(source) {return testIsAllow(options.allow, filename, source);};

  return {
    ImportDeclaration: function () {function ImportDeclaration(node) {
        if (node.specifiers.length === 0 && !isAllow(node.source.value)) {
          report(context, node);
        }
      }return ImportDeclaration;}(),
    ExpressionStatement: function () {function ExpressionStatement(node) {
        if (node.expression.type === 'CallExpression' &&
        (0, _staticRequire2['default'])(node.expression) &&
        !isAllow(node.expression.arguments[0].value)) {
          report(context, node.expression);
        }
      }return ExpressionStatement;}() };

}

module.exports = {
  create: create,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid unassigned imports',
      url: (0, _docsUrl2['default'])('no-unassigned-import') },

    schema: [
    {
      'type': 'object',
      'properties': {
        'devDependencies': { 'type': ['boolean', 'array'] },
        'optionalDependencies': { 'type': ['boolean', 'array'] },
        'peerDependencies': { 'type': ['boolean', 'array'] },
        'allow': {
          'type': 'array',
          'items': {
            'type': 'string' } } },



      'additionalProperties': false }] } };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bmFzc2lnbmVkLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJyZXBvcnQiLCJjb250ZXh0Iiwibm9kZSIsIm1lc3NhZ2UiLCJ0ZXN0SXNBbGxvdyIsImdsb2JzIiwiZmlsZW5hbWUiLCJzb3VyY2UiLCJBcnJheSIsImlzQXJyYXkiLCJmaWxlUGF0aCIsInBhdGgiLCJyZXNvbHZlIiwiZGlybmFtZSIsImZpbmQiLCJnbG9iIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJ1bmRlZmluZWQiLCJjcmVhdGUiLCJvcHRpb25zIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiaXNBbGxvdyIsImFsbG93IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzcGVjaWZpZXJzIiwibGVuZ3RoIiwidmFsdWUiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiZXhwcmVzc2lvbiIsInR5cGUiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIl0sIm1hcHBpbmdzIjoiYUFBQSw0QjtBQUNBLHNDOztBQUVBLHNEO0FBQ0EscUM7O0FBRUEsU0FBU0EsTUFBVCxDQUFnQkMsT0FBaEIsRUFBeUJDLElBQXpCLEVBQStCO0FBQzdCRCxVQUFRRCxNQUFSLENBQWU7QUFDYkUsY0FEYTtBQUViQyxhQUFTLG9DQUZJLEVBQWY7O0FBSUQ7O0FBRUQsU0FBU0MsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEJDLFFBQTVCLEVBQXNDQyxNQUF0QyxFQUE4QztBQUM1QyxNQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0osS0FBZCxDQUFMLEVBQTJCO0FBQ3pCLFdBQU8sS0FBUCxDQUR5QixDQUNYO0FBQ2Y7O0FBRUQsTUFBSUssaUJBQUo7O0FBRUEsTUFBSUgsT0FBTyxDQUFQLE1BQWMsR0FBZCxJQUFxQkEsT0FBTyxDQUFQLE1BQWMsR0FBdkMsRUFBNEMsQ0FBRTtBQUM1Q0csZUFBV0gsTUFBWDtBQUNELEdBRkQsTUFFTztBQUNMRyxlQUFXQyxrQkFBS0MsT0FBTCxDQUFhRCxrQkFBS0UsT0FBTCxDQUFhUCxRQUFiLENBQWIsRUFBcUNDLE1BQXJDLENBQVgsQ0FESyxDQUNvRDtBQUMxRDs7QUFFRCxTQUFPRixNQUFNUyxJQUFOLENBQVc7QUFDaEIsa0NBQVVKLFFBQVYsRUFBb0JLLElBQXBCO0FBQ0Esa0NBQVVMLFFBQVYsRUFBb0JDLGtCQUFLSyxJQUFMLENBQVVDLFFBQVFDLEdBQVIsRUFBVixFQUF5QkgsSUFBekIsQ0FBcEIsQ0FGZ0IsR0FBWDtBQUdBSSxXQUhQO0FBSUQ7O0FBRUQsU0FBU0MsTUFBVCxDQUFnQm5CLE9BQWhCLEVBQXlCO0FBQ3ZCLE1BQU1vQixVQUFVcEIsUUFBUW9CLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFBdEM7QUFDQSxNQUFNZixXQUFXTCxRQUFRcUIsbUJBQVIsR0FBOEJyQixRQUFRcUIsbUJBQVIsRUFBOUIsR0FBOERyQixRQUFRc0IsV0FBUixFQUEvRTtBQUNBLE1BQU1DLFVBQVUsU0FBVkEsT0FBVSxpQkFBVXBCLFlBQVlpQixRQUFRSSxLQUFwQixFQUEyQm5CLFFBQTNCLEVBQXFDQyxNQUFyQyxDQUFWLEVBQWhCOztBQUVBLFNBQU87QUFDTG1CLHFCQURLLDBDQUNheEIsSUFEYixFQUNtQjtBQUN0QixZQUFJQSxLQUFLeUIsVUFBTCxDQUFnQkMsTUFBaEIsS0FBMkIsQ0FBM0IsSUFBZ0MsQ0FBQ0osUUFBUXRCLEtBQUtLLE1BQUwsQ0FBWXNCLEtBQXBCLENBQXJDLEVBQWlFO0FBQy9EN0IsaUJBQU9DLE9BQVAsRUFBZ0JDLElBQWhCO0FBQ0Q7QUFDRixPQUxJO0FBTUw0Qix1QkFOSyw0Q0FNZTVCLElBTmYsRUFNcUI7QUFDeEIsWUFBSUEsS0FBSzZCLFVBQUwsQ0FBZ0JDLElBQWhCLEtBQXlCLGdCQUF6QjtBQUNGLHdDQUFnQjlCLEtBQUs2QixVQUFyQixDQURFO0FBRUYsU0FBQ1AsUUFBUXRCLEtBQUs2QixVQUFMLENBQWdCRSxTQUFoQixDQUEwQixDQUExQixFQUE2QkosS0FBckMsQ0FGSCxFQUVnRDtBQUM5QzdCLGlCQUFPQyxPQUFQLEVBQWdCQyxLQUFLNkIsVUFBckI7QUFDRDtBQUNGLE9BWkksZ0NBQVA7O0FBY0Q7O0FBRURHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZmYsZ0JBRGU7QUFFZmdCLFFBQU07QUFDSkosVUFBTSxZQURGO0FBRUpLLFVBQU07QUFDSkMsZ0JBQVUsYUFETjtBQUVKQyxtQkFBYSwyQkFGVDtBQUdKQyxXQUFLLDBCQUFRLHNCQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUTtBQUNOO0FBQ0UsY0FBUSxRQURWO0FBRUUsb0JBQWM7QUFDWiwyQkFBbUIsRUFBRSxRQUFRLENBQUMsU0FBRCxFQUFZLE9BQVosQ0FBVixFQURQO0FBRVosZ0NBQXdCLEVBQUUsUUFBUSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBQVYsRUFGWjtBQUdaLDRCQUFvQixFQUFFLFFBQVEsQ0FBQyxTQUFELEVBQVksT0FBWixDQUFWLEVBSFI7QUFJWixpQkFBUztBQUNQLGtCQUFRLE9BREQ7QUFFUCxtQkFBUztBQUNQLG9CQUFRLFFBREQsRUFGRixFQUpHLEVBRmhCOzs7O0FBYUUsOEJBQXdCLEtBYjFCLEVBRE0sQ0FQSixFQUZTLEVBQWpCIiwiZmlsZSI6Im5vLXVuYXNzaWduZWQtaW1wb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5cbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5mdW5jdGlvbiByZXBvcnQoY29udGV4dCwgbm9kZSkge1xuICBjb250ZXh0LnJlcG9ydCh7XG4gICAgbm9kZSxcbiAgICBtZXNzYWdlOiAnSW1wb3J0ZWQgbW9kdWxlIHNob3VsZCBiZSBhc3NpZ25lZCcsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0ZXN0SXNBbGxvdyhnbG9icywgZmlsZW5hbWUsIHNvdXJjZSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZ2xvYnMpKSB7XG4gICAgcmV0dXJuIGZhbHNlOyAvLyBkZWZhdWx0IGRvZXNuJ3QgYWxsb3cgYW55IHBhdHRlcm5zXG4gIH1cblxuICBsZXQgZmlsZVBhdGg7XG5cbiAgaWYgKHNvdXJjZVswXSAhPT0gJy4nICYmIHNvdXJjZVswXSAhPT0gJy8nKSB7IC8vIGEgbm9kZSBtb2R1bGVcbiAgICBmaWxlUGF0aCA9IHNvdXJjZTtcbiAgfSBlbHNlIHtcbiAgICBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZmlsZW5hbWUpLCBzb3VyY2UpOyAvLyBnZXQgc291cmNlIGFic29sdXRlIHBhdGhcbiAgfVxuXG4gIHJldHVybiBnbG9icy5maW5kKGdsb2IgPT4gKFxuICAgIG1pbmltYXRjaChmaWxlUGF0aCwgZ2xvYikgfHxcbiAgICBtaW5pbWF0Y2goZmlsZVBhdGgsIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBnbG9iKSlcbiAgKSkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcbiAgY29uc3QgaXNBbGxvdyA9IHNvdXJjZSA9PiB0ZXN0SXNBbGxvdyhvcHRpb25zLmFsbG93LCBmaWxlbmFtZSwgc291cmNlKTtcblxuICByZXR1cm4ge1xuICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLnNwZWNpZmllcnMubGVuZ3RoID09PSAwICYmICFpc0FsbG93KG5vZGUuc291cmNlLnZhbHVlKSkge1xuICAgICAgICByZXBvcnQoY29udGV4dCwgbm9kZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgIGlmIChub2RlLmV4cHJlc3Npb24udHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJlxuICAgICAgICBpc1N0YXRpY1JlcXVpcmUobm9kZS5leHByZXNzaW9uKSAmJlxuICAgICAgICAhaXNBbGxvdyhub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdLnZhbHVlKSkge1xuICAgICAgICByZXBvcnQoY29udGV4dCwgbm9kZS5leHByZXNzaW9uKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlLFxuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgdW5hc3NpZ25lZCBpbXBvcnRzJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tdW5hc3NpZ25lZC1pbXBvcnQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgICAncHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnZGV2RGVwZW5kZW5jaWVzJzogeyAndHlwZSc6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgJ29wdGlvbmFsRGVwZW5kZW5jaWVzJzogeyAndHlwZSc6IFsnYm9vbGVhbicsICdhcnJheSddIH0sXG4gICAgICAgICAgJ3BlZXJEZXBlbmRlbmNpZXMnOiB7ICd0eXBlJzogWydib29sZWFuJywgJ2FycmF5J10gfSxcbiAgICAgICAgICAnYWxsb3cnOiB7XG4gICAgICAgICAgICAndHlwZSc6ICdhcnJheScsXG4gICAgICAgICAgICAnaXRlbXMnOiB7XG4gICAgICAgICAgICAgICd0eXBlJzogJ3N0cmluZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcyc6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufTtcbiJdfQ==