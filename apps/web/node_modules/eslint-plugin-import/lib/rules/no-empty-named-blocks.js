'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getEmptyBlockRange(tokens, index) {
  var token = tokens[index];
  var nextToken = tokens[index + 1];
  var prevToken = tokens[index - 1];
  var start = token.range[0];
  var end = nextToken.range[1];

  // Remove block tokens and the previous comma
  if (prevToken.value === ',' || prevToken.value === 'type' || prevToken.value === 'typeof') {
    start = prevToken.range[0];
  }

  return [start, end];
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid empty named import blocks.',
      url: (0, _docsUrl2['default'])('no-empty-named-blocks') },

    fixable: 'code',
    schema: [],
    hasSuggestions: true },


  create: function () {function create(context) {
      var importsWithoutNameds = [];

      return {
        ImportDeclaration: function () {function ImportDeclaration(node) {
            if (!node.specifiers.some(function (x) {return x.type === 'ImportSpecifier';})) {
              importsWithoutNameds.push(node);
            }
          }return ImportDeclaration;}(),

        'Program:exit': function () {function ProgramExit(program) {
            var importsTokens = importsWithoutNameds.map(function (node) {
              return [node, program.tokens.filter(function (x) {return x.range[0] >= node.range[0] && x.range[1] <= node.range[1];})];
            });

            importsTokens.forEach(function (_ref) {var _ref2 = _slicedToArray(_ref, 2),node = _ref2[0],tokens = _ref2[1];
              tokens.forEach(function (token) {
                var idx = program.tokens.indexOf(token);
                var nextToken = program.tokens[idx + 1];

                if (nextToken && token.value === '{' && nextToken.value === '}') {
                  var hasOtherIdentifiers = tokens.some(function (token) {return (
                      token.type === 'Identifier' &&
                      token.value !== 'from' &&
                      token.value !== 'type' &&
                      token.value !== 'typeof');});


                  // If it has no other identifiers it's the only thing in the import, so we can either remove the import
                  // completely or transform it in a side-effects only import
                  if (!hasOtherIdentifiers) {
                    context.report({
                      node: node,
                      message: 'Unexpected empty named import block',
                      suggest: [
                      {
                        desc: 'Remove unused import',
                        fix: function () {function fix(fixer) {
                            // Remove the whole import
                            return fixer.remove(node);
                          }return fix;}() },

                      {
                        desc: 'Remove empty import block',
                        fix: function () {function fix(fixer) {
                            // Remove the empty block and the 'from' token, leaving the import only for its side
                            // effects, e.g. `import 'mod'`
                            var sourceCode = context.getSourceCode();
                            var fromToken = program.tokens.find(function (t) {return t.value === 'from';});
                            var importToken = program.tokens.find(function (t) {return t.value === 'import';});
                            var hasSpaceAfterFrom = sourceCode.isSpaceBetween(fromToken, sourceCode.getTokenAfter(fromToken));
                            var hasSpaceAfterImport = sourceCode.isSpaceBetween(importToken, sourceCode.getTokenAfter(fromToken));var _getEmptyBlockRange =

                            getEmptyBlockRange(program.tokens, idx),_getEmptyBlockRange2 = _slicedToArray(_getEmptyBlockRange, 1),start = _getEmptyBlockRange2[0];var _fromToken$range = _slicedToArray(
                            fromToken.range, 2),end = _fromToken$range[1];
                            var range = [start, hasSpaceAfterFrom ? end + 1 : end];

                            return fixer.replaceTextRange(range, hasSpaceAfterImport ? '' : ' ');
                          }return fix;}() }] });



                  } else {
                    context.report({
                      node: node,
                      message: 'Unexpected empty named import block',
                      fix: function () {function fix(fixer) {
                          return fixer.removeRange(getEmptyBlockRange(program.tokens, idx));
                        }return fix;}() });

                  }
                }
              });
            });
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1lbXB0eS1uYW1lZC1ibG9ja3MuanMiXSwibmFtZXMiOlsiZ2V0RW1wdHlCbG9ja1JhbmdlIiwidG9rZW5zIiwiaW5kZXgiLCJ0b2tlbiIsIm5leHRUb2tlbiIsInByZXZUb2tlbiIsInN0YXJ0IiwicmFuZ2UiLCJlbmQiLCJ2YWx1ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsImhhc1N1Z2dlc3Rpb25zIiwiY3JlYXRlIiwiY29udGV4dCIsImltcG9ydHNXaXRob3V0TmFtZWRzIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJub2RlIiwic3BlY2lmaWVycyIsInNvbWUiLCJ4IiwicHVzaCIsInByb2dyYW0iLCJpbXBvcnRzVG9rZW5zIiwibWFwIiwiZmlsdGVyIiwiZm9yRWFjaCIsImlkeCIsImluZGV4T2YiLCJoYXNPdGhlcklkZW50aWZpZXJzIiwicmVwb3J0IiwibWVzc2FnZSIsInN1Z2dlc3QiLCJkZXNjIiwiZml4IiwiZml4ZXIiLCJyZW1vdmUiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsImZyb21Ub2tlbiIsImZpbmQiLCJ0IiwiaW1wb3J0VG9rZW4iLCJoYXNTcGFjZUFmdGVyRnJvbSIsImlzU3BhY2VCZXR3ZWVuIiwiZ2V0VG9rZW5BZnRlciIsImhhc1NwYWNlQWZ0ZXJJbXBvcnQiLCJyZXBsYWNlVGV4dFJhbmdlIiwicmVtb3ZlUmFuZ2UiXSwibWFwcGluZ3MiOiJxb0JBQUEscUM7O0FBRUEsU0FBU0Esa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxLQUFwQyxFQUEyQztBQUN6QyxNQUFNQyxRQUFRRixPQUFPQyxLQUFQLENBQWQ7QUFDQSxNQUFNRSxZQUFZSCxPQUFPQyxRQUFRLENBQWYsQ0FBbEI7QUFDQSxNQUFNRyxZQUFZSixPQUFPQyxRQUFRLENBQWYsQ0FBbEI7QUFDQSxNQUFJSSxRQUFRSCxNQUFNSSxLQUFOLENBQVksQ0FBWixDQUFaO0FBQ0EsTUFBTUMsTUFBTUosVUFBVUcsS0FBVixDQUFnQixDQUFoQixDQUFaOztBQUVBO0FBQ0EsTUFBSUYsVUFBVUksS0FBVixLQUFvQixHQUFwQixJQUEwQkosVUFBVUksS0FBVixLQUFvQixNQUE5QyxJQUF3REosVUFBVUksS0FBVixLQUFvQixRQUFoRixFQUEwRjtBQUN4RkgsWUFBUUQsVUFBVUUsS0FBVixDQUFnQixDQUFoQixDQUFSO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDRCxLQUFELEVBQVFFLEdBQVIsQ0FBUDtBQUNEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsa0JBRE47QUFFSkMsbUJBQWEsbUNBRlQ7QUFHSkMsV0FBSywwQkFBUSx1QkFBUixDQUhELEVBRkY7O0FBT0pDLGFBQVMsTUFQTDtBQVFKQyxZQUFRLEVBUko7QUFTSkMsb0JBQWdCLElBVFosRUFEUzs7O0FBYWZDLFFBYmUsK0JBYVJDLE9BYlEsRUFhQztBQUNkLFVBQU1DLHVCQUF1QixFQUE3Qjs7QUFFQSxhQUFPO0FBQ0xDLHlCQURLLDBDQUNhQyxJQURiLEVBQ21CO0FBQ3RCLGdCQUFJLENBQUNBLEtBQUtDLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLHFCQUFLQyxFQUFFZixJQUFGLEtBQVcsaUJBQWhCLEVBQXJCLENBQUwsRUFBOEQ7QUFDNURVLG1DQUFxQk0sSUFBckIsQ0FBMEJKLElBQTFCO0FBQ0Q7QUFDRixXQUxJOztBQU9MLHFDQUFnQixxQkFBVUssT0FBVixFQUFtQjtBQUNqQyxnQkFBTUMsZ0JBQWdCUixxQkFBcUJTLEdBQXJCLENBQXlCLFVBQUNQLElBQUQsRUFBVTtBQUN2RCxxQkFBTyxDQUFDQSxJQUFELEVBQU9LLFFBQVE3QixNQUFSLENBQWVnQyxNQUFmLENBQXNCLHFCQUFLTCxFQUFFckIsS0FBRixDQUFRLENBQVIsS0FBY2tCLEtBQUtsQixLQUFMLENBQVcsQ0FBWCxDQUFkLElBQStCcUIsRUFBRXJCLEtBQUYsQ0FBUSxDQUFSLEtBQWNrQixLQUFLbEIsS0FBTCxDQUFXLENBQVgsQ0FBbEQsRUFBdEIsQ0FBUCxDQUFQO0FBQ0QsYUFGcUIsQ0FBdEI7O0FBSUF3QiwwQkFBY0csT0FBZCxDQUFzQixnQkFBb0IscUNBQWxCVCxJQUFrQixZQUFaeEIsTUFBWTtBQUN4Q0EscUJBQU9pQyxPQUFQLENBQWUsVUFBQy9CLEtBQUQsRUFBVztBQUN4QixvQkFBTWdDLE1BQU1MLFFBQVE3QixNQUFSLENBQWVtQyxPQUFmLENBQXVCakMsS0FBdkIsQ0FBWjtBQUNBLG9CQUFNQyxZQUFZMEIsUUFBUTdCLE1BQVIsQ0FBZWtDLE1BQU0sQ0FBckIsQ0FBbEI7O0FBRUEsb0JBQUkvQixhQUFhRCxNQUFNTSxLQUFOLEtBQWdCLEdBQTdCLElBQW9DTCxVQUFVSyxLQUFWLEtBQW9CLEdBQTVELEVBQWlFO0FBQy9ELHNCQUFNNEIsc0JBQXNCcEMsT0FBTzBCLElBQVAsQ0FBWSxVQUFDeEIsS0FBRDtBQUN0Q0EsNEJBQU1VLElBQU4sS0FBZSxZQUFmO0FBQ0tWLDRCQUFNTSxLQUFOLEtBQWdCLE1BRHJCO0FBRUtOLDRCQUFNTSxLQUFOLEtBQWdCLE1BRnJCO0FBR0tOLDRCQUFNTSxLQUFOLEtBQWdCLFFBSmlCLEdBQVosQ0FBNUI7OztBQU9BO0FBQ0E7QUFDQSxzQkFBSSxDQUFDNEIsbUJBQUwsRUFBMEI7QUFDeEJmLDRCQUFRZ0IsTUFBUixDQUFlO0FBQ2JiLGdDQURhO0FBRWJjLCtCQUFTLHFDQUZJO0FBR2JDLCtCQUFTO0FBQ1A7QUFDRUMsOEJBQU0sc0JBRFI7QUFFRUMsMkJBRkYsNEJBRU1DLEtBRk4sRUFFYTtBQUNUO0FBQ0EsbUNBQU9BLE1BQU1DLE1BQU4sQ0FBYW5CLElBQWIsQ0FBUDtBQUNELDJCQUxILGdCQURPOztBQVFQO0FBQ0VnQiw4QkFBTSwyQkFEUjtBQUVFQywyQkFGRiw0QkFFTUMsS0FGTixFQUVhO0FBQ1Q7QUFDQTtBQUNBLGdDQUFNRSxhQUFhdkIsUUFBUXdCLGFBQVIsRUFBbkI7QUFDQSxnQ0FBTUMsWUFBWWpCLFFBQVE3QixNQUFSLENBQWUrQyxJQUFmLENBQW9CLHFCQUFLQyxFQUFFeEMsS0FBRixLQUFZLE1BQWpCLEVBQXBCLENBQWxCO0FBQ0EsZ0NBQU15QyxjQUFjcEIsUUFBUTdCLE1BQVIsQ0FBZStDLElBQWYsQ0FBb0IscUJBQUtDLEVBQUV4QyxLQUFGLEtBQVksUUFBakIsRUFBcEIsQ0FBcEI7QUFDQSxnQ0FBTTBDLG9CQUFvQk4sV0FBV08sY0FBWCxDQUEwQkwsU0FBMUIsRUFBcUNGLFdBQVdRLGFBQVgsQ0FBeUJOLFNBQXpCLENBQXJDLENBQTFCO0FBQ0EsZ0NBQU1PLHNCQUFzQlQsV0FBV08sY0FBWCxDQUEwQkYsV0FBMUIsRUFBdUNMLFdBQVdRLGFBQVgsQ0FBeUJOLFNBQXpCLENBQXZDLENBQTVCLENBUFM7O0FBU08vQywrQ0FBbUI4QixRQUFRN0IsTUFBM0IsRUFBbUNrQyxHQUFuQyxDQVRQLCtEQVNGN0IsS0FURTtBQVVPeUMsc0NBQVV4QyxLQVZqQixLQVVBQyxHQVZBO0FBV1QsZ0NBQU1ELFFBQVEsQ0FBQ0QsS0FBRCxFQUFRNkMsb0JBQW9CM0MsTUFBTSxDQUExQixHQUE4QkEsR0FBdEMsQ0FBZDs7QUFFQSxtQ0FBT21DLE1BQU1ZLGdCQUFOLENBQXVCaEQsS0FBdkIsRUFBOEIrQyxzQkFBc0IsRUFBdEIsR0FBMkIsR0FBekQsQ0FBUDtBQUNELDJCQWhCSCxnQkFSTyxDQUhJLEVBQWY7Ozs7QUErQkQsbUJBaENELE1BZ0NPO0FBQ0xoQyw0QkFBUWdCLE1BQVIsQ0FBZTtBQUNiYixnQ0FEYTtBQUViYywrQkFBUyxxQ0FGSTtBQUdiRyx5QkFIYSw0QkFHVEMsS0FIUyxFQUdGO0FBQ1QsaUNBQU9BLE1BQU1hLFdBQU4sQ0FBa0J4RCxtQkFBbUI4QixRQUFRN0IsTUFBM0IsRUFBbUNrQyxHQUFuQyxDQUFsQixDQUFQO0FBQ0QseUJBTFksZ0JBQWY7O0FBT0Q7QUFDRjtBQUNGLGVBeEREO0FBeURELGFBMUREO0FBMkRELFdBaEVELHNCQVBLLEVBQVA7O0FBeUVELEtBekZjLG1CQUFqQiIsImZpbGUiOiJuby1lbXB0eS1uYW1lZC1ibG9ja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gZ2V0RW1wdHlCbG9ja1JhbmdlKHRva2VucywgaW5kZXgpIHtcbiAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaW5kZXhdO1xuICBjb25zdCBuZXh0VG9rZW4gPSB0b2tlbnNbaW5kZXggKyAxXTtcbiAgY29uc3QgcHJldlRva2VuID0gdG9rZW5zW2luZGV4IC0gMV07XG4gIGxldCBzdGFydCA9IHRva2VuLnJhbmdlWzBdO1xuICBjb25zdCBlbmQgPSBuZXh0VG9rZW4ucmFuZ2VbMV07XG5cbiAgLy8gUmVtb3ZlIGJsb2NrIHRva2VucyBhbmQgdGhlIHByZXZpb3VzIGNvbW1hXG4gIGlmIChwcmV2VG9rZW4udmFsdWUgPT09ICcsJ3x8IHByZXZUb2tlbi52YWx1ZSA9PT0gJ3R5cGUnIHx8IHByZXZUb2tlbi52YWx1ZSA9PT0gJ3R5cGVvZicpIHtcbiAgICBzdGFydCA9IHByZXZUb2tlbi5yYW5nZVswXTtcbiAgfVxuXG4gIHJldHVybiBbc3RhcnQsIGVuZF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBlbXB0eSBuYW1lZCBpbXBvcnQgYmxvY2tzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWVtcHR5LW5hbWVkLWJsb2NrcycpLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW10sXG4gICAgaGFzU3VnZ2VzdGlvbnM6IHRydWUsXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBpbXBvcnRzV2l0aG91dE5hbWVkcyA9IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKCFub2RlLnNwZWNpZmllcnMuc29tZSh4ID0+IHgudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpKSB7XG4gICAgICAgICAgaW1wb3J0c1dpdGhvdXROYW1lZHMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uIChwcm9ncmFtKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydHNUb2tlbnMgPSBpbXBvcnRzV2l0aG91dE5hbWVkcy5tYXAoKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gW25vZGUsIHByb2dyYW0udG9rZW5zLmZpbHRlcih4ID0+IHgucmFuZ2VbMF0gPj0gbm9kZS5yYW5nZVswXSAmJiB4LnJhbmdlWzFdIDw9IG5vZGUucmFuZ2VbMV0pXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW1wb3J0c1Rva2Vucy5mb3JFYWNoKChbbm9kZSwgdG9rZW5zXSkgPT4ge1xuICAgICAgICAgIHRva2Vucy5mb3JFYWNoKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gcHJvZ3JhbS50b2tlbnMuaW5kZXhPZih0b2tlbik7XG4gICAgICAgICAgICBjb25zdCBuZXh0VG9rZW4gPSBwcm9ncmFtLnRva2Vuc1tpZHggKyAxXTtcblxuICAgICAgICAgICAgaWYgKG5leHRUb2tlbiAmJiB0b2tlbi52YWx1ZSA9PT0gJ3snICYmIG5leHRUb2tlbi52YWx1ZSA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGhhc090aGVySWRlbnRpZmllcnMgPSB0b2tlbnMuc29tZSgodG9rZW4pID0+IChcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID09PSAnSWRlbnRpZmllcidcbiAgICAgICAgICAgICAgICAgICYmIHRva2VuLnZhbHVlICE9PSAnZnJvbSdcbiAgICAgICAgICAgICAgICAgICYmIHRva2VuLnZhbHVlICE9PSAndHlwZSdcbiAgICAgICAgICAgICAgICAgICYmIHRva2VuLnZhbHVlICE9PSAndHlwZW9mJ1xuICAgICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgICAvLyBJZiBpdCBoYXMgbm8gb3RoZXIgaWRlbnRpZmllcnMgaXQncyB0aGUgb25seSB0aGluZyBpbiB0aGUgaW1wb3J0LCBzbyB3ZSBjYW4gZWl0aGVyIHJlbW92ZSB0aGUgaW1wb3J0XG4gICAgICAgICAgICAgIC8vIGNvbXBsZXRlbHkgb3IgdHJhbnNmb3JtIGl0IGluIGEgc2lkZS1lZmZlY3RzIG9ubHkgaW1wb3J0XG4gICAgICAgICAgICAgIGlmICghaGFzT3RoZXJJZGVudGlmaWVycykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5leHBlY3RlZCBlbXB0eSBuYW1lZCBpbXBvcnQgYmxvY2snLFxuICAgICAgICAgICAgICAgICAgc3VnZ2VzdDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgZGVzYzogJ1JlbW92ZSB1bnVzZWQgaW1wb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICBmaXgoZml4ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgd2hvbGUgaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZml4ZXIucmVtb3ZlKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZXNjOiAnUmVtb3ZlIGVtcHR5IGltcG9ydCBibG9jaycsXG4gICAgICAgICAgICAgICAgICAgICAgZml4KGZpeGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGVtcHR5IGJsb2NrIGFuZCB0aGUgJ2Zyb20nIHRva2VuLCBsZWF2aW5nIHRoZSBpbXBvcnQgb25seSBmb3IgaXRzIHNpZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVmZmVjdHMsIGUuZy4gYGltcG9ydCAnbW9kJ2BcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb21Ub2tlbiA9IHByb2dyYW0udG9rZW5zLmZpbmQodCA9PiB0LnZhbHVlID09PSAnZnJvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0VG9rZW4gPSBwcm9ncmFtLnRva2Vucy5maW5kKHQgPT4gdC52YWx1ZSA9PT0gJ2ltcG9ydCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzU3BhY2VBZnRlckZyb20gPSBzb3VyY2VDb2RlLmlzU3BhY2VCZXR3ZWVuKGZyb21Ub2tlbiwgc291cmNlQ29kZS5nZXRUb2tlbkFmdGVyKGZyb21Ub2tlbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzU3BhY2VBZnRlckltcG9ydCA9IHNvdXJjZUNvZGUuaXNTcGFjZUJldHdlZW4oaW1wb3J0VG9rZW4sIHNvdXJjZUNvZGUuZ2V0VG9rZW5BZnRlcihmcm9tVG9rZW4pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW3N0YXJ0XSA9IGdldEVtcHR5QmxvY2tSYW5nZShwcm9ncmFtLnRva2VucywgaWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFssIGVuZF0gPSBmcm9tVG9rZW4ucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IFtzdGFydCwgaGFzU3BhY2VBZnRlckZyb20gPyBlbmQgKyAxIDogZW5kXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UocmFuZ2UsIGhhc1NwYWNlQWZ0ZXJJbXBvcnQgPyAnJyA6ICcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmV4cGVjdGVkIGVtcHR5IG5hbWVkIGltcG9ydCBibG9jaycsXG4gICAgICAgICAgICAgICAgICBmaXgoZml4ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpeGVyLnJlbW92ZVJhbmdlKGdldEVtcHR5QmxvY2tSYW5nZShwcm9ncmFtLnRva2VucywgaWR4KSk7XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==