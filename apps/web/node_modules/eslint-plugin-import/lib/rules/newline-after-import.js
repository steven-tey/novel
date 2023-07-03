'use strict';




var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);

var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}
var log = (0, _debug2['default'])('eslint-plugin-import:rules:newline-after-import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */function containsNodeOrEqual(outerNode, innerNode) {return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];}

function getScopeBody(scope) {
  if (scope.block.type === 'SwitchStatement') {
    log('SwitchStatement scopes not supported');
    return null;
  }var

  body = scope.block.body;
  if (body && body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(body, nodeToFind) {
  return body.findIndex(function (node) {return containsNodeOrEqual(node, nodeToFind);});
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

function isClassWithDecorator(node) {
  return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length;
}

function isExportDefaultClass(node) {
  return node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ClassDeclaration';
}

function isExportNameClass(node) {

  return node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'ClassDeclaration';
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      category: 'Style guide',
      description: 'Enforce a newline after import statements.',
      url: (0, _docsUrl2['default'])('newline-after-import') },

    fixable: 'whitespace',
    schema: [
    {
      'type': 'object',
      'properties': {
        'count': {
          'type': 'integer',
          'minimum': 1 },

        'considerComments': { 'type': 'boolean' } },

      'additionalProperties': false }] },



  create: function () {function create(context) {
      var level = 0;
      var requireCalls = [];
      var options = Object.assign({ count: 1, considerComments: false }, context.options[0]);

      function checkForNewLine(node, nextNode, type) {
        if (isExportDefaultClass(nextNode) || isExportNameClass(nextNode)) {
          var classNode = nextNode.declaration;

          if (isClassWithDecorator(classNode)) {
            nextNode = classNode.decorators[0];
          }
        } else if (isClassWithDecorator(nextNode)) {
          nextNode = nextNode.decorators[0];
        }

        var lineDifference = getLineDifference(node, nextNode);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after ' + String(type) + ' statement not followed by another ' + String(type) + '.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function commentAfterImport(node, nextComment) {
        var lineDifference = getLineDifference(node, nextComment);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after import statement not followed by another import.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function incrementLevel() {
        level++;
      }
      function decrementLevel() {
        level--;
      }

      function checkImport(node) {var
        parent = node.parent;
        var nodePosition = parent.body.indexOf(node);
        var nextNode = parent.body[nodePosition + 1];
        var endLine = node.loc.end.line;
        var nextComment = void 0;

        if (typeof parent.comments !== 'undefined' && options.considerComments) {
          nextComment = parent.comments.find(function (o) {return o.loc.start.line === endLine + 1;});
        }


        // skip "export import"s
        if (node.type === 'TSImportEqualsDeclaration' && node.isExport) {
          return;
        }

        if (nextComment && typeof nextComment !== 'undefined') {
          commentAfterImport(node, nextComment);
        } else if (nextNode && nextNode.type !== 'ImportDeclaration' && (nextNode.type !== 'TSImportEqualsDeclaration' || nextNode.isExport)) {
          checkForNewLine(node, nextNode, 'import');
        }
      }

      return {
        ImportDeclaration: checkImport,
        TSImportEqualsDeclaration: checkImport,
        CallExpression: function () {function CallExpression(node) {
            if ((0, _staticRequire2['default'])(node) && level === 0) {
              requireCalls.push(node);
            }
          }return CallExpression;}(),
        'Program:exit': function () {function ProgramExit() {
            log('exit processing for', context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
            var scopeBody = getScopeBody(context.getScope());
            log('got scope:', scopeBody);

            requireCalls.forEach(function (node, index) {
              var nodePosition = findNodeIndexInScopeBody(scopeBody, node);
              log('node position in scope:', nodePosition);

              var statementWithRequireCall = scopeBody[nodePosition];
              var nextStatement = scopeBody[nodePosition + 1];
              var nextRequireCall = requireCalls[index + 1];

              if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
                return;
              }

              if (nextStatement && (
              !nextRequireCall || !containsNodeOrEqual(nextStatement, nextRequireCall))) {

                checkForNewLine(statementWithRequireCall, nextStatement, 'require');
              }
            });
          }return ProgramExit;}(),
        FunctionDeclaration: incrementLevel,
        FunctionExpression: incrementLevel,
        ArrowFunctionExpression: incrementLevel,
        BlockStatement: incrementLevel,
        ObjectExpression: incrementLevel,
        Decorator: incrementLevel,
        'FunctionDeclaration:exit': decrementLevel,
        'FunctionExpression:exit': decrementLevel,
        'ArrowFunctionExpression:exit': decrementLevel,
        'BlockStatement:exit': decrementLevel,
        'ObjectExpression:exit': decrementLevel,
        'Decorator:exit': decrementLevel };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uZXdsaW5lLWFmdGVyLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJjb250YWluc05vZGVPckVxdWFsIiwib3V0ZXJOb2RlIiwiaW5uZXJOb2RlIiwicmFuZ2UiLCJnZXRTY29wZUJvZHkiLCJzY29wZSIsImJsb2NrIiwidHlwZSIsImJvZHkiLCJmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkiLCJub2RlVG9GaW5kIiwiZmluZEluZGV4Iiwibm9kZSIsImdldExpbmVEaWZmZXJlbmNlIiwibmV4dE5vZGUiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJlbmQiLCJpc0NsYXNzV2l0aERlY29yYXRvciIsImRlY29yYXRvcnMiLCJsZW5ndGgiLCJpc0V4cG9ydERlZmF1bHRDbGFzcyIsImRlY2xhcmF0aW9uIiwiaXNFeHBvcnROYW1lQ2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJsZXZlbCIsInJlcXVpcmVDYWxscyIsIm9wdGlvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJjb3VudCIsImNvbnNpZGVyQ29tbWVudHMiLCJjaGVja0Zvck5ld0xpbmUiLCJjbGFzc05vZGUiLCJsaW5lRGlmZmVyZW5jZSIsIkVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSIsImNvbHVtbiIsInJlcG9ydCIsIm1lc3NhZ2UiLCJmaXgiLCJmaXhlciIsImluc2VydFRleHRBZnRlciIsInJlcGVhdCIsImNvbW1lbnRBZnRlckltcG9ydCIsIm5leHRDb21tZW50IiwiaW5jcmVtZW50TGV2ZWwiLCJkZWNyZW1lbnRMZXZlbCIsImNoZWNrSW1wb3J0IiwicGFyZW50Iiwibm9kZVBvc2l0aW9uIiwiaW5kZXhPZiIsImVuZExpbmUiLCJjb21tZW50cyIsImZpbmQiLCJvIiwiaXNFeHBvcnQiLCJJbXBvcnREZWNsYXJhdGlvbiIsIlRTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24iLCJDYWxsRXhwcmVzc2lvbiIsInB1c2giLCJnZXRQaHlzaWNhbEZpbGVuYW1lIiwiZ2V0RmlsZW5hbWUiLCJzY29wZUJvZHkiLCJnZXRTY29wZSIsImZvckVhY2giLCJpbmRleCIsInN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCIsIm5leHRTdGF0ZW1lbnQiLCJuZXh0UmVxdWlyZUNhbGwiLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25FeHByZXNzaW9uIiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJCbG9ja1N0YXRlbWVudCIsIk9iamVjdEV4cHJlc3Npb24iLCJEZWNvcmF0b3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0Q7QUFDQSxxQzs7QUFFQSw4QjtBQUNBLElBQU1BLE1BQU0sd0JBQU0saURBQU4sQ0FBWjs7QUFFQTtBQUNBO0FBQ0E7QUFiQTs7O0dBZUEsU0FBU0MsbUJBQVQsQ0FBNkJDLFNBQTdCLEVBQXdDQyxTQUF4QyxFQUFtRCxDQUNqRCxPQUFPRCxVQUFVRSxLQUFWLENBQWdCLENBQWhCLEtBQXNCRCxVQUFVQyxLQUFWLENBQWdCLENBQWhCLENBQXRCLElBQTRDRixVQUFVRSxLQUFWLENBQWdCLENBQWhCLEtBQXNCRCxVQUFVQyxLQUFWLENBQWdCLENBQWhCLENBQXpFLENBQ0Q7O0FBRUQsU0FBU0MsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDM0IsTUFBSUEsTUFBTUMsS0FBTixDQUFZQyxJQUFaLEtBQXFCLGlCQUF6QixFQUE0QztBQUMxQ1IsUUFBSSxzQ0FBSjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSjBCOztBQU1uQlMsTUFObUIsR0FNVkgsTUFBTUMsS0FOSSxDQU1uQkUsSUFObUI7QUFPM0IsTUFBSUEsUUFBUUEsS0FBS0QsSUFBTCxLQUFjLGdCQUExQixFQUE0QztBQUMxQyxXQUFPQyxLQUFLQSxJQUFaO0FBQ0Q7O0FBRUQsU0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQVNDLHdCQUFULENBQWtDRCxJQUFsQyxFQUF3Q0UsVUFBeEMsRUFBb0Q7QUFDbEQsU0FBT0YsS0FBS0csU0FBTCxDQUFlLFVBQUNDLElBQUQsVUFBVVosb0JBQW9CWSxJQUFwQixFQUEwQkYsVUFBMUIsQ0FBVixFQUFmLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxpQkFBVCxDQUEyQkQsSUFBM0IsRUFBaUNFLFFBQWpDLEVBQTJDO0FBQ3pDLFNBQU9BLFNBQVNDLEdBQVQsQ0FBYUMsS0FBYixDQUFtQkMsSUFBbkIsR0FBMEJMLEtBQUtHLEdBQUwsQ0FBU0csR0FBVCxDQUFhRCxJQUE5QztBQUNEOztBQUVELFNBQVNFLG9CQUFULENBQThCUCxJQUE5QixFQUFvQztBQUNsQyxTQUFPQSxLQUFLTCxJQUFMLEtBQWMsa0JBQWQsSUFBb0NLLEtBQUtRLFVBQXpDLElBQXVEUixLQUFLUSxVQUFMLENBQWdCQyxNQUE5RTtBQUNEOztBQUVELFNBQVNDLG9CQUFULENBQThCVixJQUE5QixFQUFvQztBQUNsQyxTQUFPQSxLQUFLTCxJQUFMLEtBQWMsMEJBQWQsSUFBNENLLEtBQUtXLFdBQUwsQ0FBaUJoQixJQUFqQixLQUEwQixrQkFBN0U7QUFDRDs7QUFFRCxTQUFTaUIsaUJBQVQsQ0FBMkJaLElBQTNCLEVBQWlDOztBQUUvQixTQUFPQSxLQUFLTCxJQUFMLEtBQWMsd0JBQWQsSUFBMENLLEtBQUtXLFdBQS9DLElBQThEWCxLQUFLVyxXQUFMLENBQWlCaEIsSUFBakIsS0FBMEIsa0JBQS9GO0FBQ0Q7O0FBRURrQixPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSnBCLFVBQU0sUUFERjtBQUVKcUIsVUFBTTtBQUNKQyxnQkFBVSxhQUROO0FBRUpDLG1CQUFhLDRDQUZUO0FBR0pDLFdBQUssMEJBQVEsc0JBQVIsQ0FIRCxFQUZGOztBQU9KQyxhQUFTLFlBUEw7QUFRSkMsWUFBUTtBQUNOO0FBQ0UsY0FBUSxRQURWO0FBRUUsb0JBQWM7QUFDWixpQkFBUztBQUNQLGtCQUFRLFNBREQ7QUFFUCxxQkFBVyxDQUZKLEVBREc7O0FBS1osNEJBQW9CLEVBQUUsUUFBUSxTQUFWLEVBTFIsRUFGaEI7O0FBU0UsOEJBQXdCLEtBVDFCLEVBRE0sQ0FSSixFQURTOzs7O0FBdUJmQyxRQXZCZSwrQkF1QlJDLE9BdkJRLEVBdUJDO0FBQ2QsVUFBSUMsUUFBUSxDQUFaO0FBQ0EsVUFBTUMsZUFBZSxFQUFyQjtBQUNBLFVBQU1DLFVBQVVDLE9BQU9DLE1BQVAsQ0FBYyxFQUFFQyxPQUFPLENBQVQsRUFBWUMsa0JBQWtCLEtBQTlCLEVBQWQsRUFBcURQLFFBQVFHLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FBckQsQ0FBaEI7O0FBRUEsZUFBU0ssZUFBVCxDQUF5Qi9CLElBQXpCLEVBQStCRSxRQUEvQixFQUF5Q1AsSUFBekMsRUFBK0M7QUFDN0MsWUFBSWUscUJBQXFCUixRQUFyQixLQUFrQ1Usa0JBQWtCVixRQUFsQixDQUF0QyxFQUFtRTtBQUNqRSxjQUFNOEIsWUFBWTlCLFNBQVNTLFdBQTNCOztBQUVBLGNBQUlKLHFCQUFxQnlCLFNBQXJCLENBQUosRUFBcUM7QUFDbkM5Qix1QkFBVzhCLFVBQVV4QixVQUFWLENBQXFCLENBQXJCLENBQVg7QUFDRDtBQUNGLFNBTkQsTUFNTyxJQUFJRCxxQkFBcUJMLFFBQXJCLENBQUosRUFBb0M7QUFDekNBLHFCQUFXQSxTQUFTTSxVQUFULENBQW9CLENBQXBCLENBQVg7QUFDRDs7QUFFRCxZQUFNeUIsaUJBQWlCaEMsa0JBQWtCRCxJQUFsQixFQUF3QkUsUUFBeEIsQ0FBdkI7QUFDQSxZQUFNZ0MsMkJBQTJCUixRQUFRRyxLQUFSLEdBQWdCLENBQWpEOztBQUVBLFlBQUlJLGlCQUFpQkMsd0JBQXJCLEVBQStDO0FBQzdDLGNBQUlDLFNBQVNuQyxLQUFLRyxHQUFMLENBQVNDLEtBQVQsQ0FBZStCLE1BQTVCOztBQUVBLGNBQUluQyxLQUFLRyxHQUFMLENBQVNDLEtBQVQsQ0FBZUMsSUFBZixLQUF3QkwsS0FBS0csR0FBTCxDQUFTRyxHQUFULENBQWFELElBQXpDLEVBQStDO0FBQzdDOEIscUJBQVMsQ0FBVDtBQUNEOztBQUVEWixrQkFBUWEsTUFBUixDQUFlO0FBQ2JqQyxpQkFBSztBQUNIRSxvQkFBTUwsS0FBS0csR0FBTCxDQUFTRyxHQUFULENBQWFELElBRGhCO0FBRUg4Qiw0QkFGRyxFQURROztBQUtiRSwwQ0FBcUJYLFFBQVFHLEtBQTdCLHFCQUFnREgsUUFBUUcsS0FBUixHQUFnQixDQUFoQixHQUFvQixHQUFwQixHQUEwQixFQUExRSx1QkFBc0ZsQyxJQUF0RixtREFBZ0lBLElBQWhJLE9BTGE7QUFNYjJDLDhCQUFLLDRCQUFTQyxNQUFNQyxlQUFOO0FBQ1p4QyxvQkFEWTtBQUVaLHFCQUFLeUMsTUFBTCxDQUFZUCwyQkFBMkJELGNBQXZDLENBRlksQ0FBVCxFQUFMLGNBTmEsRUFBZjs7O0FBV0Q7QUFDRjs7QUFFRCxlQUFTUyxrQkFBVCxDQUE0QjFDLElBQTVCLEVBQWtDMkMsV0FBbEMsRUFBK0M7QUFDN0MsWUFBTVYsaUJBQWlCaEMsa0JBQWtCRCxJQUFsQixFQUF3QjJDLFdBQXhCLENBQXZCO0FBQ0EsWUFBTVQsMkJBQTJCUixRQUFRRyxLQUFSLEdBQWdCLENBQWpEOztBQUVBLFlBQUlJLGlCQUFpQkMsd0JBQXJCLEVBQStDO0FBQzdDLGNBQUlDLFNBQVNuQyxLQUFLRyxHQUFMLENBQVNDLEtBQVQsQ0FBZStCLE1BQTVCOztBQUVBLGNBQUluQyxLQUFLRyxHQUFMLENBQVNDLEtBQVQsQ0FBZUMsSUFBZixLQUF3QkwsS0FBS0csR0FBTCxDQUFTRyxHQUFULENBQWFELElBQXpDLEVBQStDO0FBQzdDOEIscUJBQVMsQ0FBVDtBQUNEOztBQUVEWixrQkFBUWEsTUFBUixDQUFlO0FBQ2JqQyxpQkFBSztBQUNIRSxvQkFBTUwsS0FBS0csR0FBTCxDQUFTRyxHQUFULENBQWFELElBRGhCO0FBRUg4Qiw0QkFGRyxFQURROztBQUtiRSwwQ0FBcUJYLFFBQVFHLEtBQTdCLHFCQUFnREgsUUFBUUcsS0FBUixHQUFnQixDQUFoQixHQUFvQixHQUFwQixHQUEwQixFQUExRSw2REFMYTtBQU1iUyw4QkFBSyw0QkFBU0MsTUFBTUMsZUFBTjtBQUNaeEMsb0JBRFk7QUFFWixxQkFBS3lDLE1BQUwsQ0FBWVAsMkJBQTJCRCxjQUF2QyxDQUZZLENBQVQsRUFBTCxjQU5hLEVBQWY7OztBQVdEO0FBQ0Y7O0FBRUQsZUFBU1csY0FBVCxHQUEwQjtBQUN4QnBCO0FBQ0Q7QUFDRCxlQUFTcUIsY0FBVCxHQUEwQjtBQUN4QnJCO0FBQ0Q7O0FBRUQsZUFBU3NCLFdBQVQsQ0FBcUI5QyxJQUFyQixFQUEyQjtBQUNqQitDLGNBRGlCLEdBQ04vQyxJQURNLENBQ2pCK0MsTUFEaUI7QUFFekIsWUFBTUMsZUFBZUQsT0FBT25ELElBQVAsQ0FBWXFELE9BQVosQ0FBb0JqRCxJQUFwQixDQUFyQjtBQUNBLFlBQU1FLFdBQVc2QyxPQUFPbkQsSUFBUCxDQUFZb0QsZUFBZSxDQUEzQixDQUFqQjtBQUNBLFlBQU1FLFVBQVVsRCxLQUFLRyxHQUFMLENBQVNHLEdBQVQsQ0FBYUQsSUFBN0I7QUFDQSxZQUFJc0Msb0JBQUo7O0FBRUEsWUFBSSxPQUFPSSxPQUFPSSxRQUFkLEtBQTJCLFdBQTNCLElBQTBDekIsUUFBUUksZ0JBQXRELEVBQXdFO0FBQ3RFYSx3QkFBY0ksT0FBT0ksUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUIscUJBQUtDLEVBQUVsRCxHQUFGLENBQU1DLEtBQU4sQ0FBWUMsSUFBWixLQUFxQjZDLFVBQVUsQ0FBcEMsRUFBckIsQ0FBZDtBQUNEOzs7QUFHRDtBQUNBLFlBQUlsRCxLQUFLTCxJQUFMLEtBQWMsMkJBQWQsSUFBNkNLLEtBQUtzRCxRQUF0RCxFQUFnRTtBQUM5RDtBQUNEOztBQUVELFlBQUlYLGVBQWUsT0FBT0EsV0FBUCxLQUF1QixXQUExQyxFQUF1RDtBQUNyREQsNkJBQW1CMUMsSUFBbkIsRUFBeUIyQyxXQUF6QjtBQUNELFNBRkQsTUFFTyxJQUFJekMsWUFBWUEsU0FBU1AsSUFBVCxLQUFrQixtQkFBOUIsS0FBc0RPLFNBQVNQLElBQVQsS0FBa0IsMkJBQWxCLElBQWlETyxTQUFTb0QsUUFBaEgsQ0FBSixFQUErSDtBQUNwSXZCLDBCQUFnQi9CLElBQWhCLEVBQXNCRSxRQUF0QixFQUFnQyxRQUFoQztBQUNEO0FBQ0Y7O0FBRUQsYUFBTztBQUNMcUQsMkJBQW1CVCxXQURkO0FBRUxVLG1DQUEyQlYsV0FGdEI7QUFHTFcsc0JBSEssdUNBR1V6RCxJQUhWLEVBR2dCO0FBQ25CLGdCQUFJLGdDQUFnQkEsSUFBaEIsS0FBeUJ3QixVQUFVLENBQXZDLEVBQTBDO0FBQ3hDQywyQkFBYWlDLElBQWIsQ0FBa0IxRCxJQUFsQjtBQUNEO0FBQ0YsV0FQSTtBQVFMLHFDQUFnQix1QkFBWTtBQUMxQmIsZ0JBQUkscUJBQUosRUFBMkJvQyxRQUFRb0MsbUJBQVIsR0FBOEJwQyxRQUFRb0MsbUJBQVIsRUFBOUIsR0FBOERwQyxRQUFRcUMsV0FBUixFQUF6RjtBQUNBLGdCQUFNQyxZQUFZckUsYUFBYStCLFFBQVF1QyxRQUFSLEVBQWIsQ0FBbEI7QUFDQTNFLGdCQUFJLFlBQUosRUFBa0IwRSxTQUFsQjs7QUFFQXBDLHlCQUFhc0MsT0FBYixDQUFxQixVQUFVL0QsSUFBVixFQUFnQmdFLEtBQWhCLEVBQXVCO0FBQzFDLGtCQUFNaEIsZUFBZW5ELHlCQUF5QmdFLFNBQXpCLEVBQW9DN0QsSUFBcEMsQ0FBckI7QUFDQWIsa0JBQUkseUJBQUosRUFBK0I2RCxZQUEvQjs7QUFFQSxrQkFBTWlCLDJCQUEyQkosVUFBVWIsWUFBVixDQUFqQztBQUNBLGtCQUFNa0IsZ0JBQWdCTCxVQUFVYixlQUFlLENBQXpCLENBQXRCO0FBQ0Esa0JBQU1tQixrQkFBa0IxQyxhQUFhdUMsUUFBUSxDQUFyQixDQUF4Qjs7QUFFQSxrQkFBSUcsbUJBQW1CL0Usb0JBQW9CNkUsd0JBQXBCLEVBQThDRSxlQUE5QyxDQUF2QixFQUF1RjtBQUNyRjtBQUNEOztBQUVELGtCQUFJRDtBQUNBLGVBQUNDLGVBQUQsSUFBb0IsQ0FBQy9FLG9CQUFvQjhFLGFBQXBCLEVBQW1DQyxlQUFuQyxDQURyQixDQUFKLEVBQytFOztBQUU3RXBDLGdDQUFnQmtDLHdCQUFoQixFQUEwQ0MsYUFBMUMsRUFBeUQsU0FBekQ7QUFDRDtBQUNGLGFBakJEO0FBa0JELFdBdkJELHNCQVJLO0FBZ0NMRSw2QkFBcUJ4QixjQWhDaEI7QUFpQ0x5Qiw0QkFBb0J6QixjQWpDZjtBQWtDTDBCLGlDQUF5QjFCLGNBbENwQjtBQW1DTDJCLHdCQUFnQjNCLGNBbkNYO0FBb0NMNEIsMEJBQWtCNUIsY0FwQ2I7QUFxQ0w2QixtQkFBVzdCLGNBckNOO0FBc0NMLG9DQUE0QkMsY0F0Q3ZCO0FBdUNMLG1DQUEyQkEsY0F2Q3RCO0FBd0NMLHdDQUFnQ0EsY0F4QzNCO0FBeUNMLCtCQUF1QkEsY0F6Q2xCO0FBMENMLGlDQUF5QkEsY0ExQ3BCO0FBMkNMLDBCQUFrQkEsY0EzQ2IsRUFBUDs7QUE2Q0QsS0FwS2MsbUJBQWpCIiwiZmlsZSI6Im5ld2xpbmUtYWZ0ZXItaW1wb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJ1bGUgdG8gZW5mb3JjZSBuZXcgbGluZSBhZnRlciBpbXBvcnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgaW1wb3J0LlxuICogQGF1dGhvciBSYWRlayBCZW5rZWxcbiAqL1xuXG5pbXBvcnQgaXNTdGF0aWNSZXF1aXJlIGZyb20gJy4uL2NvcmUvc3RhdGljUmVxdWlyZSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmNvbnN0IGxvZyA9IGRlYnVnKCdlc2xpbnQtcGx1Z2luLWltcG9ydDpydWxlczpuZXdsaW5lLWFmdGVyLWltcG9ydCcpO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjb250YWluc05vZGVPckVxdWFsKG91dGVyTm9kZSwgaW5uZXJOb2RlKSB7XG4gIHJldHVybiBvdXRlck5vZGUucmFuZ2VbMF0gPD0gaW5uZXJOb2RlLnJhbmdlWzBdICYmIG91dGVyTm9kZS5yYW5nZVsxXSA+PSBpbm5lck5vZGUucmFuZ2VbMV07XG59XG5cbmZ1bmN0aW9uIGdldFNjb3BlQm9keShzY29wZSkge1xuICBpZiAoc2NvcGUuYmxvY2sudHlwZSA9PT0gJ1N3aXRjaFN0YXRlbWVudCcpIHtcbiAgICBsb2coJ1N3aXRjaFN0YXRlbWVudCBzY29wZXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgeyBib2R5IH0gPSBzY29wZS5ibG9jaztcbiAgaWYgKGJvZHkgJiYgYm9keS50eXBlID09PSAnQmxvY2tTdGF0ZW1lbnQnKSB7XG4gICAgcmV0dXJuIGJvZHkuYm9keTtcbiAgfVxuXG4gIHJldHVybiBib2R5O1xufVxuXG5mdW5jdGlvbiBmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkoYm9keSwgbm9kZVRvRmluZCkge1xuICByZXR1cm4gYm9keS5maW5kSW5kZXgoKG5vZGUpID0+IGNvbnRhaW5zTm9kZU9yRXF1YWwobm9kZSwgbm9kZVRvRmluZCkpO1xufVxuXG5mdW5jdGlvbiBnZXRMaW5lRGlmZmVyZW5jZShub2RlLCBuZXh0Tm9kZSkge1xuICByZXR1cm4gbmV4dE5vZGUubG9jLnN0YXJ0LmxpbmUgLSBub2RlLmxvYy5lbmQubGluZTtcbn1cblxuZnVuY3Rpb24gaXNDbGFzc1dpdGhEZWNvcmF0b3Iobm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnQ2xhc3NEZWNsYXJhdGlvbicgJiYgbm9kZS5kZWNvcmF0b3JzICYmIG5vZGUuZGVjb3JhdG9ycy5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGlzRXhwb3J0RGVmYXVsdENsYXNzKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicgJiYgbm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnQ2xhc3NEZWNsYXJhdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzRXhwb3J0TmFtZUNsYXNzKG5vZGUpIHtcblxuICByZXR1cm4gbm9kZS50eXBlID09PSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicgJiYgbm9kZS5kZWNsYXJhdGlvbiAmJiBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdDbGFzc0RlY2xhcmF0aW9uJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnbGF5b3V0JyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0eWxlIGd1aWRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5mb3JjZSBhIG5ld2xpbmUgYWZ0ZXIgaW1wb3J0IHN0YXRlbWVudHMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbmV3bGluZS1hZnRlci1pbXBvcnQnKSxcbiAgICB9LFxuICAgIGZpeGFibGU6ICd3aGl0ZXNwYWNlJyxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgJ3R5cGUnOiAnb2JqZWN0JyxcbiAgICAgICAgJ3Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ2NvdW50Jzoge1xuICAgICAgICAgICAgJ3R5cGUnOiAnaW50ZWdlcicsXG4gICAgICAgICAgICAnbWluaW11bSc6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnY29uc2lkZXJDb21tZW50cyc6IHsgJ3R5cGUnOiAnYm9vbGVhbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJzogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgbGV0IGxldmVsID0gMDtcbiAgICBjb25zdCByZXF1aXJlQ2FsbHMgPSBbXTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNvdW50OiAxLCBjb25zaWRlckNvbW1lbnRzOiBmYWxzZSB9LCBjb250ZXh0Lm9wdGlvbnNbMF0pO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCB0eXBlKSB7XG4gICAgICBpZiAoaXNFeHBvcnREZWZhdWx0Q2xhc3MobmV4dE5vZGUpIHx8IGlzRXhwb3J0TmFtZUNsYXNzKG5leHROb2RlKSkge1xuICAgICAgICBjb25zdCBjbGFzc05vZGUgPSBuZXh0Tm9kZS5kZWNsYXJhdGlvbjtcblxuICAgICAgICBpZiAoaXNDbGFzc1dpdGhEZWNvcmF0b3IoY2xhc3NOb2RlKSkge1xuICAgICAgICAgIG5leHROb2RlID0gY2xhc3NOb2RlLmRlY29yYXRvcnNbMF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNDbGFzc1dpdGhEZWNvcmF0b3IobmV4dE5vZGUpKSB7XG4gICAgICAgIG5leHROb2RlID0gbmV4dE5vZGUuZGVjb3JhdG9yc1swXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGluZURpZmZlcmVuY2UgPSBnZXRMaW5lRGlmZmVyZW5jZShub2RlLCBuZXh0Tm9kZSk7XG4gICAgICBjb25zdCBFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UgPSBvcHRpb25zLmNvdW50ICsgMTtcblxuICAgICAgaWYgKGxpbmVEaWZmZXJlbmNlIDwgRVhQRUNURURfTElORV9ESUZGRVJFTkNFKSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBub2RlLmxvYy5zdGFydC5jb2x1bW47XG5cbiAgICAgICAgaWYgKG5vZGUubG9jLnN0YXJ0LmxpbmUgIT09IG5vZGUubG9jLmVuZC5saW5lKSB7XG4gICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBsb2M6IHtcbiAgICAgICAgICAgIGxpbmU6IG5vZGUubG9jLmVuZC5saW5lLFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkICR7b3B0aW9ucy5jb3VudH0gZW1wdHkgbGluZSR7b3B0aW9ucy5jb3VudCA+IDEgPyAncycgOiAnJ30gYWZ0ZXIgJHt0eXBlfSBzdGF0ZW1lbnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgJHt0eXBlfS5gLFxuICAgICAgICAgIGZpeDogZml4ZXIgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICdcXG4nLnJlcGVhdChFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UgLSBsaW5lRGlmZmVyZW5jZSksXG4gICAgICAgICAgKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWVudEFmdGVySW1wb3J0KG5vZGUsIG5leHRDb21tZW50KSB7XG4gICAgICBjb25zdCBsaW5lRGlmZmVyZW5jZSA9IGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHRDb21tZW50KTtcbiAgICAgIGNvbnN0IEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSA9IG9wdGlvbnMuY291bnQgKyAxO1xuXG4gICAgICBpZiAobGluZURpZmZlcmVuY2UgPCBFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5vZGUubG9jLnN0YXJ0LmNvbHVtbjtcblxuICAgICAgICBpZiAobm9kZS5sb2Muc3RhcnQubGluZSAhPT0gbm9kZS5sb2MuZW5kLmxpbmUpIHtcbiAgICAgICAgICBjb2x1bW4gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIGxvYzoge1xuICAgICAgICAgICAgbGluZTogbm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgJHtvcHRpb25zLmNvdW50fSBlbXB0eSBsaW5lJHtvcHRpb25zLmNvdW50ID4gMSA/ICdzJyA6ICcnfSBhZnRlciBpbXBvcnQgc3RhdGVtZW50IG5vdCBmb2xsb3dlZCBieSBhbm90aGVyIGltcG9ydC5gLFxuICAgICAgICAgIGZpeDogZml4ZXIgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICdcXG4nLnJlcGVhdChFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UgLSBsaW5lRGlmZmVyZW5jZSksXG4gICAgICAgICAgKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5jcmVtZW50TGV2ZWwoKSB7XG4gICAgICBsZXZlbCsrO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZWNyZW1lbnRMZXZlbCgpIHtcbiAgICAgIGxldmVsLS07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJbXBvcnQobm9kZSkge1xuICAgICAgY29uc3QgeyBwYXJlbnQgfSA9IG5vZGU7XG4gICAgICBjb25zdCBub2RlUG9zaXRpb24gPSBwYXJlbnQuYm9keS5pbmRleE9mKG5vZGUpO1xuICAgICAgY29uc3QgbmV4dE5vZGUgPSBwYXJlbnQuYm9keVtub2RlUG9zaXRpb24gKyAxXTtcbiAgICAgIGNvbnN0IGVuZExpbmUgPSBub2RlLmxvYy5lbmQubGluZTtcbiAgICAgIGxldCBuZXh0Q29tbWVudDtcblxuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQuY29tbWVudHMgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMuY29uc2lkZXJDb21tZW50cykge1xuICAgICAgICBuZXh0Q29tbWVudCA9IHBhcmVudC5jb21tZW50cy5maW5kKG8gPT4gby5sb2Muc3RhcnQubGluZSA9PT0gZW5kTGluZSArIDEpO1xuICAgICAgfVxuXG5cbiAgICAgIC8vIHNraXAgXCJleHBvcnQgaW1wb3J0XCJzXG4gICAgICBpZiAobm9kZS50eXBlID09PSAnVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbicgJiYgbm9kZS5pc0V4cG9ydCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0Q29tbWVudCAmJiB0eXBlb2YgbmV4dENvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbW1lbnRBZnRlckltcG9ydChub2RlLCBuZXh0Q29tbWVudCk7XG4gICAgICB9IGVsc2UgaWYgKG5leHROb2RlICYmIG5leHROb2RlLnR5cGUgIT09ICdJbXBvcnREZWNsYXJhdGlvbicgJiYgKG5leHROb2RlLnR5cGUgIT09ICdUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uJyB8fCBuZXh0Tm9kZS5pc0V4cG9ydCkpIHtcbiAgICAgICAgY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCAnaW1wb3J0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBjaGVja0ltcG9ydCxcbiAgICAgIFRTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb246IGNoZWNrSW1wb3J0LFxuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoaXNTdGF0aWNSZXF1aXJlKG5vZGUpICYmIGxldmVsID09PSAwKSB7XG4gICAgICAgICAgcmVxdWlyZUNhbGxzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2coJ2V4aXQgcHJvY2Vzc2luZyBmb3InLCBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG4gICAgICAgIGNvbnN0IHNjb3BlQm9keSA9IGdldFNjb3BlQm9keShjb250ZXh0LmdldFNjb3BlKCkpO1xuICAgICAgICBsb2coJ2dvdCBzY29wZTonLCBzY29wZUJvZHkpO1xuXG4gICAgICAgIHJlcXVpcmVDYWxscy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlLCBpbmRleCkge1xuICAgICAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IGZpbmROb2RlSW5kZXhJblNjb3BlQm9keShzY29wZUJvZHksIG5vZGUpO1xuICAgICAgICAgIGxvZygnbm9kZSBwb3NpdGlvbiBpbiBzY29wZTonLCBub2RlUG9zaXRpb24pO1xuXG4gICAgICAgICAgY29uc3Qgc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsID0gc2NvcGVCb2R5W25vZGVQb3NpdGlvbl07XG4gICAgICAgICAgY29uc3QgbmV4dFN0YXRlbWVudCA9IHNjb3BlQm9keVtub2RlUG9zaXRpb24gKyAxXTtcbiAgICAgICAgICBjb25zdCBuZXh0UmVxdWlyZUNhbGwgPSByZXF1aXJlQ2FsbHNbaW5kZXggKyAxXTtcblxuICAgICAgICAgIGlmIChuZXh0UmVxdWlyZUNhbGwgJiYgY29udGFpbnNOb2RlT3JFcXVhbChzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRSZXF1aXJlQ2FsbCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV4dFN0YXRlbWVudCAmJlxuICAgICAgICAgICAgICghbmV4dFJlcXVpcmVDYWxsIHx8ICFjb250YWluc05vZGVPckVxdWFsKG5leHRTdGF0ZW1lbnQsIG5leHRSZXF1aXJlQ2FsbCkpKSB7XG5cbiAgICAgICAgICAgIGNoZWNrRm9yTmV3TGluZShzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRTdGF0ZW1lbnQsICdyZXF1aXJlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIEZ1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBCbG9ja1N0YXRlbWVudDogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBPYmplY3RFeHByZXNzaW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIERlY29yYXRvcjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25EZWNsYXJhdGlvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25FeHByZXNzaW9uOmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnQmxvY2tTdGF0ZW1lbnQ6ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ09iamVjdEV4cHJlc3Npb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0RlY29yYXRvcjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=