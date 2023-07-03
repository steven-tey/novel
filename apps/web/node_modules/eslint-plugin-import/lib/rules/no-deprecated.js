'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function message(deprecation) {
  return 'Deprecated' + (deprecation.description ? ': ' + deprecation.description : '.');
}

function getDeprecation(metadata) {
  if (!metadata || !metadata.doc) return;

  return metadata.doc.tags.find(function (t) {return t.title === 'deprecated';});
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid imported names marked with `@deprecated` documentation tag.',
      url: (0, _docsUrl2['default'])('no-deprecated') },

    schema: [] },


  create: function () {function create(context) {
      var deprecated = new Map();
      var namespaces = new Map();

      function checkSpecifiers(node) {
        if (node.type !== 'ImportDeclaration') return;
        if (node.source == null) return; // local export, ignore

        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null) return;

        var moduleDeprecation = imports.doc && imports.doc.tags.find(function (t) {return t.title === 'deprecated';});
        if (moduleDeprecation) {
          context.report({ node: node, message: message(moduleDeprecation) });
        }

        if (imports.errors.length) {
          imports.reportErrors(context, node);
          return;
        }

        node.specifiers.forEach(function (im) {
          var imported = void 0;var local = void 0;
          switch (im.type) {


            case 'ImportNamespaceSpecifier':{
                if (!imports.size) return;
                namespaces.set(im.local.name, imports);
                return;
              }

            case 'ImportDefaultSpecifier':
              imported = 'default';
              local = im.local.name;
              break;

            case 'ImportSpecifier':
              imported = im.imported.name;
              local = im.local.name;
              break;

            default:return; // can't handle this one
          }

          // unknown thing can't be deprecated
          var exported = imports.get(imported);
          if (exported == null) return;

          // capture import of deep namespace
          if (exported.namespace) namespaces.set(local, exported.namespace);

          var deprecation = getDeprecation(imports.get(imported));
          if (!deprecation) return;

          context.report({ node: im, message: message(deprecation) });

          deprecated.set(local, deprecation);

        });
      }

      return {
        'Program': function () {function Program(_ref) {var body = _ref.body;return body.forEach(checkSpecifiers);}return Program;}(),

        'Identifier': function () {function Identifier(node) {
            if (node.parent.type === 'MemberExpression' && node.parent.property === node) {
              return; // handled by MemberExpression
            }

            // ignore specifier identifiers
            if (node.parent.type.slice(0, 6) === 'Import') return;

            if (!deprecated.has(node.name)) return;

            if ((0, _declaredScope2['default'])(context, node.name) !== 'module') return;
            context.report({
              node: node,
              message: message(deprecated.get(node.name)) });

          }return Identifier;}(),

        'MemberExpression': function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') return;
            if (!namespaces.has(dereference.object.name)) return;

            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') return;

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] &&
            dereference.type === 'MemberExpression') {

              // ignore computed parts for now
              if (dereference.computed) return;

              var metadata = namespace.get(dereference.property.name);

              if (!metadata) break;
              var deprecation = getDeprecation(metadata);

              if (deprecation) {
                context.report({ node: dereference.property, message: message(deprecation) });
              }

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = metadata.namespace;
              dereference = dereference.parent;
            }
          }return MemberExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZXByZWNhdGVkLmpzIl0sIm5hbWVzIjpbIm1lc3NhZ2UiLCJkZXByZWNhdGlvbiIsImRlc2NyaXB0aW9uIiwiZ2V0RGVwcmVjYXRpb24iLCJtZXRhZGF0YSIsImRvYyIsInRhZ3MiLCJmaW5kIiwidCIsInRpdGxlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImRlcHJlY2F0ZWQiLCJNYXAiLCJuYW1lc3BhY2VzIiwiY2hlY2tTcGVjaWZpZXJzIiwibm9kZSIsInNvdXJjZSIsImltcG9ydHMiLCJFeHBvcnRzIiwiZ2V0IiwidmFsdWUiLCJtb2R1bGVEZXByZWNhdGlvbiIsInJlcG9ydCIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsInNwZWNpZmllcnMiLCJmb3JFYWNoIiwiaW0iLCJpbXBvcnRlZCIsImxvY2FsIiwic2l6ZSIsInNldCIsIm5hbWUiLCJleHBvcnRlZCIsIm5hbWVzcGFjZSIsImJvZHkiLCJwYXJlbnQiLCJwcm9wZXJ0eSIsInNsaWNlIiwiaGFzIiwiZGVyZWZlcmVuY2UiLCJvYmplY3QiLCJuYW1lcGF0aCIsImNvbXB1dGVkIiwicHVzaCJdLCJtYXBwaW5ncyI6ImFBQUEsa0U7QUFDQSx5QztBQUNBLHFDOztBQUVBLFNBQVNBLE9BQVQsQ0FBaUJDLFdBQWpCLEVBQThCO0FBQzVCLFNBQU8sZ0JBQWdCQSxZQUFZQyxXQUFaLEdBQTBCLE9BQU9ELFlBQVlDLFdBQTdDLEdBQTJELEdBQTNFLENBQVA7QUFDRDs7QUFFRCxTQUFTQyxjQUFULENBQXdCQyxRQUF4QixFQUFrQztBQUNoQyxNQUFJLENBQUNBLFFBQUQsSUFBYSxDQUFDQSxTQUFTQyxHQUEzQixFQUFnQzs7QUFFaEMsU0FBT0QsU0FBU0MsR0FBVCxDQUFhQyxJQUFiLENBQWtCQyxJQUFsQixDQUF1QixxQkFBS0MsRUFBRUMs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O0FBQ0Esa0JBQUlxQyxZQUFZRyxRQUFoQixFQUEwQjs7QUFFMUIsa0JBQU1qRCxXQUFXd0MsVUFBVWhCLEdBQVYsQ0FBY3NCLFlBQVlILFFBQVosQ0FBcUJMLElBQW5DLENBQWpCOztBQUVBLGtCQUFJLENBQUN0QyxRQUFMLEVBQWU7QUFDZixrQkFBTUgsY0FBY0UsZUFBZUMsUUFBZixDQUFwQjs7QUFFQSxrQkFBSUgsV0FBSixFQUFpQjtBQUNma0Isd0JBQVFZLE1BQVIsQ0FBZSxFQUFFUCxNQUFNMEIsWUFBWUgsUUFBcEIsRUFBOEIvQyxTQUFTQSxRQUFRQyxXQUFSLENBQXZDLEVBQWY7QUFDRDs7QUFFRDtBQUNBbUQsdUJBQVNFLElBQVQsQ0FBY0osWUFBWUgsUUFBWixDQUFxQkwsSUFBbkM7QUFDQUUsMEJBQVl4QyxTQUFTd0MsU0FBckI7QUFDQU0sNEJBQWNBLFlBQVlKLE1BQTFCO0FBQ0Q7QUFDRixXQTlCRCwyQkFwQkssRUFBUDs7QUFvREQsS0E3SGMsbUJBQWpCIiwiZmlsZSI6Im5vLWRlcHJlY2F0ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVjbGFyZWRTY29wZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2RlY2xhcmVkU2NvcGUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5mdW5jdGlvbiBtZXNzYWdlKGRlcHJlY2F0aW9uKSB7XG4gIHJldHVybiAnRGVwcmVjYXRlZCcgKyAoZGVwcmVjYXRpb24uZGVzY3JpcHRpb24gPyAnOiAnICsgZGVwcmVjYXRpb24uZGVzY3JpcHRpb24gOiAnLicpO1xufVxuXG5mdW5jdGlvbiBnZXREZXByZWNhdGlvbihtZXRhZGF0YSkge1xuICBpZiAoIW1ldGFkYXRhIHx8ICFtZXRhZGF0YS5kb2MpIHJldHVybjtcblxuICByZXR1cm4gbWV0YWRhdGEuZG9jLnRhZ3MuZmluZCh0ID0+IHQudGl0bGUgPT09ICdkZXByZWNhdGVkJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBpbXBvcnRlZCBuYW1lcyBtYXJrZWQgd2l0aCBgQGRlcHJlY2F0ZWRgIGRvY3VtZW50YXRpb24gdGFnLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWRlcHJlY2F0ZWQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBkZXByZWNhdGVkID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBjaGVja1NwZWNpZmllcnMobm9kZSkge1xuICAgICAgaWYgKG5vZGUudHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykgcmV0dXJuO1xuICAgICAgaWYgKG5vZGUuc291cmNlID09IG51bGwpIHJldHVybjsgLy8gbG9jYWwgZXhwb3J0LCBpZ25vcmVcblxuICAgICAgY29uc3QgaW1wb3J0cyA9IEV4cG9ydHMuZ2V0KG5vZGUuc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgIGlmIChpbXBvcnRzID09IG51bGwpIHJldHVybjtcblxuICAgICAgY29uc3QgbW9kdWxlRGVwcmVjYXRpb24gPSBpbXBvcnRzLmRvYyAmJiBpbXBvcnRzLmRvYy50YWdzLmZpbmQodCA9PiB0LnRpdGxlID09PSAnZGVwcmVjYXRlZCcpO1xuICAgICAgaWYgKG1vZHVsZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogbWVzc2FnZShtb2R1bGVEZXByZWNhdGlvbikgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgaW1wb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgbm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbm9kZS5zcGVjaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKGltKSB7XG4gICAgICAgIGxldCBpbXBvcnRlZDsgbGV0IGxvY2FsO1xuICAgICAgICBzd2l0Y2ggKGltLnR5cGUpIHtcblxuXG4gICAgICAgIGNhc2UgJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcic6e1xuICAgICAgICAgIGlmICghaW1wb3J0cy5zaXplKSByZXR1cm47XG4gICAgICAgICAgbmFtZXNwYWNlcy5zZXQoaW0ubG9jYWwubmFtZSwgaW1wb3J0cyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcic6XG4gICAgICAgICAgaW1wb3J0ZWQgPSAnZGVmYXVsdCc7XG4gICAgICAgICAgbG9jYWwgPSBpbS5sb2NhbC5uYW1lO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ0ltcG9ydFNwZWNpZmllcic6XG4gICAgICAgICAgaW1wb3J0ZWQgPSBpbS5pbXBvcnRlZC5uYW1lO1xuICAgICAgICAgIGxvY2FsID0gaW0ubG9jYWwubmFtZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OiByZXR1cm47IC8vIGNhbid0IGhhbmRsZSB0aGlzIG9uZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW5rbm93biB0aGluZyBjYW4ndCBiZSBkZXByZWNhdGVkXG4gICAgICAgIGNvbnN0IGV4cG9ydGVkID0gaW1wb3J0cy5nZXQoaW1wb3J0ZWQpO1xuICAgICAgICBpZiAoZXhwb3J0ZWQgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNhcHR1cmUgaW1wb3J0IG9mIGRlZXAgbmFtZXNwYWNlXG4gICAgICAgIGlmIChleHBvcnRlZC5uYW1lc3BhY2UpIG5hbWVzcGFjZXMuc2V0KGxvY2FsLCBleHBvcnRlZC5uYW1lc3BhY2UpO1xuXG4gICAgICAgIGNvbnN0IGRlcHJlY2F0aW9uID0gZ2V0RGVwcmVjYXRpb24oaW1wb3J0cy5nZXQoaW1wb3J0ZWQpKTtcbiAgICAgICAgaWYgKCFkZXByZWNhdGlvbikgcmV0dXJuO1xuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZTogaW0sIG1lc3NhZ2U6IG1lc3NhZ2UoZGVwcmVjYXRpb24pIH0pO1xuXG4gICAgICAgIGRlcHJlY2F0ZWQuc2V0KGxvY2FsLCBkZXByZWNhdGlvbik7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAnUHJvZ3JhbSc6ICh7IGJvZHkgfSkgPT4gYm9keS5mb3JFYWNoKGNoZWNrU3BlY2lmaWVycyksXG5cbiAgICAgICdJZGVudGlmaWVyJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJyAmJiBub2RlLnBhcmVudC5wcm9wZXJ0eSA9PT0gbm9kZSkge1xuICAgICAgICAgIHJldHVybjsgLy8gaGFuZGxlZCBieSBNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZ25vcmUgc3BlY2lmaWVyIGlkZW50aWZpZXJzXG4gICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlLnNsaWNlKDAsIDYpID09PSAnSW1wb3J0JykgcmV0dXJuO1xuXG4gICAgICAgIGlmICghZGVwcmVjYXRlZC5oYXMobm9kZS5uYW1lKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChkZWNsYXJlZFNjb3BlKGNvbnRleHQsIG5vZGUubmFtZSkgIT09ICdtb2R1bGUnKSByZXR1cm47XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UoZGVwcmVjYXRlZC5nZXQobm9kZS5uYW1lKSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgJ01lbWJlckV4cHJlc3Npb24nOiBmdW5jdGlvbiAoZGVyZWZlcmVuY2UpIHtcbiAgICAgICAgaWYgKGRlcmVmZXJlbmNlLm9iamVjdC50eXBlICE9PSAnSWRlbnRpZmllcicpIHJldHVybjtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkpIHJldHVybjtcblxuICAgICAgICBpZiAoZGVjbGFyZWRTY29wZShjb250ZXh0LCBkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkgIT09ICdtb2R1bGUnKSByZXR1cm47XG5cbiAgICAgICAgLy8gZ28gZGVlcFxuICAgICAgICBsZXQgbmFtZXNwYWNlID0gbmFtZXNwYWNlcy5nZXQoZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpO1xuICAgICAgICBjb25zdCBuYW1lcGF0aCA9IFtkZXJlZmVyZW5jZS5vYmplY3QubmFtZV07XG4gICAgICAgIC8vIHdoaWxlIHByb3BlcnR5IGlzIG5hbWVzcGFjZSBhbmQgcGFyZW50IGlzIG1lbWJlciBleHByZXNzaW9uLCBrZWVwIHZhbGlkYXRpbmdcbiAgICAgICAgd2hpbGUgKG5hbWVzcGFjZSBpbnN0YW5jZW9mIEV4cG9ydHMgJiZcbiAgICAgICAgICAgICAgIGRlcmVmZXJlbmNlLnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJykge1xuXG4gICAgICAgICAgLy8gaWdub3JlIGNvbXB1dGVkIHBhcnRzIGZvciBub3dcbiAgICAgICAgICBpZiAoZGVyZWZlcmVuY2UuY29tcHV0ZWQpIHJldHVybjtcblxuICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gbmFtZXNwYWNlLmdldChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgIGlmICghbWV0YWRhdGEpIGJyZWFrO1xuICAgICAgICAgIGNvbnN0IGRlcHJlY2F0aW9uID0gZ2V0RGVwcmVjYXRpb24obWV0YWRhdGEpO1xuXG4gICAgICAgICAgaWYgKGRlcHJlY2F0aW9uKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGU6IGRlcmVmZXJlbmNlLnByb3BlcnR5LCBtZXNzYWdlOiBtZXNzYWdlKGRlcHJlY2F0aW9uKSB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzdGFzaCBhbmQgcG9wXG4gICAgICAgICAgbmFtZXBhdGgucHVzaChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICBuYW1lc3BhY2UgPSBtZXRhZGF0YS5uYW1lc3BhY2U7XG4gICAgICAgICAgZGVyZWZlcmVuY2UgPSBkZXJlZmVyZW5jZS5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=