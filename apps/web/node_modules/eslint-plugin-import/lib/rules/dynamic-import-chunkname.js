'use strict';var _vm = require('vm');var _vm2 = _interopRequireDefault(_vm);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce a leading comment with the webpackChunkName for dynamic imports.',
      url: (0, _docsUrl2['default'])('dynamic-import-chunkname') },

    schema: [{
      type: 'object',
      properties: {
        importFunctions: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string' } },


        webpackChunknameFormat: {
          type: 'string' } } }] },





  create: function () {function create(context) {
      var config = context.options[0];var _ref =
      config || {},_ref$importFunctions = _ref.importFunctions,importFunctions = _ref$importFunctions === undefined ? [] : _ref$importFunctions;var _ref2 =
      config || {},_ref2$webpackChunknam = _ref2.webpackChunknameFormat,webpackChunknameFormat = _ref2$webpackChunknam === undefined ? '([0-9a-zA-Z-_/.]|\\[(request|index)\\])+' : _ref2$webpackChunknam;

      var paddedCommentRegex = /^ (\S[\s\S]+\S) $/;
      var commentStyleRegex = /^( ((webpackChunkName: .+)|((webpackPrefetch|webpackPreload): (true|false|-?[0-9]+))|(webpackIgnore: (true|false))|((webpackInclude|webpackExclude): \/.*\/)|(webpackMode: ["'](lazy|lazy-once|eager|weak)["'])|(webpackExports: (['"]\w+['"]|\[(['"]\w+['"], *)+(['"]\w+['"]*)\]))),?)+ $/;
      var chunkSubstrFormat = ' webpackChunkName: ["\']' + String(webpackChunknameFormat) + '["\'],? ';
      var chunkSubstrRegex = new RegExp(chunkSubstrFormat);

      function run(node, arg) {
        var sourceCode = context.getSourceCode();
        var leadingComments = sourceCode.getCommentsBefore ?
        sourceCode.getCommentsBefore(arg) // This method is available in ESLint >= 4.
        : sourceCode.getComments(arg).leading; // This method is deprecated in ESLint 7.

        if (!leadingComments || leadingComments.length === 0) {
          context.report({
            node: node,
            message: 'dynamic imports require a leading comment with the webpack chunkname' });

          return;
        }

        var isChunknamePresent = false;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

          for (var _iterator = leadingComments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var comment = _step.value;
            if (comment.type !== 'Block') {
              context.report({
                node: node,
                message: 'dynamic imports require a /* foo */ style comment, not a // foo comment' });

              return;
            }

            if (!paddedCommentRegex.test(comment.value)) {
              context.report({
                node: node,
                message: 'dynamic imports require a block comment padded with spaces - /* foo */' });

              return;
            }

            try {
              // just like webpack itself does
              _vm2['default'].runInNewContext('(function() {return {' + String(comment.value) + '}})()');
            }
            catch (error) {
              context.report({
                node: node,
                message: 'dynamic imports require a "webpack" comment with valid syntax' });

              return;
            }

            if (!commentStyleRegex.test(comment.value)) {
              context.report({
                node: node,
                message: 'dynamic imports require a "webpack" comment with valid syntax' });


              return;
            }

            if (chunkSubstrRegex.test(comment.value)) {
              isChunknamePresent = true;
            }
          }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

        if (!isChunknamePresent) {
          context.report({
            node: node,
            message: 'dynamic imports require a leading comment in the form /*' +
            chunkSubstrFormat + '*/' });

        }
      }

      return {
        ImportExpression: function () {function ImportExpression(node) {
            run(node, node.source);
          }return ImportExpression;}(),

        CallExpression: function () {function CallExpression(node) {
            if (node.callee.type !== 'Import' && importFunctions.indexOf(node.callee.name) < 0) {
              return;
            }

            run(node, node.arguments[0]);
          }return CallExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9keW5hbWljLWltcG9ydC1jaHVua25hbWUuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiaW1wb3J0RnVuY3Rpb25zIiwidW5pcXVlSXRlbXMiLCJpdGVtcyIsIndlYnBhY2tDaHVua25hbWVGb3JtYXQiLCJjcmVhdGUiLCJjb250ZXh0IiwiY29uZmlnIiwib3B0aW9ucyIsInBhZGRlZENvbW1lbnRSZWdleCIsImNvbW1lbnRTdHlsZVJlZ2V4IiwiY2h1bmtTdWJzdHJGb3JtYXQiLCJjaHVua1N1YnN0clJlZ2V4IiwiUmVnRXhwIiwicnVuIiwibm9kZSIsImFyZyIsInNvdXJjZUNvZGUiLCJnZXRTb3VyY2VDb2RlIiwibGVhZGluZ0NvbW1lbnRzIiwiZ2V0Q29tbWVudHNCZWZvcmUiLCJnZXRDb21tZW50cyIsImxlYWRpbmciLCJsZW5ndGgiLCJyZXBvcnQiLCJtZXNzYWdlIiwiaXNDaHVua25hbWVQcmVzZW50IiwiY29tbWVudCIsInRlc3QiLCJ2YWx1ZSIsInZtIiwicnVuSW5OZXdDb250ZXh0IiwiZXJyb3IiLCJJbXBvcnRFeHByZXNzaW9uIiwic291cmNlIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJpbmRleE9mIiwibmFtZSIsImFyZ3VtZW50cyJdLCJtYXBwaW5ncyI6ImFBQUEsd0I7QUFDQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGFBRE47QUFFSkMsbUJBQWEsMEVBRlQ7QUFHSkMsV0FBSywwQkFBUSwwQkFBUixDQUhELEVBRkY7O0FBT0pDLFlBQVEsQ0FBQztBQUNQTCxZQUFNLFFBREM7QUFFUE0sa0JBQVk7QUFDVkMseUJBQWlCO0FBQ2ZQLGdCQUFNLE9BRFM7QUFF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QUFMLENBQVlFLElBQXBDLElBQTRDLENBQWpGLEVBQW9GO0FBQ2xGO0FBQ0Q7O0FBRUR4QixnQkFBSUMsSUFBSixFQUFVQSxLQUFLd0IsU0FBTCxDQUFlLENBQWYsQ0FBVjtBQUNELFdBWEksMkJBQVA7O0FBYUQsS0FwSGMsbUJBQWpCIiwiZmlsZSI6ImR5bmFtaWMtaW1wb3J0LWNodW5rbmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB2bSBmcm9tICd2bSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuZm9yY2UgYSBsZWFkaW5nIGNvbW1lbnQgd2l0aCB0aGUgd2VicGFja0NodW5rTmFtZSBmb3IgZHluYW1pYyBpbXBvcnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ2R5bmFtaWMtaW1wb3J0LWNodW5rbmFtZScpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbe1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGltcG9ydEZ1bmN0aW9uczoge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgdW5pcXVlSXRlbXM6IHRydWUsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHdlYnBhY2tDaHVua25hbWVGb3JtYXQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfV0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBjb25maWcgPSBjb250ZXh0Lm9wdGlvbnNbMF07XG4gICAgY29uc3QgeyBpbXBvcnRGdW5jdGlvbnMgPSBbXSB9ID0gY29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IHsgd2VicGFja0NodW5rbmFtZUZvcm1hdCA9ICcoWzAtOWEtekEtWi1fLy5dfFxcXFxbKHJlcXVlc3R8aW5kZXgpXFxcXF0pKycgfSA9IGNvbmZpZyB8fCB7fTtcblxuICAgIGNvbnN0IHBhZGRlZENvbW1lbnRSZWdleCA9IC9eIChcXFNbXFxzXFxTXStcXFMpICQvO1xuICAgIGNvbnN0IGNvbW1lbnRTdHlsZVJlZ2V4ID0gL14oICgod2VicGFja0NodW5rTmFtZTogLispfCgod2VicGFja1ByZWZldGNofHdlYnBhY2tQcmVsb2FkKTogKHRydWV8ZmFsc2V8LT9bMC05XSspKXwod2VicGFja0lnbm9yZTogKHRydWV8ZmFsc2UpKXwoKHdlYnBhY2tJbmNsdWRlfHdlYnBhY2tFeGNsdWRlKTogXFwvLipcXC8pfCh3ZWJwYWNrTW9kZTogW1wiJ10obGF6eXxsYXp5LW9uY2V8ZWFnZXJ8d2VhaylbXCInXSl8KHdlYnBhY2tFeHBvcnRzOiAoWydcIl1cXHcrWydcIl18XFxbKFsnXCJdXFx3K1snXCJdLCAqKSsoWydcIl1cXHcrWydcIl0qKVxcXSkpKSw/KSsgJC87XG4gICAgY29uc3QgY2h1bmtTdWJzdHJGb3JtYXQgPSBgIHdlYnBhY2tDaHVua05hbWU6IFtcIiddJHt3ZWJwYWNrQ2h1bmtuYW1lRm9ybWF0fVtcIiddLD8gYDtcbiAgICBjb25zdCBjaHVua1N1YnN0clJlZ2V4ID0gbmV3IFJlZ0V4cChjaHVua1N1YnN0ckZvcm1hdCk7XG5cbiAgICBmdW5jdGlvbiBydW4obm9kZSwgYXJnKSB7XG4gICAgICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG4gICAgICBjb25zdCBsZWFkaW5nQ29tbWVudHMgPSBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlXG4gICAgICAgID8gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZShhcmcpIC8vIFRoaXMgbWV0aG9kIGlzIGF2YWlsYWJsZSBpbiBFU0xpbnQgPj0gNC5cbiAgICAgICAgOiBzb3VyY2VDb2RlLmdldENvbW1lbnRzKGFyZykubGVhZGluZzsgLy8gVGhpcyBtZXRob2QgaXMgZGVwcmVjYXRlZCBpbiBFU0xpbnQgNy5cblxuICAgICAgaWYgKCFsZWFkaW5nQ29tbWVudHMgfHwgbGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBsZWFkaW5nIGNvbW1lbnQgd2l0aCB0aGUgd2VicGFjayBjaHVua25hbWUnLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgaXNDaHVua25hbWVQcmVzZW50ID0gZmFsc2U7XG5cbiAgICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBsZWFkaW5nQ29tbWVudHMpIHtcbiAgICAgICAgaWYgKGNvbW1lbnQudHlwZSAhPT0gJ0Jsb2NrJykge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSAvKiBmb28gKi8gc3R5bGUgY29tbWVudCwgbm90IGEgLy8gZm9vIGNvbW1lbnQnLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcGFkZGVkQ29tbWVudFJlZ2V4LnRlc3QoY29tbWVudC52YWx1ZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogYGR5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgYmxvY2sgY29tbWVudCBwYWRkZWQgd2l0aCBzcGFjZXMgLSAvKiBmb28gKi9gLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8ganVzdCBsaWtlIHdlYnBhY2sgaXRzZWxmIGRvZXNcbiAgICAgICAgICB2bS5ydW5Jbk5ld0NvbnRleHQoYChmdW5jdGlvbigpIHtyZXR1cm4geyR7Y29tbWVudC52YWx1ZX19fSkoKWApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBgZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBcIndlYnBhY2tcIiBjb21tZW50IHdpdGggdmFsaWQgc3ludGF4YCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbW1lbnRTdHlsZVJlZ2V4LnRlc3QoY29tbWVudC52YWx1ZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAgICAgYGR5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgXCJ3ZWJwYWNrXCIgY29tbWVudCB3aXRoIHZhbGlkIHN5bnRheGAsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNodW5rU3Vic3RyUmVnZXgudGVzdChjb21tZW50LnZhbHVlKSkge1xuICAgICAgICAgIGlzQ2h1bmtuYW1lUHJlc2VudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0NodW5rbmFtZVByZXNlbnQpIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAgIGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIGxlYWRpbmcgY29tbWVudCBpbiB0aGUgZm9ybSAvKiR7Y2h1bmtTdWJzdHJGb3JtYXR9Ki9gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIHJ1bihub2RlLCBub2RlLnNvdXJjZSk7XG4gICAgICB9LFxuXG4gICAgICBDYWxsRXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmNhbGxlZS50eXBlICE9PSAnSW1wb3J0JyAmJiBpbXBvcnRGdW5jdGlvbnMuaW5kZXhPZihub2RlLmNhbGxlZS5uYW1lKSA8IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBydW4obm9kZSwgbm9kZS5hcmd1bWVudHNbMF0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==