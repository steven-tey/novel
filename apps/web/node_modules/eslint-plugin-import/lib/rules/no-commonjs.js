'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var EXPORT_MESSAGE = 'Expected "export" or "export default"'; /**
                                                               * @fileoverview Rule to prefer ES6 to CJS
                                                               * @author Jamund Ferguson
                                                               */var IMPORT_MESSAGE = 'Expected "import" instead of "require()"';function normalizeLegacyOptions(options) {
  if (options.indexOf('allow-primitive-modules') >= 0) {
    return { allowPrimitiveModules: true };
  }
  return options[0] || {};
}

function allowPrimitive(node, options) {
  if (!options.allowPrimitiveModules) return false;
  if (node.parent.type !== 'AssignmentExpression') return false;
  return node.parent.right.type !== 'ObjectExpression';
}

function allowRequire(node, options) {
  return options.allowRequire;
}

function allowConditionalRequire(node, options) {
  return options.allowConditionalRequire !== false;
}

function validateScope(scope) {
  return scope.variableScope.type === 'module';
}

// https://github.com/estree/estree/blob/HEAD/es5.md
function isConditional(node) {
  if (
  node.type === 'IfStatement' ||
  node.type === 'TryStatement' ||
  node.type === 'LogicalExpression' ||
  node.type === 'ConditionalExpression')
  return true;
  if (node.parent) return isConditional(node.parent);
  return false;
}

function isLiteralString(node) {
  return node.type === 'Literal' && typeof node.value === 'string' ||
  node.type === 'TemplateLiteral' && node.expressions.length === 0;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var schemaString = { 'enum': ['allow-primitive-modules'] };
var schemaObject = {
  type: 'object',
  properties: {
    allowPrimitiveModules: { 'type': 'boolean' },
    allowRequire: { 'type': 'boolean' },
    allowConditionalRequire: { 'type': 'boolean' } },

  additionalProperties: false };


module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Module systems',
      description: 'Forbid CommonJS `require` calls and `module.exports` or `exports.*`.',
      url: (0, _docsUrl2['default'])('no-commonjs') },


    schema: {
      anyOf: [
      {
        type: 'array',
        items: [schemaString],
        additionalItems: false },

      {
        type: 'array',
        items: [schemaObject],
        additionalItems: false }] } },





  create: function () {function create(context) {
      var options = normalizeLegacyOptions(context.options);

      return {

        'MemberExpression': function () {function MemberExpression(node) {

            // module.exports
            if (node.object.name === 'module' && node.property.name === 'exports') {
              if (allowPrimitive(node, options)) return;
              context.report({ node: node, message: EXPORT_MESSAGE });
            }

            // exports.
            if (node.object.name === 'exports') {
              var isInScope = context.getScope().
              variables.
              some(function (variable) {return variable.name === 'exports';});
              if (!isInScope) {
                context.report({ node: node, message: EXPORT_MESSAGE });
              }
            }

          }return MemberExpression;}(),
        'CallExpression': function () {function CallExpression(call) {
            if (!validateScope(context.getScope())) return;

            if (call.callee.type !== 'Identifier') return;
            if (call.callee.name !== 'require') return;

            if (call.arguments.length !== 1) return;
            if (!isLiteralString(call.arguments[0])) return;

            if (allowRequire(call, options)) return;

            if (allowConditionalRequire(call, options) && isConditional(call.parent)) return;

            // keeping it simple: all 1-string-arg `require` calls are reported
            context.report({
              node: call.callee,
              message: IMPORT_MESSAGE });

          }return CallExpression;}() };


    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1jb21tb25qcy5qcyJdLCJuYW1lcyI6WyJFWFBPUlRfTUVTU0FHRSIsIklNUE9SVF9NRVNTQUdFIiwibm9ybWFsaXplTGVnYWN5T3B0aW9ucyIsIm9wdGlvbnMiLCJpbmRleE9mIiwiYWxsb3dQcmltaXRpdmVNb2R1bGVzIiwiYWxsb3dQcmltaXRpdmUiLCJub2RlIiwicGFyZW50IiwidHlwZSIsInJpZ2h0IiwiYWxsb3dSZXF1aXJlIiwiYWxsb3dDb25kaXRpb25hbFJlcXVpcmUiLCJ2YWxpZGF0ZVNjb3BlIiwic2NvcGUiLCJ2YXJpYWJsZVNjb3BlIiwiaXNDb25kaXRpb25hbCIsImlzTGl0ZXJhbFN0cmluZyIsInZhbHVlIiwiZXhwcmVzc2lvbnMiLCJsZW5ndGgiLCJzY2hlbWFTdHJpbmciLCJzY2hlbWFPYmplY3QiLCJwcm9wZXJ0aWVzIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiYW55T2YiLCJpdGVtcyIsImFkZGl0aW9uYWxJdGVtcyIsImNyZWF0ZSIsImNvbnRleHQiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHkiLCJyZXBvcnQiLCJtZXNzYWdlIiwiaXNJblNjb3BlIiwiZ2V0U2NvcGUiLCJ2YXJpYWJsZXMiLCJzb21lIiwidmFyaWFibGUiLCJjYWxsIiwiY2FsbGVlIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHFDOztBQUVBLElBQU1BLGlCQUFpQix1Q0FBdkIsQyxDQVBBOzs7aUVBUUEsSUFBTUMsaUJBQWlCLDBDQUF2QixDQUVBLFNBQVNDLHNCQUFULENBQWdDQyxPQUFoQyxFQUF5QztBQUN2QyxNQUFJQSxRQUFRQyxPQUFSLENBQWdCLHlCQUFoQixLQUE4QyxDQUFsRCxFQUFxRDtBQUNuRCxXQUFPLEVBQUVDLHVCQUF1QixJQUF6QixFQUFQO0FBQ0Q7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QWpCIiwiZmlsZSI6Im5vLWNvbW1vbmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJ1bGUgdG8gcHJlZmVyIEVTNiB0byBDSlNcbiAqIEBhdXRob3IgSmFtdW5kIEZlcmd1c29uXG4gKi9cblxuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmNvbnN0IEVYUE9SVF9NRVNTQUdFID0gJ0V4cGVjdGVkIFwiZXhwb3J0XCIgb3IgXCJleHBvcnQgZGVmYXVsdFwiJztcbmNvbnN0IElNUE9SVF9NRVNTQUdFID0gJ0V4cGVjdGVkIFwiaW1wb3J0XCIgaW5zdGVhZCBvZiBcInJlcXVpcmUoKVwiJztcblxuZnVuY3Rpb24gbm9ybWFsaXplTGVnYWN5T3B0aW9ucyhvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmluZGV4T2YoJ2FsbG93LXByaW1pdGl2ZS1tb2R1bGVzJykgPj0gMCkge1xuICAgIHJldHVybiB7IGFsbG93UHJpbWl0aXZlTW9kdWxlczogdHJ1ZSB9O1xuICB9XG4gIHJldHVybiBvcHRpb25zWzBdIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBhbGxvd1ByaW1pdGl2ZShub2RlLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5hbGxvd1ByaW1pdGl2ZU1vZHVsZXMpIHJldHVybiBmYWxzZTtcbiAgaWYgKG5vZGUucGFyZW50LnR5cGUgIT09ICdBc3NpZ25tZW50RXhwcmVzc2lvbicpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIChub2RlLnBhcmVudC5yaWdodC50eXBlICE9PSAnT2JqZWN0RXhwcmVzc2lvbicpO1xufVxuXG5mdW5jdGlvbiBhbGxvd1JlcXVpcmUobm9kZSwgb3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5hbGxvd1JlcXVpcmU7XG59XG5cbmZ1bmN0aW9uIGFsbG93Q29uZGl0aW9uYWxSZXF1aXJlKG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuYWxsb3dDb25kaXRpb25hbFJlcXVpcmUgIT09IGZhbHNlO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVNjb3BlKHNjb3BlKSB7XG4gIHJldHVybiBzY29wZS52YXJpYWJsZVNjb3BlLnR5cGUgPT09ICdtb2R1bGUnO1xufVxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZXN0cmVlL2VzdHJlZS9ibG9iL0hFQUQvZXM1Lm1kXG5mdW5jdGlvbiBpc0NvbmRpdGlvbmFsKG5vZGUpIHtcbiAgaWYgKFxuICAgIG5vZGUudHlwZSA9PT0gJ0lmU3RhdGVtZW50J1xuICAgIHx8IG5vZGUudHlwZSA9PT0gJ1RyeVN0YXRlbWVudCdcbiAgICB8fCBub2RlLnR5cGUgPT09ICdMb2dpY2FsRXhwcmVzc2lvbidcbiAgICB8fCBub2RlLnR5cGUgPT09ICdDb25kaXRpb25hbEV4cHJlc3Npb24nXG4gICkgcmV0dXJuIHRydWU7XG4gIGlmIChub2RlLnBhcmVudCkgcmV0dXJuIGlzQ29uZGl0aW9uYWwobm9kZS5wYXJlbnQpO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzTGl0ZXJhbFN0cmluZyhub2RlKSB7XG4gIHJldHVybiAobm9kZS50eXBlID09PSAnTGl0ZXJhbCcgJiYgdHlwZW9mIG5vZGUudmFsdWUgPT09ICdzdHJpbmcnKSB8fFxuICAgIChub2RlLnR5cGUgPT09ICdUZW1wbGF0ZUxpdGVyYWwnICYmIG5vZGUuZXhwcmVzc2lvbnMubGVuZ3RoID09PSAwKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJ1bGUgRGVmaW5pdGlvblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3Qgc2NoZW1hU3RyaW5nID0geyBlbnVtOiBbJ2FsbG93LXByaW1pdGl2ZS1tb2R1bGVzJ10gfTtcbmNvbnN0IHNjaGVtYU9iamVjdCA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBhbGxvd1ByaW1pdGl2ZU1vZHVsZXM6IHsgJ3R5cGUnOiAnYm9vbGVhbicgfSxcbiAgICBhbGxvd1JlcXVpcmU6IHsgJ3R5cGUnOiAnYm9vbGVhbicgfSxcbiAgICBhbGxvd0NvbmRpdGlvbmFsUmVxdWlyZTogeyAndHlwZSc6ICdib29sZWFuJyB9LFxuICB9LFxuICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ01vZHVsZSBzeXN0ZW1zJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yYmlkIENvbW1vbkpTIGByZXF1aXJlYCBjYWxscyBhbmQgYG1vZHVsZS5leHBvcnRzYCBvciBgZXhwb3J0cy4qYC4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1jb21tb25qcycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IHtcbiAgICAgIGFueU9mOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiBbc2NoZW1hU3RyaW5nXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczogW3NjaGVtYU9iamVjdF0sXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBub3JtYWxpemVMZWdhY3lPcHRpb25zKGNvbnRleHQub3B0aW9ucyk7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAnTWVtYmVyRXhwcmVzc2lvbic6IGZ1bmN0aW9uIChub2RlKSB7XG5cbiAgICAgICAgLy8gbW9kdWxlLmV4cG9ydHNcbiAgICAgICAgaWYgKG5vZGUub2JqZWN0Lm5hbWUgPT09ICdtb2R1bGUnICYmIG5vZGUucHJvcGVydHkubmFtZSA9PT0gJ2V4cG9ydHMnKSB7XG4gICAgICAgICAgaWYgKGFsbG93UHJpbWl0aXZlKG5vZGUsIG9wdGlvbnMpKSByZXR1cm47XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBFWFBPUlRfTUVTU0FHRSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV4cG9ydHMuXG4gICAgICAgIGlmIChub2RlLm9iamVjdC5uYW1lID09PSAnZXhwb3J0cycpIHtcbiAgICAgICAgICBjb25zdCBpc0luU2NvcGUgPSBjb250ZXh0LmdldFNjb3BlKClcbiAgICAgICAgICAgIC52YXJpYWJsZXNcbiAgICAgICAgICAgIC5zb21lKHZhcmlhYmxlID0+IHZhcmlhYmxlLm5hbWUgPT09ICdleHBvcnRzJyk7XG4gICAgICAgICAgaWYgKCEgaXNJblNjb3BlKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IEVYUE9SVF9NRVNTQUdFIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9LFxuICAgICAgJ0NhbGxFeHByZXNzaW9uJzogZnVuY3Rpb24gKGNhbGwpIHtcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVNjb3BlKGNvbnRleHQuZ2V0U2NvcGUoKSkpIHJldHVybjtcblxuICAgICAgICBpZiAoY2FsbC5jYWxsZWUudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmIChjYWxsLmNhbGxlZS5uYW1lICE9PSAncmVxdWlyZScpIHJldHVybjtcblxuICAgICAgICBpZiAoY2FsbC5hcmd1bWVudHMubGVuZ3RoICE9PSAxKSByZXR1cm47XG4gICAgICAgIGlmICghaXNMaXRlcmFsU3RyaW5nKGNhbGwuYXJndW1lbnRzWzBdKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChhbGxvd1JlcXVpcmUoY2FsbCwgb3B0aW9ucykpIHJldHVybjtcblxuICAgICAgICBpZiAoYWxsb3dDb25kaXRpb25hbFJlcXVpcmUoY2FsbCwgb3B0aW9ucykgJiYgaXNDb25kaXRpb25hbChjYWxsLnBhcmVudCkpIHJldHVybjtcblxuICAgICAgICAvLyBrZWVwaW5nIGl0IHNpbXBsZTogYWxsIDEtc3RyaW5nLWFyZyBgcmVxdWlyZWAgY2FsbHMgYXJlIHJlcG9ydGVkXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlOiBjYWxsLmNhbGxlZSxcbiAgICAgICAgICBtZXNzYWdlOiBJTVBPUlRfTUVTU0FHRSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgfSxcbn07XG4iXX0=