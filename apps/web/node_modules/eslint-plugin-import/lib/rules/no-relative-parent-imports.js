'use strict';var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _path = require('path');
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);

var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid importing modules from parent directories.',
      url: (0, _docsUrl2['default'])('no-relative-parent-imports') },

    schema: [(0, _moduleVisitor.makeOptionsSchema)()] },


  create: function () {function noRelativePackages(context) {
      var myPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      if (myPath === '<text>') return {}; // can't check a non-file

      function checkSourceValue(sourceNode) {
        var depPath = sourceNode.value;

        if ((0, _importType2['default'])(depPath, context) === 'external') {// ignore packages
          return;
        }

        var absDepPath = (0, _resolve2['default'])(depPath, context);

        if (!absDepPath) {// unable to resolve path
          return;
        }

        var relDepPath = (0, _path.relative)((0, _path.dirname)(myPath), absDepPath);

        if ((0, _importType2['default'])(relDepPath, context) === 'parent') {
          context.report({
            node: sourceNode,
            message: 'Relative imports from parent directories are not allowed. ' + 'Please either pass what you\'re importing through at runtime ' + ('(dependency injection), move `' + String(

            (0, _path.basename)(myPath)) + '` to same ') + ('directory as `' + String(
            depPath) + '` or consider making `' + String(depPath) + '` a package.') });

        }
      }

      return (0, _moduleVisitor2['default'])(checkSourceValue, context.options[0]);
    }return noRelativePackages;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1yZWxhdGl2ZS1wYXJlbnQtaW1wb3J0cy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsIm5vUmVsYXRpdmVQYWNrYWdlcyIsImNvbnRleHQiLCJteVBhdGgiLCJnZXRQaHlzaWNhbEZpbGVuYW1lIiwiZ2V0RmlsZW5hbWUiLCJjaGVja1NvdXJjZVZhbHVlIiwic291cmNlTm9kZSIsImRlcFBhdGgiLCJ2YWx1ZSIsImFic0RlcFBhdGgiLCJyZWxEZXBQYXRoIiwicmVwb3J0Iiwibm9kZSIsIm1lc3NhZ2UiLCJvcHRpb25zIl0sIm1hcHBpbmdzIjoiYUFBQSxrRTtBQUNBLHFDO0FBQ0E7QUFDQSxzRDs7QUFFQSxnRDs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGlCQUROO0FBRUpDLG1CQUFhLG1EQUZUO0FBR0pDLFdBQUssMEJBQVEsNEJBQVIsQ0FIRCxFQUZGOztBQU9KQyxZQUFRLENBQUMsdUNBQUQsQ0FQSixFQURTOzs7QUFXZkMsdUJBQVEsU0FBU0Msa0JBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDO0FBQzNDLFVBQU1DLFNBQVNELFFBQVFFLG1CQUFSLEdBQThCRixRQUFRRSxtQkFBUixFQUE5QixHQUE4REYsUUFBUUcsV0FBUixFQUE3RTtBQUNBLFVBQUlGLFdBQVcsUUFBZixFQUF5QixPQUFPLEVBQVAsQ0FGa0IsQ0FFUDs7QUFFcEMsZUFBU0csZ0JBQVQsQ0FBMEJDLFVBQTFCLEVBQXNDO0FBQ3BDLFlBQU1DLFVBQVVELFdBQVdFLEtBQTNCOztBQUVBLFlBQUksNkJBQVdELE9BQVgsRUFBb0JOLE9BQXBCLE1BQWlDLFVBQXJDLEVBQWlELENBQUU7QUFDakQ7QUFDRDs7QUFFRCxZQUFNUSxhQUFhLDBCQUFRRixPQUFSLEVBQWlCTixPQUFqQixDQUFuQjs7QUFFQSxZQUFJLENBQUNRLFVBQUwsRUFBaUIsQ0FBRTtBQUNqQjtBQUNEOztBQUVELFlBQU1DLGFBQWEsb0JBQVMsbUJBQVFSLE1BQVIsQ0FBVCxFQUEwQk8sVUFBMUIsQ0FBbkI7O0FBRUEsWUFBSSw2QkFBV0MsVUFBWCxFQUF1QlQsT0FBdkIsTUFBb0MsUUFBeEMsRUFBa0Q7QUFDaERBLGtCQUFRVSxNQUFSLENBQWU7QUFDYkMsa0JBQU1OLFVBRE87QUFFYk8scUJBQVM7O0FBRTJCLGdDQUFTWCxNQUFULENBRjNCO0FBR1dLLG1CQUhYLHNDQUc2Q0EsT0FIN0MsbUJBRkksRUFBZjs7QUFPRDtBQUNGOztBQUVELGFBQU8sZ0NBQWNGLGdCQUFkLEVBQWdDSixRQUFRYSxPQUFSLENBQWdCLENBQWhCLENBQWhDLENBQVA7QUFDRCxLQS9CRCxPQUFpQmQsa0JBQWpCLElBWGUsRUFBakIiLCJmaWxlIjoibm8tcmVsYXRpdmUtcGFyZW50LWltcG9ydHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9kdWxlVmlzaXRvciwgeyBtYWtlT3B0aW9uc1NjaGVtYSB9IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvbW9kdWxlVmlzaXRvcic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcblxuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdGF0aWMgYW5hbHlzaXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgaW1wb3J0aW5nIG1vZHVsZXMgZnJvbSBwYXJlbnQgZGlyZWN0b3JpZXMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tcmVsYXRpdmUtcGFyZW50LWltcG9ydHMnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW21ha2VPcHRpb25zU2NoZW1hKCldLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbm9SZWxhdGl2ZVBhY2thZ2VzKGNvbnRleHQpIHtcbiAgICBjb25zdCBteVBhdGggPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcbiAgICBpZiAobXlQYXRoID09PSAnPHRleHQ+JykgcmV0dXJuIHt9OyAvLyBjYW4ndCBjaGVjayBhIG5vbi1maWxlXG5cbiAgICBmdW5jdGlvbiBjaGVja1NvdXJjZVZhbHVlKHNvdXJjZU5vZGUpIHtcbiAgICAgIGNvbnN0IGRlcFBhdGggPSBzb3VyY2VOb2RlLnZhbHVlO1xuXG4gICAgICBpZiAoaW1wb3J0VHlwZShkZXBQYXRoLCBjb250ZXh0KSA9PT0gJ2V4dGVybmFsJykgeyAvLyBpZ25vcmUgcGFja2FnZXNcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhYnNEZXBQYXRoID0gcmVzb2x2ZShkZXBQYXRoLCBjb250ZXh0KTtcblxuICAgICAgaWYgKCFhYnNEZXBQYXRoKSB7IC8vIHVuYWJsZSB0byByZXNvbHZlIHBhdGhcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWxEZXBQYXRoID0gcmVsYXRpdmUoZGlybmFtZShteVBhdGgpLCBhYnNEZXBQYXRoKTtcblxuICAgICAgaWYgKGltcG9ydFR5cGUocmVsRGVwUGF0aCwgY29udGV4dCkgPT09ICdwYXJlbnQnKSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlOiBzb3VyY2VOb2RlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdSZWxhdGl2ZSBpbXBvcnRzIGZyb20gcGFyZW50IGRpcmVjdG9yaWVzIGFyZSBub3QgYWxsb3dlZC4gJyArXG4gICAgICAgICAgICBgUGxlYXNlIGVpdGhlciBwYXNzIHdoYXQgeW91J3JlIGltcG9ydGluZyB0aHJvdWdoIGF0IHJ1bnRpbWUgYCArXG4gICAgICAgICAgICBgKGRlcGVuZGVuY3kgaW5qZWN0aW9uKSwgbW92ZSBcXGAke2Jhc2VuYW1lKG15UGF0aCl9XFxgIHRvIHNhbWUgYCArXG4gICAgICAgICAgICBgZGlyZWN0b3J5IGFzIFxcYCR7ZGVwUGF0aH1cXGAgb3IgY29uc2lkZXIgbWFraW5nIFxcYCR7ZGVwUGF0aH1cXGAgYSBwYWNrYWdlLmAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKGNoZWNrU291cmNlVmFsdWUsIGNvbnRleHQub3B0aW9uc1swXSk7XG4gIH0sXG59O1xuIl19