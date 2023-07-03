'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function processBodyStatement(context, namespaces, declaration) {
  if (declaration.type !== 'ImportDeclaration') return;

  if (declaration.specifiers.length === 0) return;

  var imports = _ExportMap2['default'].get(declaration.source.value, context);
  if (imports == null) return null;

  if (imports.errors.length > 0) {
    imports.reportErrors(context, declaration);
    return;
  }

  declaration.specifiers.forEach(function (specifier) {
    switch (specifier.type) {
      case 'ImportNamespaceSpecifier':
        if (!imports.size) {
          context.report(
          specifier, 'No exported names found in module \'' + String(
          declaration.source.value) + '\'.');

        }
        namespaces.set(specifier.local.name, imports);
        break;
      case 'ImportDefaultSpecifier':
      case 'ImportSpecifier':{
          var meta = imports.get(
          // default to 'default' for default https://i.imgur.com/nj6qAWy.jpg
          specifier.imported ? specifier.imported.name || specifier.imported.value : 'default');

          if (!meta || !meta.namespace) {break;}
          namespaces.set(specifier.local.name, meta.namespace);
          break;
        }}

  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Ensure imported namespaces contain dereferenced properties as they are dereferenced.',
      url: (0, _docsUrl2['default'])('namespace') },


    schema: [
    {
      type: 'object',
      properties: {
        allowComputed: {
          description: 'If `false`, will report computed (and thus, un-lintable) references to namespace members.',
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function namespaceRule(context) {

      // read options
      var _ref =

      context.options[0] || {},_ref$allowComputed = _ref.allowComputed,allowComputed = _ref$allowComputed === undefined ? false : _ref$allowComputed;

      var namespaces = new Map();

      function makeMessage(last, namepath) {
        return '\'' + String(last.name) + '\' not found in ' + (namepath.length > 1 ? 'deeply ' : '') + 'imported namespace \'' + String(namepath.join('.')) + '\'.';
      }

      return {
        // pick up all imports at body entry time, to properly respect hoisting
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            body.forEach(function (x) {return processBodyStatement(context, namespaces, x);});
          }return Program;}(),

        // same as above, but does not add names to local map
        ExportNamespaceSpecifier: function () {function ExportNamespaceSpecifier(namespace) {
            var declaration = (0, _importDeclaration2['default'])(context);

            var imports = _ExportMap2['default'].get(declaration.source.value, context);
            if (imports == null) return null;

            if (imports.errors.length) {
              imports.reportErrors(context, declaration);
              return;
            }

            if (!imports.size) {
              context.report(
              namespace, 'No exported names found in module \'' + String(
              declaration.source.value) + '\'.');

            }
          }return ExportNamespaceSpecifier;}(),

        // todo: check for possible redefinition

        MemberExpression: function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') return;
            if (!namespaces.has(dereference.object.name)) return;
            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') return;

            if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
              context.report(
              dereference.parent, 'Assignment to member of namespace \'' + String(
              dereference.object.name) + '\'.');

            }

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] && dereference.type === 'MemberExpression') {
              if (dereference.computed) {
                if (!allowComputed) {
                  context.report(
                  dereference.property, 'Unable to validate computed reference to imported namespace \'' + String(
                  dereference.object.name) + '\'.');

                }
                return;
              }

              if (!namespace.has(dereference.property.name)) {
                context.report(
                dereference.property,
                makeMessage(dereference.property, namepath));

                break;
              }

              var exported = namespace.get(dereference.property.name);
              if (exported == null) return;

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = exported.namespace;
              dereference = dereference.parent;
            }
          }return MemberExpression;}(),

        VariableDeclarator: function () {function VariableDeclarator(_ref3) {var id = _ref3.id,init = _ref3.init;
            if (init == null) return;
            if (init.type !== 'Identifier') return;
            if (!namespaces.has(init.name)) return;

            // check for redefinition in intermediate scopes
            if ((0, _declaredScope2['default'])(context, init.name) !== 'module') return;

            // DFS traverse child namespaces
            function testKey(pattern, namespace) {var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [init.name];
              if (!(namespace instanceof _ExportMap2['default'])) return;

              if (pattern.type !== 'ObjectPattern') return;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

                for (var _iterator = pattern.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var property = _step.value;
                  if (
                  property.type === 'ExperimentalRestProperty' ||
                  property.type === 'RestElement' ||
                  !property.key)
                  {
                    continue;
                  }

                  if (property.key.type !== 'Identifier') {
                    context.report({
                      node: property,
                      message: 'Only destructure top-level names.' });

                    continue;
                  }

                  if (!namespace.has(property.key.name)) {
                    context.report({
                      node: property,
                      message: makeMessage(property.key, path) });

                    continue;
                  }

                  path.push(property.key.name);
                  var dependencyExportMap = namespace.get(property.key.name);
                  // could be null when ignored or ambiguous
                  if (dependencyExportMap !== null) {
                    testKey(property.value, dependencyExportMap.namespace, path);
                  }
                  path.pop();
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }

            testKey(id, namespaces.get(init.name));
          }return VariableDeclarator;}(),

        JSXMemberExpression: function () {function JSXMemberExpression(_ref4) {var object = _ref4.object,property = _ref4.property;
            if (!namespaces.has(object.name)) return;
            var namespace = namespaces.get(object.name);
            if (!namespace.has(property.name)) {
              context.report({
                node: property,
                message: makeMessage(property, [object.name]) });

            }
          }return JSXMemberExpression;}() };

    }return namespaceRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsicHJvY2Vzc0JvZHlTdGF0ZW1lbnQiLCJjb250ZXh0IiwibmFtZXNwYWNlcyIsImRlY2xhcmF0aW9uIiwidHlwZSIsInNwZWNpZmllcnMiLCJsZW5ndGgiLCJpbXBvcnRzIiwiRXhwb3J0cyIsImdldCIsInNvdXJjZSIsInZhbHVlIiwiZXJyb3JzIiwicmVwb3J0RXJyb3JzIiwiZm9yRWFjaCIsInNwZWNpZmllciIsInNpemUiLCJyZXBvcnQiLCJzZXQiLCJsb2NhbCIsIm5hbWUiLCJtZXRhIiwiaW1wb3J0ZWQiLCJuYW1lc3BhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiYWxsb3dDb21wdXRlZCIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiY3JlYXRlIiwibmFtZXNwYWNlUnVsZSIsIm9wdGlvbnMiLCJNYXAiLCJtYWtlTWVzc2FnZSIsImxhc3QiLCJuYW1lcGF0aCIsImpvaW4iLCJQcm9ncmFtIiwiYm9keSIsIngiLCJFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJNZW1iZXJFeHByZXNzaW9uIiwiZGVyZWZlcmVuY2UiLCJvYmplY3QiLCJoYXMiLCJwYXJlbnQiLCJsZWZ0IiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsImV4cG9ydGVkIiwicHVzaCIsIlZhcmlhYmxlRGVjbGFyYXRvciIsImlkIiwiaW5pdCIsInRlc3RLZXkiLCJwYXR0ZXJuIiwicGF0aCIsImtleSIsIm5vZGUiLCJtZXNzYWdlIiwiZGVwZW5kZW5jeUV4cG9ydE1hcCIsInBvcCIsIkpTWE1lbWJlckV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiJhQUFBLGtFO0FBQ0EseUM7QUFDQSx5RDtBQUNBLHFDOztBQUVBLFNBQVNBLG9CQUFULENBQThCQyxPQUE5QixFQUF1Q0MsVUFBdkMsRUFBbURDLFdBQW5ELEVBQWdF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RFAsb0JBQVFGLEVBQVIsRUFBWXZELFdBQVdPLEdBQVgsQ0FBZWlELEtBQUt0QyxJQUFwQixDQUFaO0FBQ0QsV0EzSEk7O0FBNkhMK0MsMkJBN0hLLG1EQTZIcUMsS0FBcEJuQixNQUFvQixTQUFwQkEsTUFBb0IsQ0FBWkssUUFBWSxTQUFaQSxRQUFZO0FBQ3hDLGdCQUFJLENBQUNuRCxXQUFXK0MsR0FBWCxDQUFlRCxPQUFPNUIsSUFBdEIsQ0FBTCxFQUFrQztBQUNsQyxnQkFBTUcsWUFBWXJCLFdBQVdPLEdBQVgsQ0FBZXVDLE9BQU81QixJQUF0QixDQUFsQjtBQUNBLGdCQUFJLENBQUNHLFVBQVUwQixHQUFWLENBQWNJLFNBQVNqQyxJQUF2QixDQUFMLEVBQW1DO0FBQ2pDbkIsc0JBQVFnQixNQUFSLENBQWU7QUFDYjhDLHNCQUFNVixRQURPO0FBRWJXLHlCQUFTMUIsWUFBWWUsUUFBWixFQUFzQixDQUFDTCxPQUFPNUIsSUFBUixDQUF0QixDQUZJLEVBQWY7O0FBSUQ7QUFDRixXQXRJSSxnQ0FBUDs7QUF3SUQsS0FySkQsT0FBaUJlLGFBQWpCLElBeEJlLEVBQWpCIiwiZmlsZSI6Im5hbWVzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWNsYXJlZFNjb3BlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvZGVjbGFyZWRTY29wZSc7XG5pbXBvcnQgRXhwb3J0cyBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IGltcG9ydERlY2xhcmF0aW9uIGZyb20gJy4uL2ltcG9ydERlY2xhcmF0aW9uJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5mdW5jdGlvbiBwcm9jZXNzQm9keVN0YXRlbWVudChjb250ZXh0LCBuYW1lc3BhY2VzLCBkZWNsYXJhdGlvbikge1xuICBpZiAoZGVjbGFyYXRpb24udHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykgcmV0dXJuO1xuXG4gIGlmIChkZWNsYXJhdGlvbi5zcGVjaWZpZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gIGNvbnN0IGltcG9ydHMgPSBFeHBvcnRzLmdldChkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBpZiAoaW1wb3J0cy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBkZWNsYXJhdGlvbi5zcGVjaWZpZXJzLmZvckVhY2goKHNwZWNpZmllcikgPT4ge1xuICAgIHN3aXRjaCAoc3BlY2lmaWVyLnR5cGUpIHtcbiAgICBjYXNlICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgaWYgKCFpbXBvcnRzLnNpemUpIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgIGBObyBleHBvcnRlZCBuYW1lcyBmb3VuZCBpbiBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfScuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIG5hbWVzcGFjZXMuc2V0KHNwZWNpZmllci5sb2NhbC5uYW1lLCBpbXBvcnRzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInOlxuICAgIGNhc2UgJ0ltcG9ydFNwZWNpZmllcic6IHtcbiAgICAgIGNvbnN0IG1ldGEgPSBpbXBvcnRzLmdldChcbiAgICAgICAgLy8gZGVmYXVsdCB0byAnZGVmYXVsdCcgZm9yIGRlZmF1bHQgaHR0cHM6Ly9pLmltZ3VyLmNvbS9uajZxQVd5LmpwZ1xuICAgICAgICBzcGVjaWZpZXIuaW1wb3J0ZWQgPyAoc3BlY2lmaWVyLmltcG9ydGVkLm5hbWUgfHwgc3BlY2lmaWVyLmltcG9ydGVkLnZhbHVlKSA6ICdkZWZhdWx0JyxcbiAgICAgICk7XG4gICAgICBpZiAoIW1ldGEgfHwgIW1ldGEubmFtZXNwYWNlKSB7IGJyZWFrOyB9XG4gICAgICBuYW1lc3BhY2VzLnNldChzcGVjaWZpZXIubG9jYWwubmFtZSwgbWV0YS5uYW1lc3BhY2UpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5zdXJlIGltcG9ydGVkIG5hbWVzcGFjZXMgY29udGFpbiBkZXJlZmVyZW5jZWQgcHJvcGVydGllcyBhcyB0aGV5IGFyZSBkZXJlZmVyZW5jZWQuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbmFtZXNwYWNlJyksXG4gICAgfSxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGFsbG93Q29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgY29tcHV0ZWQgKGFuZCB0aHVzLCB1bi1saW50YWJsZSkgcmVmZXJlbmNlcyB0byBuYW1lc3BhY2UgbWVtYmVycy4nLFxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbmFtZXNwYWNlUnVsZShjb250ZXh0KSB7XG5cbiAgICAvLyByZWFkIG9wdGlvbnNcbiAgICBjb25zdCB7XG4gICAgICBhbGxvd0NvbXB1dGVkID0gZmFsc2UsXG4gICAgfSA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBtYWtlTWVzc2FnZShsYXN0LCBuYW1lcGF0aCkge1xuICAgICAgcmV0dXJuIGAnJHtsYXN0Lm5hbWV9JyBub3QgZm91bmQgaW4gJHtuYW1lcGF0aC5sZW5ndGggPiAxID8gJ2RlZXBseSAnIDogJyd9aW1wb3J0ZWQgbmFtZXNwYWNlICcke25hbWVwYXRoLmpvaW4oJy4nKX0nLmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHBpY2sgdXAgYWxsIGltcG9ydHMgYXQgYm9keSBlbnRyeSB0aW1lLCB0byBwcm9wZXJseSByZXNwZWN0IGhvaXN0aW5nXG4gICAgICBQcm9ncmFtKHsgYm9keSB9KSB7XG4gICAgICAgIGJvZHkuZm9yRWFjaCh4ID0+IHByb2Nlc3NCb2R5U3RhdGVtZW50KGNvbnRleHQsIG5hbWVzcGFjZXMsIHgpKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIHNhbWUgYXMgYWJvdmUsIGJ1dCBkb2VzIG5vdCBhZGQgbmFtZXMgdG8gbG9jYWwgbWFwXG4gICAgICBFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXIobmFtZXNwYWNlKSB7XG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gaW1wb3J0RGVjbGFyYXRpb24oY29udGV4dCk7XG5cbiAgICAgICAgY29uc3QgaW1wb3J0cyA9IEV4cG9ydHMuZ2V0KGRlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICAgIGlmIChpbXBvcnRzID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBkZWNsYXJhdGlvbik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbXBvcnRzLnNpemUpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIG5hbWVzcGFjZSxcbiAgICAgICAgICAgIGBObyBleHBvcnRlZCBuYW1lcyBmb3VuZCBpbiBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfScuYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyB0b2RvOiBjaGVjayBmb3IgcG9zc2libGUgcmVkZWZpbml0aW9uXG5cbiAgICAgIE1lbWJlckV4cHJlc3Npb24oZGVyZWZlcmVuY2UpIHtcbiAgICAgICAgaWYgKGRlcmVmZXJlbmNlLm9iamVjdC50eXBlICE9PSAnSWRlbnRpZmllcicpIHJldHVybjtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkpIHJldHVybjtcbiAgICAgICAgaWYgKGRlY2xhcmVkU2NvcGUoY29udGV4dCwgZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpICE9PSAnbW9kdWxlJykgcmV0dXJuO1xuXG4gICAgICAgIGlmIChkZXJlZmVyZW5jZS5wYXJlbnQudHlwZSA9PT0gJ0Fzc2lnbm1lbnRFeHByZXNzaW9uJyAmJiBkZXJlZmVyZW5jZS5wYXJlbnQubGVmdCA9PT0gZGVyZWZlcmVuY2UpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIGRlcmVmZXJlbmNlLnBhcmVudCxcbiAgICAgICAgICAgIGBBc3NpZ25tZW50IHRvIG1lbWJlciBvZiBuYW1lc3BhY2UgJyR7ZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWV9Jy5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnbyBkZWVwXG4gICAgICAgIGxldCBuYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmdldChkZXJlZmVyZW5jZS5vYmplY3QubmFtZSk7XG4gICAgICAgIGNvbnN0IG5hbWVwYXRoID0gW2RlcmVmZXJlbmNlLm9iamVjdC5uYW1lXTtcbiAgICAgICAgLy8gd2hpbGUgcHJvcGVydHkgaXMgbmFtZXNwYWNlIGFuZCBwYXJlbnQgaXMgbWVtYmVyIGV4cHJlc3Npb24sIGtlZXAgdmFsaWRhdGluZ1xuICAgICAgICB3aGlsZSAobmFtZXNwYWNlIGluc3RhbmNlb2YgRXhwb3J0cyAmJiBkZXJlZmVyZW5jZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICBpZiAoZGVyZWZlcmVuY2UuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIGlmICghYWxsb3dDb21wdXRlZCkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgICAgICBkZXJlZmVyZW5jZS5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBgVW5hYmxlIHRvIHZhbGlkYXRlIGNvbXB1dGVkIHJlZmVyZW5jZSB0byBpbXBvcnRlZCBuYW1lc3BhY2UgJyR7ZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWV9Jy5gLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICAgIGRlcmVmZXJlbmNlLnByb3BlcnR5LFxuICAgICAgICAgICAgICBtYWtlTWVzc2FnZShkZXJlZmVyZW5jZS5wcm9wZXJ0eSwgbmFtZXBhdGgpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGV4cG9ydGVkID0gbmFtZXNwYWNlLmdldChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICBpZiAoZXhwb3J0ZWQgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gc3Rhc2ggYW5kIHBvcFxuICAgICAgICAgIG5hbWVwYXRoLnB1c2goZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgbmFtZXNwYWNlID0gZXhwb3J0ZWQubmFtZXNwYWNlO1xuICAgICAgICAgIGRlcmVmZXJlbmNlID0gZGVyZWZlcmVuY2UucGFyZW50O1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBWYXJpYWJsZURlY2xhcmF0b3IoeyBpZCwgaW5pdCB9KSB7XG4gICAgICAgIGlmIChpbml0ID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYgKGluaXQudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMoaW5pdC5uYW1lKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciByZWRlZmluaXRpb24gaW4gaW50ZXJtZWRpYXRlIHNjb3Blc1xuICAgICAgICBpZiAoZGVjbGFyZWRTY29wZShjb250ZXh0LCBpbml0Lm5hbWUpICE9PSAnbW9kdWxlJykgcmV0dXJuO1xuXG4gICAgICAgIC8vIERGUyB0cmF2ZXJzZSBjaGlsZCBuYW1lc3BhY2VzXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RLZXkocGF0dGVybiwgbmFtZXNwYWNlLCBwYXRoID0gW2luaXQubmFtZV0pIHtcbiAgICAgICAgICBpZiAoIShuYW1lc3BhY2UgaW5zdGFuY2VvZiBFeHBvcnRzKSkgcmV0dXJuO1xuXG4gICAgICAgICAgaWYgKHBhdHRlcm4udHlwZSAhPT0gJ09iamVjdFBhdHRlcm4nKSByZXR1cm47XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHBhdHRlcm4ucHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBwcm9wZXJ0eS50eXBlID09PSAnRXhwZXJpbWVudGFsUmVzdFByb3BlcnR5J1xuICAgICAgICAgICAgICB8fCBwcm9wZXJ0eS50eXBlID09PSAnUmVzdEVsZW1lbnQnXG4gICAgICAgICAgICAgIHx8ICFwcm9wZXJ0eS5rZXlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmtleS50eXBlICE9PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdPbmx5IGRlc3RydWN0dXJlIHRvcC1sZXZlbCBuYW1lcy4nLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhwcm9wZXJ0eS5rZXkubmFtZSkpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1ha2VNZXNzYWdlKHByb3BlcnR5LmtleSwgcGF0aCksXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGF0aC5wdXNoKHByb3BlcnR5LmtleS5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lFeHBvcnRNYXAgPSBuYW1lc3BhY2UuZ2V0KHByb3BlcnR5LmtleS5uYW1lKTtcbiAgICAgICAgICAgIC8vIGNvdWxkIGJlIG51bGwgd2hlbiBpZ25vcmVkIG9yIGFtYmlndW91c1xuICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3lFeHBvcnRNYXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGVzdEtleShwcm9wZXJ0eS52YWx1ZSwgZGVwZW5kZW5jeUV4cG9ydE1hcC5uYW1lc3BhY2UsIHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0ZXN0S2V5KGlkLCBuYW1lc3BhY2VzLmdldChpbml0Lm5hbWUpKTtcbiAgICAgIH0sXG5cbiAgICAgIEpTWE1lbWJlckV4cHJlc3Npb24oeyBvYmplY3QsIHByb3BlcnR5IH0pIHtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhvYmplY3QubmFtZSkpIHJldHVybjtcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gbmFtZXNwYWNlcy5nZXQob2JqZWN0Lm5hbWUpO1xuICAgICAgICBpZiAoIW5hbWVzcGFjZS5oYXMocHJvcGVydHkubmFtZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlOiBwcm9wZXJ0eSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1ha2VNZXNzYWdlKHByb3BlcnR5LCBbb2JqZWN0Lm5hbWVdKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==