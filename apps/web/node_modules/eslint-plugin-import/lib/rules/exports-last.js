'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isNonExportStatement(_ref) {var type = _ref.type;
  return type !== 'ExportDefaultDeclaration' &&
  type !== 'ExportNamedDeclaration' &&
  type !== 'ExportAllDeclaration';
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Ensure all exports appear after other statements.',
      url: (0, _docsUrl2['default'])('exports-last') },

    schema: [] },


  create: function () {function create(context) {
      return {
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            var lastNonExportStatementIndex = body.reduce(function () {function findLastIndex(acc, item, index) {
                if (isNonExportStatement(item)) {
                  return index;
                }
                return acc;
              }return findLastIndex;}(), -1);

            if (lastNonExportStatementIndex !== -1) {
              body.slice(0, lastNonExportStatementIndex).forEach(function () {function checkNonExport(node) {
                  if (!isNonExportStatement(node)) {
                    context.report({
                      node: node,
                      message: 'Export statements should appear at the end of the file' });

                  }
                }return checkNonExport;}());
            }
          }return Program;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHBvcnRzLWxhc3QuanMiXSwibmFtZXMiOlsiaXNOb25FeHBvcnRTdGF0ZW1lbnQiLCJ0eXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJQcm9ncmFtIiwiYm9keSIsImxhc3ROb25FeHBvcnRTdGF0ZW1lbnRJbmRleCIsInJlZHVjZSIsImZpbmRMYXN0SW5kZXgiLCJhY2MiLCJpdGVtIiwiaW5kZXgiLCJzbGljZSIsImZvckVhY2giLCJjaGVja05vbkV4cG9ydCIsIm5vZGUiLCJyZXBvcnQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiYUFBQSxxQzs7QUFFQSxTQUFTQSxvQkFBVCxPQUF3QyxLQUFSQyxJQUFRLFFBQVJBLElBQVE7QUFDdEMsU0FBT0EsU0FBUywwQkFBVDtBQUNMQSxXQUFTLHdCQURKO0FBRUxBLFdBQVMsc0JBRlg7QUFHRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pILFVBQU0sWUFERjtBQUVKSSxVQUFNO0FBQ0pDLGdCQUFVLGFBRE47QUFFSkMsbUJBQWEsbURBRlQ7QUFHSkMsV0FBSywwQkFBUSxjQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUSxFQVBKLEVBRFM7OztBQVdmQyxRQVhlLCtCQVdSQyxPQVhRLEVBV0M7QUFDZCxhQUFPO0FBQ0xDLGVBREssdUNBQ2EsS0FBUkMsSUFBUSxTQUFSQSxJQUFRO0FBQ2hCLGdCQUFNQyw4QkFBOEJELEtBQUtFLE1BQUwsY0FBWSxTQUFTQyxhQUFULENBQXVCQyxHQUF2QixFQUE0QkMsSUFBNUIsRUFBa0NDLEtBQWxDLEVBQXlDO0FBQ3ZGLG9CQUFJbkIscUJBQXFCa0IsSUFBckIsQ0FBSixFQUFnQztBQUM5Qix5QkFBT0MsS0FBUDtBQUNEO0FBQ0QsdUJBQU9GLEdBQVA7QUFDRCxlQUxtQyxPQUFxQkQsYUFBckIsTUFLakMsQ0FBQyxDQUxnQyxDQUFwQzs7QUFPQSxnQkFBSUYsZ0NBQWdDLENBQUMsQ0FBckMsRUFBd0M7QUFDdENELG1CQUFLTyxLQUFMLENBQVcsQ0FBWCxFQUFjTiwyQkFBZCxFQUEyQ08sT0FBM0MsY0FBbUQsU0FBU0MsY0FBVCxDQUF3QkMsSUFBeEIsRUFBOEI7QUFDL0Usc0JBQUksQ0FBQ3ZCLHFCQUFxQnVCLElBQXJCLENBQUwsRUFBaUM7QUFDL0JaLDRCQUFRYSxNQUFSLENBQWU7QUFDYkQsZ0NBRGE7QUFFYkUsK0JBQVMsd0RBRkksRUFBZjs7QUFJRDtBQUNGLGlCQVBELE9BQTRESCxjQUE1RDtBQVFEO0FBQ0YsV0FuQkksb0JBQVA7O0FBcUJELEtBakNjLG1CQUFqQiIsImZpbGUiOiJleHBvcnRzLWxhc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gaXNOb25FeHBvcnRTdGF0ZW1lbnQoeyB0eXBlIH0pIHtcbiAgcmV0dXJuIHR5cGUgIT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nICYmXG4gICAgdHlwZSAhPT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nICYmXG4gICAgdHlwZSAhPT0gJ0V4cG9ydEFsbERlY2xhcmF0aW9uJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Vuc3VyZSBhbGwgZXhwb3J0cyBhcHBlYXIgYWZ0ZXIgb3RoZXIgc3RhdGVtZW50cy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdleHBvcnRzLWxhc3QnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgUHJvZ3JhbSh7IGJvZHkgfSkge1xuICAgICAgICBjb25zdCBsYXN0Tm9uRXhwb3J0U3RhdGVtZW50SW5kZXggPSBib2R5LnJlZHVjZShmdW5jdGlvbiBmaW5kTGFzdEluZGV4KGFjYywgaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICBpZiAoaXNOb25FeHBvcnRTdGF0ZW1lbnQoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgIGlmIChsYXN0Tm9uRXhwb3J0U3RhdGVtZW50SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgYm9keS5zbGljZSgwLCBsYXN0Tm9uRXhwb3J0U3RhdGVtZW50SW5kZXgpLmZvckVhY2goZnVuY3Rpb24gY2hlY2tOb25FeHBvcnQobm9kZSkge1xuICAgICAgICAgICAgaWYgKCFpc05vbkV4cG9ydFN0YXRlbWVudChub2RlKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnRXhwb3J0IHN0YXRlbWVudHMgc2hvdWxkIGFwcGVhciBhdCB0aGUgZW5kIG9mIHRoZSBmaWxlJyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=