'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getImportValue(node) {
  return node.type === 'ImportDeclaration' ?
  node.source.value :
  node.moduleReference.expression.value;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Ensure all imports appear before other statements.',
      url: (0, _docsUrl2['default'])('first') },

    fixable: 'code',
    schema: [
    {
      type: 'string',
      'enum': ['absolute-first', 'disable-absolute-first'] }] },




  create: function () {function create(context) {
      function isPossibleDirective(node) {
        return node.type === 'ExpressionStatement' &&
        node.expression.type === 'Literal' &&
        typeof node.expression.value === 'string';
      }

      return {
        'Program': function () {function Program(n) {
            var body = n.body;
            if (!body) {
              return;
            }
            var absoluteFirst = context.options[0] === 'absolute-first';
            var message = 'Import in body of module; reorder to top.';
            var sourceCode = context.getSourceCode();
            var originSourceCode = sourceCode.getText();
            var nonImportCount = 0;
            var anyExpressions = false;
            var anyRelative = false;
            var lastLegalImp = null;
            var errorInfos = [];
            var shouldSort = true;
            var lastSortNodesIndex = 0;
            body.forEach(function (node, index) {
              if (!anyExpressions && isPossibleDirective(node)) {
                return;
              }

              anyExpressions = true;

              if (node.type === 'ImportDeclaration' || node.type === 'TSImportEqualsDeclaration') {
                if (absoluteFirst) {
                  if (/^\./.test(getImportValue(node))) {
                    anyRelative = true;
                  } else if (anyRelative) {
                    context.report({
                      node: node.type === 'ImportDeclaration' ? node.source : node.moduleReference,
                      message: 'Absolute imports should come before relative imports.' });

                  }
                }
                if (nonImportCount > 0) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
                    for (var _iterator = context.getDeclaredVariables(node)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var variable = _step.value;
                      if (!shouldSort) break;
                      var references = variable.references;
                      if (references.length) {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
                          for (var _iterator2 = references[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var reference = _step2.value;
                            if (reference.identifier.range[0] < node.range[1]) {
                              shouldSort = false;
                              break;
                            }
                          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
                      }
                    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
                  shouldSort && (lastSortNodesIndex = errorInfos.length);
                  errorInfos.push({
                    node: node,
                    range: [body[index - 1].range[1], node.range[1]] });

                } else {
                  lastLegalImp = node;
                }
              } else {
                nonImportCount++;
              }
            });
            if (!errorInfos.length) return;
            errorInfos.forEach(function (errorInfo, index) {
              var node = errorInfo.node;
              var infos = {
                node: node,
                message: message };

              if (index < lastSortNodesIndex) {
                infos.fix = function (fixer) {
                  return fixer.insertTextAfter(node, '');
                };
              } else if (index === lastSortNodesIndex) {
                var sortNodes = errorInfos.slice(0, lastSortNodesIndex + 1);
                infos.fix = function (fixer) {
                  var removeFixers = sortNodes.map(function (_errorInfo) {
                    return fixer.removeRange(_errorInfo.range);
                  });
                  var range = [0, removeFixers[removeFixers.length - 1].range[1]];
                  var insertSourceCode = sortNodes.map(function (_errorInfo) {
                    var nodeSourceCode = String.prototype.slice.apply(
                    originSourceCode, _errorInfo.range);

                    if (/\S/.test(nodeSourceCode[0])) {
                      return '\n' + nodeSourceCode;
                    }
                    return nodeSourceCode;
                  }).join('');
                  var insertFixer = null;
                  var replaceSourceCode = '';
                  if (!lastLegalImp) {
                    insertSourceCode =
                    insertSourceCode.trim() + insertSourceCode.match(/^(\s+)/)[0];
                  }
                  insertFixer = lastLegalImp ?
                  fixer.insertTextAfter(lastLegalImp, insertSourceCode) :
                  fixer.insertTextBefore(body[0], insertSourceCode);
                  var fixers = [insertFixer].concat(removeFixers);
                  fixers.forEach(function (computedFixer, i) {
                    replaceSourceCode += originSourceCode.slice(
                    fixers[i - 1] ? fixers[i - 1].range[1] : 0, computedFixer.range[0]) +
                    computedFixer.text;
                  });
                  return fixer.replaceTextRange(range, replaceSourceCode);
                };
              }
              context.report(infos);
            });
          }return Program;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9maXJzdC5qcyJdLCJuYW1lcyI6WyJnZXRJbXBvcnRWYWx1ZSIsIm5vZGUiLCJ0eXBlIiwic291cmNlIiwidmFsdWUiLCJtb2R1bGVSZWZlcmVuY2UiLCJleHByZXNzaW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsImZpeGFibGUiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0IiwiaXNQb3NzaWJsZURpcmVjdGl2ZSIsIm4iLCJib2R5IiwiYWJzb2x1dGVGaXJzdCIsIm9wdGlvbnMiLCJtZXNzYWdlIiwic291cmNlQ29kZSIsImdldFNvdXJjZUNvZGUiLCJvcmlnaW5Tb3VyY2VDb2RlIiwiZ2V0VGV4dCIsIm5vbkltcG9ydENvdW50IiwiYW55RXhwcmVzc2lvbnMiLCJhbnlSZWxhdGl2ZSIsImxhc3RMZWdhbEltcCIsImVycm9ySW5mb3MiLCJzaG91bGRTb3J0IiwibGFzdFNvcnROb2Rlc0luZGV4IiwiZm9yRWFjaCIsImluZGV4IiwidGVzdCIsInJlcG9ydCIsImdldERlY2xhcmVkVmFyaWFibGVzIiwidmFyaWFibGUiLCJyZWZlcmVuY2VzIiwibGVuZ3RoIiwicmVmZXJlbmNlIiwiaWRlbnRpZmllciIsInJhbmdlIiwicHVzaCIsImVycm9ySW5mbyIsImluZm9zIiwiZml4IiwiZml4ZXIiLCJpbnNlcnRUZXh0QWZ0ZXIiLCJzb3J0Tm9kZXMiLCJzbGljZSIsInJlbW92ZUZpeGVycyIsIm1hcCIsIl9lcnJvckluZm8iLCJyZW1vdmVSYW5nZSIsImluc2VydFNvdXJjZUNvZGUiLCJub2RlU291cmNlQ29kZSIsIlN0cmluZyIsInByb3RvdHlwZSIsImFwcGx5Iiwiam9pbiIsImluc2VydEZpeGVyIiwicmVwbGFjZVNvdXJjZUNvZGUiLCJ0cmltIiwibWF0Y2giLCJpbnNlcnRUZXh0QmVmb3JlIiwiZml4ZXJzIiwiY29uY2F0IiwiY29tcHV0ZWRGaXhl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QmdCLDJCQUFPRyxJQUFJLENBQVgsSUFBZ0JILE9BQU9HLElBQUksQ0FBWCxFQUFjM0IsS0FBZCxDQUFvQixDQUFwQixDQUFoQixHQUF5QyxDQURyQixFQUN3QjBCLGNBQWMxQixLQUFkLENBQW9CLENBQXBCLENBRHhCO0FBRWxCMEIsa0NBQWNFLElBRmxCO0FBR0QsbUJBSkQ7QUFLQSx5QkFBT3ZCLE1BQU13QixnQkFBTixDQUF1QjdCLEtBQXZCLEVBQThCb0IsaUJBQTlCLENBQVA7QUFDRCxpQkE5QkQ7QUErQkQ7QUFDRGhELHNCQUFRcUIsTUFBUixDQUFlVSxLQUFmO0FBQ0QsYUE3Q0Q7QUE4Q0QsV0ExR0Qsa0JBREssRUFBUDs7QUE2R0QsS0FySWMsbUJBQWpCIiwiZmlsZSI6ImZpcnN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmZ1bmN0aW9uIGdldEltcG9ydFZhbHVlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJ1xuICAgID8gbm9kZS5zb3VyY2UudmFsdWVcbiAgICA6IG5vZGUubW9kdWxlUmVmZXJlbmNlLmV4cHJlc3Npb24udmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbnN1cmUgYWxsIGltcG9ydHMgYXBwZWFyIGJlZm9yZSBvdGhlciBzdGF0ZW1lbnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ2ZpcnN0JyksXG4gICAgfSxcbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbJ2Fic29sdXRlLWZpcnN0JywgJ2Rpc2FibGUtYWJzb2x1dGUtZmlyc3QnXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGZ1bmN0aW9uIGlzUG9zc2libGVEaXJlY3RpdmUobm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0V4cHJlc3Npb25TdGF0ZW1lbnQnICYmXG4gICAgICAgIG5vZGUuZXhwcmVzc2lvbi50eXBlID09PSAnTGl0ZXJhbCcgJiZcbiAgICAgICAgdHlwZW9mIG5vZGUuZXhwcmVzc2lvbi52YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICdQcm9ncmFtJzogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgY29uc3QgYm9keSA9IG4uYm9keTtcbiAgICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFic29sdXRlRmlyc3QgPSBjb250ZXh0Lm9wdGlvbnNbMF0gPT09ICdhYnNvbHV0ZS1maXJzdCc7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnSW1wb3J0IGluIGJvZHkgb2YgbW9kdWxlOyByZW9yZGVyIHRvIHRvcC4nO1xuICAgICAgICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG4gICAgICAgIGNvbnN0IG9yaWdpblNvdXJjZUNvZGUgPSBzb3VyY2VDb2RlLmdldFRleHQoKTtcbiAgICAgICAgbGV0IG5vbkltcG9ydENvdW50ID0gMDtcbiAgICAgICAgbGV0IGFueUV4cHJlc3Npb25zID0gZmFsc2U7XG4gICAgICAgIGxldCBhbnlSZWxhdGl2ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbGFzdExlZ2FsSW1wID0gbnVsbDtcbiAgICAgICAgY29uc3QgZXJyb3JJbmZvcyA9IFtdO1xuICAgICAgICBsZXQgc2hvdWxkU29ydCA9IHRydWU7XG4gICAgICAgIGxldCBsYXN0U29ydE5vZGVzSW5kZXggPSAwO1xuICAgICAgICBib2R5LmZvckVhY2goZnVuY3Rpb24gKG5vZGUsIGluZGV4KSB7XG4gICAgICAgICAgaWYgKCFhbnlFeHByZXNzaW9ucyAmJiBpc1Bvc3NpYmxlRGlyZWN0aXZlKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYW55RXhwcmVzc2lvbnMgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJyB8fCBub2RlLnR5cGUgPT09ICdUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgaWYgKGFic29sdXRlRmlyc3QpIHtcbiAgICAgICAgICAgICAgaWYgKC9eXFwuLy50ZXN0KGdldEltcG9ydFZhbHVlKG5vZGUpKSkge1xuICAgICAgICAgICAgICAgIGFueVJlbGF0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbnlSZWxhdGl2ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJyA/IG5vZGUuc291cmNlIDogbm9kZS5tb2R1bGVSZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQWJzb2x1dGUgaW1wb3J0cyBzaG91bGQgY29tZSBiZWZvcmUgcmVsYXRpdmUgaW1wb3J0cy4nLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9uSW1wb3J0Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgdmFyaWFibGUgb2YgY29udGV4dC5nZXREZWNsYXJlZFZhcmlhYmxlcyhub2RlKSkge1xuICAgICAgICAgICAgICAgIGlmICghc2hvdWxkU29ydCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IHZhcmlhYmxlLnJlZmVyZW5jZXM7XG4gICAgICAgICAgICAgICAgaWYgKHJlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJlZmVyZW5jZSBvZiByZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWZlcmVuY2UuaWRlbnRpZmllci5yYW5nZVswXSA8IG5vZGUucmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzaG91bGRTb3J0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2hvdWxkU29ydCAmJiAobGFzdFNvcnROb2Rlc0luZGV4ID0gZXJyb3JJbmZvcy5sZW5ndGgpO1xuICAgICAgICAgICAgICBlcnJvckluZm9zLnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtib2R5W2luZGV4IC0gMV0ucmFuZ2VbMV0sIG5vZGUucmFuZ2VbMV1dLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxhc3RMZWdhbEltcCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vbkltcG9ydENvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFlcnJvckluZm9zLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBlcnJvckluZm9zLmZvckVhY2goZnVuY3Rpb24gKGVycm9ySW5mbywgaW5kZXgpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gZXJyb3JJbmZvLm5vZGU7XG4gICAgICAgICAgY29uc3QgaW5mb3MgPSB7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpbmRleCA8IGxhc3RTb3J0Tm9kZXNJbmRleCkge1xuICAgICAgICAgICAgaW5mb3MuZml4ID0gZnVuY3Rpb24gKGZpeGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaXhlci5pbnNlcnRUZXh0QWZ0ZXIobm9kZSwgJycpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBsYXN0U29ydE5vZGVzSW5kZXgpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnROb2RlcyA9IGVycm9ySW5mb3Muc2xpY2UoMCwgbGFzdFNvcnROb2Rlc0luZGV4ICsgMSk7XG4gICAgICAgICAgICBpbmZvcy5maXggPSBmdW5jdGlvbiAoZml4ZXIpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlRml4ZXJzID0gc29ydE5vZGVzLm1hcChmdW5jdGlvbiAoX2Vycm9ySW5mbykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaXhlci5yZW1vdmVSYW5nZShfZXJyb3JJbmZvLnJhbmdlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gWzAsIHJlbW92ZUZpeGVyc1tyZW1vdmVGaXhlcnMubGVuZ3RoIC0gMV0ucmFuZ2VbMV1dO1xuICAgICAgICAgICAgICBsZXQgaW5zZXJ0U291cmNlQ29kZSA9IHNvcnROb2Rlcy5tYXAoZnVuY3Rpb24gKF9lcnJvckluZm8pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlU291cmNlQ29kZSA9IFN0cmluZy5wcm90b3R5cGUuc2xpY2UuYXBwbHkoXG4gICAgICAgICAgICAgICAgICBvcmlnaW5Tb3VyY2VDb2RlLCBfZXJyb3JJbmZvLnJhbmdlLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKC9cXFMvLnRlc3Qobm9kZVNvdXJjZUNvZGVbMF0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJ1xcbicgKyBub2RlU291cmNlQ29kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVTb3VyY2VDb2RlO1xuICAgICAgICAgICAgICB9KS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgbGV0IGluc2VydEZpeGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgbGV0IHJlcGxhY2VTb3VyY2VDb2RlID0gJyc7XG4gICAgICAgICAgICAgIGlmICghbGFzdExlZ2FsSW1wKSB7XG4gICAgICAgICAgICAgICAgaW5zZXJ0U291cmNlQ29kZSA9XG4gICAgICAgICAgICAgICAgICAgIGluc2VydFNvdXJjZUNvZGUudHJpbSgpICsgaW5zZXJ0U291cmNlQ29kZS5tYXRjaCgvXihcXHMrKS8pWzBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGluc2VydEZpeGVyID0gbGFzdExlZ2FsSW1wID9cbiAgICAgICAgICAgICAgICBmaXhlci5pbnNlcnRUZXh0QWZ0ZXIobGFzdExlZ2FsSW1wLCBpbnNlcnRTb3VyY2VDb2RlKSA6XG4gICAgICAgICAgICAgICAgZml4ZXIuaW5zZXJ0VGV4dEJlZm9yZShib2R5WzBdLCBpbnNlcnRTb3VyY2VDb2RlKTtcbiAgICAgICAgICAgICAgY29uc3QgZml4ZXJzID0gW2luc2VydEZpeGVyXS5jb25jYXQocmVtb3ZlRml4ZXJzKTtcbiAgICAgICAgICAgICAgZml4ZXJzLmZvckVhY2goZnVuY3Rpb24gKGNvbXB1dGVkRml4ZXIsIGkpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlU291cmNlQ29kZSArPSAob3JpZ2luU291cmNlQ29kZS5zbGljZShcbiAgICAgICAgICAgICAgICAgIGZpeGVyc1tpIC0gMV0gPyBmaXhlcnNbaSAtIDFdLnJhbmdlWzFdIDogMCwgY29tcHV0ZWRGaXhlci5yYW5nZVswXSxcbiAgICAgICAgICAgICAgICApICsgY29tcHV0ZWRGaXhlci50ZXh0KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaXhlci5yZXBsYWNlVGV4dFJhbmdlKHJhbmdlLCByZXBsYWNlU291cmNlQ29kZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbmZvcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==