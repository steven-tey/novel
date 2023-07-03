'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Module systems',
      description: 'Forbid AMD `require` and `define` calls.',
      url: (0, _docsUrl2['default'])('no-amd') },

    schema: [] },


  create: function () {function create(context) {
      return {
        'CallExpression': function () {function CallExpression(node) {
            if (context.getScope().type !== 'module') return;

            if (node.callee.type !== 'Identifier') return;
            if (node.callee.name !== 'require' &&
            node.callee.name !== 'define') return;

            // todo: capture define((require, module, exports) => {}) form?
            if (node.arguments.length !== 2) return;

            var modules = node.arguments[0];
            if (modules.type !== 'ArrayExpression') return;

            // todo: check second arg type? (identifier or callback)

            context.report(node, 'Expected imports instead of AMD ' + String(node.callee.name) + '().');
          }return CallExpression;}() };


    }return create;}() }; /**
                           * @fileoverview Rule to prefer imports to AMD
                           * @author Jamund Ferguson
                           */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hbWQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0Iiwibm9kZSIsImdldFNjb3BlIiwiY2FsbGVlIiwibmFtZSIsImFyZ3VtZW50cyIsImxlbmd0aCIsIm1vZHVsZXMiLCJyZXBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0EscUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsZ0JBRE47QUFFSkMsbUJBQWEsMENBRlQ7QUFHSkMsV0FBSywwQkFBUSxRQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUSxFQVBKLEVBRFM7OztBQVdmQyxRQVhlLCtCQVdSQyxPQVhRLEVBV0M7QUFDZCxhQUFPO0FBQ0wsdUNBQWtCLHdCQUFVQyxJQUFWLEVBQWdCO0FBQ2hDLGdCQUFJRCxRQUFRRSxRQUFSLEdBQW1CVCxJQUFuQixLQUE0QixRQUFoQyxFQUEwQzs7QUFFMUMsZ0JBQUlRLEtBQUtFLE1BQUwsQ0FBWVYsSUFBWixLQUFxQixZQUF6QixFQUF1QztBQUN2QyxnQkFBSVEsS0FBS0UsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFNBQXJCO0FBQ0FILGlCQUFLRSxNQUFMLENBQVlDLElBQVosS0FBcUIsUUFEekIsRUFDbUM7O0FBRW5DO0FBQ0EsZ0JBQUlILEtBQUtJLFNBQUwsQ0FBZUMsTUFBZixLQUEwQixDQUE5QixFQUFpQzs7QUFFakMsZ0JBQU1DLFVBQVVOLEtBQUtJLFNBQUwsQ0FBZSxDQUFmLENBQWhCO0FBQ0EsZ0JBQUlFLFFBQVFkLElBQVIsS0FBaUIsaUJBQXJCLEVBQXdDOztBQUV4Qzs7QUFFQU8sb0JBQVFRLE1BQVIsQ0FBZVAsSUFBZiw4Q0FBd0RBLEtBQUtFLE1BQUwsQ0FBWUMsSUFBcEU7QUFDRCxXQWhCRCx5QkFESyxFQUFQOzs7QUFvQkQsS0FoQ2MsbUJBQWpCLEMsQ0FYQSIsImZpbGUiOiJuby1hbWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBwcmVmZXIgaW1wb3J0cyB0byBBTURcbiAqIEBhdXRob3IgSmFtdW5kIEZlcmd1c29uXG4gKi9cblxuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSdWxlIERlZmluaXRpb25cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnTW9kdWxlIHN5c3RlbXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgQU1EIGByZXF1aXJlYCBhbmQgYGRlZmluZWAgY2FsbHMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tYW1kJyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdDYWxsRXhwcmVzc2lvbic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmIChjb250ZXh0LmdldFNjb3BlKCkudHlwZSAhPT0gJ21vZHVsZScpIHJldHVybjtcblxuICAgICAgICBpZiAobm9kZS5jYWxsZWUudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmIChub2RlLmNhbGxlZS5uYW1lICE9PSAncmVxdWlyZScgJiZcbiAgICAgICAgICAgIG5vZGUuY2FsbGVlLm5hbWUgIT09ICdkZWZpbmUnKSByZXR1cm47XG5cbiAgICAgICAgLy8gdG9kbzogY2FwdHVyZSBkZWZpbmUoKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykgPT4ge30pIGZvcm0/XG4gICAgICAgIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHJldHVybjtcblxuICAgICAgICBjb25zdCBtb2R1bGVzID0gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgIGlmIChtb2R1bGVzLnR5cGUgIT09ICdBcnJheUV4cHJlc3Npb24nKSByZXR1cm47XG5cbiAgICAgICAgLy8gdG9kbzogY2hlY2sgc2Vjb25kIGFyZyB0eXBlPyAoaWRlbnRpZmllciBvciBjYWxsYmFjaylcblxuICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgRXhwZWN0ZWQgaW1wb3J0cyBpbnN0ZWFkIG9mIEFNRCAke25vZGUuY2FsbGVlLm5hbWV9KCkuYCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgfSxcbn07XG4iXX0=