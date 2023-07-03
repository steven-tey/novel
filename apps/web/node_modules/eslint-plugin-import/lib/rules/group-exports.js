'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _object = require('object.values');var _object2 = _interopRequireDefault(_object);
var _arrayPrototype = require('array.prototype.flat');var _arrayPrototype2 = _interopRequireDefault(_arrayPrototype);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var meta = {
  type: 'suggestion',
  docs: {
    category: 'Style guide',
    description: 'Prefer named exports to be grouped together in a single export declaration',
    url: (0, _docsUrl2['default'])('group-exports') } };


/* eslint-disable max-len */
var errors = {
  ExportNamedDeclaration: 'Multiple named export declarations; consolidate all named exports into a single export declaration',
  AssignmentExpression: 'Multiple CommonJS exports; consolidate all exports into a single assignment to `module.exports`' };

/* eslint-enable max-len */

/**
                             * Returns an array with names of the properties in the accessor chain for MemberExpression nodes
                             *
                             * Example:
                             *
                             * `module.exports = {}` => ['module', 'exports']
                             * `module.exports.property = true` => ['module', 'exports', 'property']
                             *
                             * @param     {Node}    node    AST Node (MemberExpression)
                             * @return    {Array}           Array with the property names in the chain
                             * @private
                             */
function accessorChain(node) {
  var chain = [];

  do {
    chain.unshift(node.property.name);

    if (node.object.type === 'Identifier') {
      chain.unshift(node.object.name);
      break;
    }

    node = node.object;
  } while (node.type === 'MemberExpression');

  return chain;
}

function create(context) {
  var nodes = {
    modules: {
      set: new Set(),
      sources: {} },

    types: {
      set: new Set(),
      sources: {} },

    commonjs: {
      set: new Set() } };



  return {
    ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
        var target = node.exportKind === 'type' ? nodes.types : nodes.modules;
        if (!node.source) {
          target.set.add(node);
        } else if (Array.isArray(target.sources[node.source.value])) {
          target.sources[node.source.value].push(node);
        } else {
          target.sources[node.source.value] = [node];
        }
      }return ExportNamedDeclaration;}(),

    AssignmentExpression: function () {function AssignmentExpression(node) {
        if (node.left.type !== 'MemberExpression') {
          return;
        }

        var chain = accessorChain(node.left);

        // Assignments to module.exports
        // Deeper assignments are ignored since they just modify what's already being exported
        // (ie. module.exports.exported.prop = true is ignored)
        if (chain[0] === 'module' && chain[1] === 'exports' && chain.length <= 3) {
          nodes.commonjs.set.add(node);
          return;
        }

        // Assignments to exports (exports.* = *)
        if (chain[0] === 'exports' && chain.length === 2) {
          nodes.commonjs.set.add(node);
          return;
        }
      }return AssignmentExpression;}(),

    'Program:exit': function () {function onExit() {
        // Report multiple `export` declarations (ES2015 modules)
        if (nodes.modules.set.size > 1) {
          nodes.modules.set.forEach(function (node) {
            context.report({
              node: node,
              message: errors[node.type] });

          });
        }

        // Report multiple `aggregated exports` from the same module (ES2015 modules)
        (0, _arrayPrototype2['default'])((0, _object2['default'])(nodes.modules.sources).
        filter(function (nodesWithSource) {return Array.isArray(nodesWithSource) && nodesWithSource.length > 1;})).
        forEach(function (node) {
          context.report({
            node: node,
            message: errors[node.type] });

        });

        // Report multiple `export type` declarations (FLOW ES2015 modules)
        if (nodes.types.set.size > 1) {
          nodes.types.set.forEach(function (node) {
            context.report({
              node: node,
              message: errors[node.type] });

          });
        }

        // Report multiple `aggregated type exports` from the same module (FLOW ES2015 modules)
        (0, _arrayPrototype2['default'])((0, _object2['default'])(nodes.types.sources).
        filter(function (nodesWithSource) {return Array.isArray(nodesWithSource) && nodesWithSource.length > 1;})).
        forEach(function (node) {
          context.report({
            node: node,
            message: errors[node.type] });

        });

        // Report multiple `module.exports` assignments (CommonJS)
        if (nodes.commonjs.set.size > 1) {
          nodes.commonjs.set.forEach(function (node) {
            context.report({
              node: node,
              message: errors[node.type] });

          });
        }
      }return onExit;}() };

}

module.exports = {
  meta: meta,
  create: create };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9ncm91cC1leHBvcnRzLmpzIl0sIm5hbWVzIjpbIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJlcnJvcnMiLCJFeHBvcnROYW1lZERlY2xhcmF0aW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJhY2Nlc3NvckNoYWluIiwibm9kZSIsImNoYWluIiwidW5zaGlmdCIsInByb3BlcnR5IiwibmFtZSIsIm9iamVjdCIsImNyZWF0ZSIsImNvbnRleHQiLCJub2RlcyIsIm1vZHVsZXMiLCJzZXQiLCJTZXQiLCJzb3VyY2VzIiwidHlwZXMiLCJjb21tb25qcyIsInRhcmdldCIsImV4cG9ydEtpbmQiLCJzb3VyY2UiLCJhZGQiLCJBcnJheSIsImlzQXJyYXkiLCJ2YWx1ZSIsInB1c2giLCJsZWZ0IiwibGVuZ3RoIiwib25FeGl0Iiwic2l6ZSIsImZvckVhY2giLCJyZXBvcnQiLCJtZXNzYWdlIiwiZmlsdGVyIiwibm9kZXNXaXRoU291cmNlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6ImFBQUEscUM7QUFDQSx1QztBQUNBLHNEOztBQUVBLElBQU1BLE9BQU87QUFDWEMsUUFBTSxZQURLO0FBRVhDLFFBQU07QUFDSkMsY0FBVSxhQUROO0FBRUpDLGlCQUFhLDRFQUZUO0FBR0pDLFNBQUssMEJBQVEsZUFBUixDQUhELEVBRkssRUFBYjs7O0FBUUE7QUFDQSxJQUFNQyxTQUFTO0FBQ2JDLDBCQUF3QixvR0FEWDtBQUViQyx3QkFBc0IsaUdBRlQsRUFBZjs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsU0FBU0MsYUFBVCxDQUF1QkMsSUFBdkIsRUFBNkI7QUFDM0IsTUFBTUMsUUFBUSxFQUFkOztBQUVBLEtBQUc7QUFDREEsVUFBTUMsT0FBTixDQUFjRixLQUFLRyxRQUFMLENBQWNDLElBQTVCOztBQUVBLFFBQUlKLEtBQUtLLE1BQUwsQ0FBWWQsSUFBWixLQUFxQixZQUF6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bXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcbmltcG9ydCB2YWx1ZXMgZnJvbSAnb2JqZWN0LnZhbHVlcyc7XG5pbXBvcnQgZmxhdCBmcm9tICdhcnJheS5wcm90b3R5cGUuZmxhdCc7XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgZG9jczoge1xuICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgIGRlc2NyaXB0aW9uOiAnUHJlZmVyIG5hbWVkIGV4cG9ydHMgdG8gYmUgZ3JvdXBlZCB0b2dldGhlciBpbiBhIHNpbmdsZSBleHBvcnQgZGVjbGFyYXRpb24nLFxuICAgIHVybDogZG9jc1VybCgnZ3JvdXAtZXhwb3J0cycpLFxuICB9LFxufTtcbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbmNvbnN0IGVycm9ycyA9IHtcbiAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbjogJ011bHRpcGxlIG5hbWVkIGV4cG9ydCBkZWNsYXJhdGlvbnM7IGNvbnNvbGlkYXRlIGFsbCBuYW1lZCBleHBvcnRzIGludG8gYSBzaW5nbGUgZXhwb3J0IGRlY2xhcmF0aW9uJyxcbiAgQXNzaWdubWVudEV4cHJlc3Npb246ICdNdWx0aXBsZSBDb21tb25KUyBleHBvcnRzOyBjb25zb2xpZGF0ZSBhbGwgZXhwb3J0cyBpbnRvIGEgc2luZ2xlIGFzc2lnbm1lbnQgdG8gYG1vZHVsZS5leHBvcnRzYCcsXG59O1xuLyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSB3aXRoIG5hbWVzIG9mIHRoZSBwcm9wZXJ0aWVzIGluIHRoZSBhY2Nlc3NvciBjaGFpbiBmb3IgTWVtYmVyRXhwcmVzc2lvbiBub2Rlc1xuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYG1vZHVsZS5leHBvcnRzID0ge31gID0+IFsnbW9kdWxlJywgJ2V4cG9ydHMnXVxuICogYG1vZHVsZS5leHBvcnRzLnByb3BlcnR5ID0gdHJ1ZWAgPT4gWydtb2R1bGUnLCAnZXhwb3J0cycsICdwcm9wZXJ0eSddXG4gKlxuICogQHBhcmFtICAgICB7Tm9kZX0gICAgbm9kZSAgICBBU1QgTm9kZSAoTWVtYmVyRXhwcmVzc2lvbilcbiAqIEByZXR1cm4gICAge0FycmF5fSAgICAgICAgICAgQXJyYXkgd2l0aCB0aGUgcHJvcGVydHkgbmFtZXMgaW4gdGhlIGNoYWluXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhY2Nlc3NvckNoYWluKG5vZGUpIHtcbiAgY29uc3QgY2hhaW4gPSBbXTtcblxuICBkbyB7XG4gICAgY2hhaW4udW5zaGlmdChub2RlLnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgaWYgKG5vZGUub2JqZWN0LnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgY2hhaW4udW5zaGlmdChub2RlLm9iamVjdC5uYW1lKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG5vZGUgPSBub2RlLm9iamVjdDtcbiAgfSB3aGlsZSAobm9kZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpO1xuXG4gIHJldHVybiBjaGFpbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQpIHtcbiAgY29uc3Qgbm9kZXMgPSB7XG4gICAgbW9kdWxlczoge1xuICAgICAgc2V0OiBuZXcgU2V0KCksXG4gICAgICBzb3VyY2VzOiB7fSxcbiAgICB9LFxuICAgIHR5cGVzOiB7XG4gICAgICBzZXQ6IG5ldyBTZXQoKSxcbiAgICAgIHNvdXJjZXM6IHt9LFxuICAgIH0sXG4gICAgY29tbW9uanM6IHtcbiAgICAgIHNldDogbmV3IFNldCgpLFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUuZXhwb3J0S2luZCA9PT0gJ3R5cGUnID8gbm9kZXMudHlwZXMgOiBub2Rlcy5tb2R1bGVzO1xuICAgICAgaWYgKCFub2RlLnNvdXJjZSkge1xuICAgICAgICB0YXJnZXQuc2V0LmFkZChub2RlKTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQuc291cmNlc1tub2RlLnNvdXJjZS52YWx1ZV0pKSB7XG4gICAgICAgIHRhcmdldC5zb3VyY2VzW25vZGUuc291cmNlLnZhbHVlXS5wdXNoKG5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LnNvdXJjZXNbbm9kZS5zb3VyY2UudmFsdWVdID0gW25vZGVdO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBBc3NpZ25tZW50RXhwcmVzc2lvbihub2RlKSB7XG4gICAgICBpZiAobm9kZS5sZWZ0LnR5cGUgIT09ICdNZW1iZXJFeHByZXNzaW9uJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoYWluID0gYWNjZXNzb3JDaGFpbihub2RlLmxlZnQpO1xuXG4gICAgICAvLyBBc3NpZ25tZW50cyB0byBtb2R1bGUuZXhwb3J0c1xuICAgICAgLy8gRGVlcGVyIGFzc2lnbm1lbnRzIGFyZSBpZ25vcmVkIHNpbmNlIHRoZXkganVzdCBtb2RpZnkgd2hhdCdzIGFscmVhZHkgYmVpbmcgZXhwb3J0ZWRcbiAgICAgIC8vIChpZS4gbW9kdWxlLmV4cG9ydHMuZXhwb3J0ZWQucHJvcCA9IHRydWUgaXMgaWdub3JlZClcbiAgICAgIGlmIChjaGFpblswXSA9PT0gJ21vZHVsZScgJiYgY2hhaW5bMV0gPT09ICdleHBvcnRzJyAmJiBjaGFpbi5sZW5ndGggPD0gMykge1xuICAgICAgICBub2Rlcy5jb21tb25qcy5zZXQuYWRkKG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEFzc2lnbm1lbnRzIHRvIGV4cG9ydHMgKGV4cG9ydHMuKiA9ICopXG4gICAgICBpZiAoY2hhaW5bMF0gPT09ICdleHBvcnRzJyAmJiBjaGFpbi5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgbm9kZXMuY29tbW9uanMuc2V0LmFkZChub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gb25FeGl0KCkge1xuICAgICAgLy8gUmVwb3J0IG11bHRpcGxlIGBleHBvcnRgIGRlY2xhcmF0aW9ucyAoRVMyMDE1IG1vZHVsZXMpXG4gICAgICBpZiAobm9kZXMubW9kdWxlcy5zZXQuc2l6ZSA+IDEpIHtcbiAgICAgICAgbm9kZXMubW9kdWxlcy5zZXQuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JzW25vZGUudHlwZV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXBvcnQgbXVsdGlwbGUgYGFnZ3JlZ2F0ZWQgZXhwb3J0c2AgZnJvbSB0aGUgc2FtZSBtb2R1bGUgKEVTMjAxNSBtb2R1bGVzKVxuICAgICAgZmxhdCh2YWx1ZXMobm9kZXMubW9kdWxlcy5zb3VyY2VzKVxuICAgICAgICAuZmlsdGVyKG5vZGVzV2l0aFNvdXJjZSA9PiBBcnJheS5pc0FycmF5KG5vZGVzV2l0aFNvdXJjZSkgJiYgbm9kZXNXaXRoU291cmNlLmxlbmd0aCA+IDEpKVxuICAgICAgICAuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnNbbm9kZS50eXBlXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIFJlcG9ydCBtdWx0aXBsZSBgZXhwb3J0IHR5cGVgIGRlY2xhcmF0aW9ucyAoRkxPVyBFUzIwMTUgbW9kdWxlcylcbiAgICAgIGlmIChub2Rlcy50eXBlcy5zZXQuc2l6ZSA+IDEpIHtcbiAgICAgICAgbm9kZXMudHlwZXMuc2V0LmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yc1tub2RlLnR5cGVdLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVwb3J0IG11bHRpcGxlIGBhZ2dyZWdhdGVkIHR5cGUgZXhwb3J0c2AgZnJvbSB0aGUgc2FtZSBtb2R1bGUgKEZMT1cgRVMyMDE1IG1vZHVsZXMpXG4gICAgICBmbGF0KHZhbHVlcyhub2Rlcy50eXBlcy5zb3VyY2VzKVxuICAgICAgICAuZmlsdGVyKG5vZGVzV2l0aFNvdXJjZSA9PiBBcnJheS5pc0FycmF5KG5vZGVzV2l0aFNvdXJjZSkgJiYgbm9kZXNXaXRoU291cmNlLmxlbmd0aCA+IDEpKVxuICAgICAgICAuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnNbbm9kZS50eXBlXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIFJlcG9ydCBtdWx0aXBsZSBgbW9kdWxlLmV4cG9ydHNgIGFzc2lnbm1lbnRzIChDb21tb25KUylcbiAgICAgIGlmIChub2Rlcy5jb21tb25qcy5zZXQuc2l6ZSA+IDEpIHtcbiAgICAgICAgbm9kZXMuY29tbW9uanMuc2V0LmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yc1tub2RlLnR5cGVdLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YSxcbiAgY3JlYXRlLFxufTtcbiJdfQ==