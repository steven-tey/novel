'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isComma(token) {
  return token.type === 'Punctuator' && token.value === ',';
}

function removeSpecifiers(fixes, fixer, sourceCode, specifiers) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = specifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var specifier = _step.value;
      // remove the trailing comma
      var comma = sourceCode.getTokenAfter(specifier, isComma);
      if (comma) {
        fixes.push(fixer.remove(comma));
      }
      fixes.push(fixer.remove(specifier));
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
}

function getImportText(
node,
sourceCode,
specifiers,
kind)
{
  var sourceString = sourceCode.getText(node.source);
  if (specifiers.length === 0) {
    return '';
  }

  var names = specifiers.map(function (s) {
    if (s.imported.name === s.local.name) {
      return s.imported.name;
    }
    return String(s.imported.name) + ' as ' + String(s.local.name);
  });
  // insert a fresh top-level import
  return 'import ' + String(kind) + ' {' + String(names.join(', ')) + '} from ' + String(sourceString) + ';';
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce or ban the use of inline type-only markers for named imports.',
      url: (0, _docsUrl2['default'])('consistent-type-specifier-style') },

    fixable: 'code',
    schema: [
    {
      type: 'string',
      'enum': ['prefer-inline', 'prefer-top-level'],
      'default': 'prefer-inline' }] },




  create: function () {function create(context) {
      var sourceCode = context.getSourceCode();

      if (context.options[0] === 'prefer-inline') {
        return {
          ImportDeclaration: function () {function ImportDeclaration(node) {
              if (node.importKind === 'value' || node.importKind == null) {
                // top-level value / unknown is valid
                return;
              }

              if (
              // no specifiers (import type {} from '') have no specifiers to mark as inline
              node.specifiers.length === 0 ||
              node.specifiers.length === 1 && (
              // default imports are both "inline" and "top-level"
              node.specifiers[0].type === 'ImportDefaultSpecifier' ||
              // namespace imports are both "inline" and "top-level"
              node.specifiers[0].type === 'ImportNamespaceSpecifier'))
              {
                return;
              }

              context.report({
                node: node,
                message: 'Prefer using inline {{kind}} specifiers instead of a top-level {{kind}}-only import.',
                data: {
                  kind: node.importKind },

                fix: function () {function fix(fixer) {
                    var kindToken = sourceCode.getFirstToken(node, { skip: 1 });

                    return [].concat(
                    kindToken ? fixer.remove(kindToken) : [],
                    node.specifiers.map(function (specifier) {return fixer.insertTextBefore(specifier, String(node.importKind) + ' ');}));

                  }return fix;}() });

            }return ImportDeclaration;}() };

      }

      // prefer-top-level
      return {
        ImportDeclaration: function () {function ImportDeclaration(node) {
            if (
            // already top-level is valid
            node.importKind === 'type' ||
            node.importKind === 'typeof' ||
            // no specifiers (import {} from '') cannot have inline - so is valid
            node.specifiers.length === 0 ||
            node.specifiers.length === 1 && (
            // default imports are both "inline" and "top-level"
            node.specifiers[0].type === 'ImportDefaultSpecifier' ||
            // namespace imports are both "inline" and "top-level"
            node.specifiers[0].type === 'ImportNamespaceSpecifier'))
            {
              return;
            }

            var typeSpecifiers = [];
            var typeofSpecifiers = [];
            var valueSpecifiers = [];
            var defaultSpecifier = null;var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
              for (var _iterator2 = node.specifiers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var specifier = _step2.value;
                if (specifier.type === 'ImportDefaultSpecifier') {
                  defaultSpecifier = specifier;
                  continue;
                }

                if (specifier.importKind === 'type') {
                  typeSpecifiers.push(specifier);
                } else if (specifier.importKind === 'typeof') {
                  typeofSpecifiers.push(specifier);
                } else if (specifier.importKind === 'value' || specifier.importKind == null) {
                  valueSpecifiers.push(specifier);
                }
              }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}

            var typeImport = getImportText(node, sourceCode, typeSpecifiers, 'type');
            var typeofImport = getImportText(node, sourceCode, typeofSpecifiers, 'typeof');
            var newImports = (String(typeImport) + '\n' + String(typeofImport)).trim();

            if (typeSpecifiers.length + typeofSpecifiers.length === node.specifiers.length) {
              // all specifiers have inline specifiers - so we replace the entire import
              var kind = [].concat(
              typeSpecifiers.length > 0 ? 'type' : [],
              typeofSpecifiers.length > 0 ? 'typeof' : []);


              context.report({
                node: node,
                message: 'Prefer using a top-level {{kind}}-only import instead of inline {{kind}} specifiers.',
                data: {
                  kind: kind.join('/') },

                fix: function () {function fix(fixer) {
                    return fixer.replaceText(node, newImports);
                  }return fix;}() });

            } else {
              // remove specific specifiers and insert new imports for them
              var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = typeSpecifiers.concat(typeofSpecifiers)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var _specifier = _step3.value;
                  context.report({
                    node: _specifier,
                    message: 'Prefer using a top-level {{kind}}-only import instead of inline {{kind}} specifiers.',
                    data: {
                      kind: _specifier.importKind },

                    fix: function () {function fix(fixer) {
                        var fixes = [];

                        // if there are no value specifiers, then the other report fixer will be called, not this one

                        if (valueSpecifiers.length > 0) {
                          // import { Value, type Type } from 'mod';

                          // we can just remove the type specifiers
                          removeSpecifiers(fixes, fixer, sourceCode, typeSpecifiers);
                          removeSpecifiers(fixes, fixer, sourceCode, typeofSpecifiers);

                          // make the import nicely formatted by also removing the trailing comma after the last value import
                          // eg
                          // import { Value, type Type } from 'mod';
                          // to
                          // import { Value  } from 'mod';
                          // not
                          // import { Value,  } from 'mod';
                          var maybeComma = sourceCode.getTokenAfter(valueSpecifiers[valueSpecifiers.length - 1]);
                          if (isComma(maybeComma)) {
                            fixes.push(fixer.remove(maybeComma));
                          }
                        } else if (defaultSpecifier) {
                          // import Default, { type Type } from 'mod';

                          // remove the entire curly block so we don't leave an empty one behind
                          // NOTE - the default specifier *must* be the first specifier always!
                          //        so a comma exists that we also have to clean up or else it's bad syntax
                          var comma = sourceCode.getTokenAfter(defaultSpecifier, isComma);
                          var closingBrace = sourceCode.getTokenAfter(
                          node.specifiers[node.specifiers.length - 1],
                          function (token) {return token.type === 'Punctuator' && token.value === '}';});

                          fixes.push(fixer.removeRange([
                          comma.range[0],
                          closingBrace.range[1]]));

                        }

                        return fixes.concat(
                        // insert the new imports after the old declaration
                        fixer.insertTextAfter(node, '\n' + String(newImports)));

                      }return fix;}() });

                }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
            }
          }return ImportDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9jb25zaXN0ZW50LXR5cGUtc3BlY2lmaWVyLXN0eWxlLmpzIl0sIm5hbWVzIjpbImlzQ29tbWEiLCJ0b2tlbiIsInR5cGUiLCJ2YWx1ZSIsInJlbW92ZVNwZWNpZmllcnMiLCJmaXhlcyIsImZpeGVyIiwic291cmNlQ29kZSIsInNwZWNpZmllcnMiLCJzcGVjaWZpZXIiLCJjb21tYSIsImdldFRva2VuQWZ0ZXIiLCJwdXNoIiwicmVtb3ZlIiwiZ2V0SW1wb3J0VGV4dCIsIm5vZGUiLCJraW5kIiwic291cmNlU3RyaW5nIiwiZ2V0VGV4dCIsInNvdXJjZSIsImxlbmd0aCIsIm5hbWVzIiwibWFwIiwicyIsImltcG9ydGVkIiwibmFtZSIsImxvY2FsIiwiam9pbiIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImdldFNvdXJjZUNvZGUiLCJvcHRpb25zIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJpbXBvcnRLaW5kIiwicmVwb3J0IiwibWVzc2FnZSIsImRhdGEiLCJmaXgiLCJraW5kVG9rZW4iLCJnZXRGaXJzdFRva2VuIiwic2tpcCIsImNvbmNhdCIsImluc2VydFRleHRCZWZvcmUiLCJ0eXBlU3BlY2lmaWVycyIsInR5cGVvZlNwZWNpZmllcnMiLCJ2YWx1ZVNwZWNpZmllcnMiLCJkZWZhdWx0U3BlY2lmaWVyIiwidHlwZUltcG9ydCIsInR5cGVvZkltcG9ydCIsIm5ld0ltcG9ydHMiLCJ0cmltIiwicmVwbGFjZVRleHQiLCJtYXliZUNvbW1hIiwiY2xvc2luZ0JyYWNlIiwicmVtb3ZlUmFuZ2UiLCJyYW5nZSIsImluc2VydFRleHRBZnRlciJdLCJtYXBwaW5ncyI6ImFBQUEscUM7O0FBRUEsU0FBU0EsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0I7QUFDdEIsU0FBT0EsTUFBTUMsSUFBTixLQUFl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QUVuQixtREFBU25CLE1BQU1DLElBQU4sS0FBZSxZQUFmLElBQStCRCxNQUFNRSxLQUFOLEtBQWdCLEdBQXhELEVBRm1CLENBQXJCOztBQUlBRSxnQ0FBTU8sSUFBTixDQUFXTixNQUFNeUQsV0FBTixDQUFrQjtBQUMzQnJELGdDQUFNc0QsS0FBTixDQUFZLENBQVosQ0FEMkI7QUFFM0JGLHVDQUFhRSxLQUFiLENBQW1CLENBQW5CLENBRjJCLENBQWxCLENBQVg7O0FBSUQ7O0FBRUQsK0JBQU8zRCxNQUFNNkMsTUFBTjtBQUNMO0FBQ0E1Qyw4QkFBTTJELGVBQU4sQ0FBc0JsRCxJQUF0QixnQkFBaUMyQyxVQUFqQyxFQUZLLENBQVA7O0FBSUQsdUJBbERZLGdCQUFmOztBQW9ERCxpQkF2REk7QUF3RE47QUFDRixXQWxISSw4QkFBUDs7QUFvSEQsS0FqTGMsbUJBQWpCIiwiZmlsZSI6ImNvbnNpc3RlbnQtdHlwZS1zcGVjaWZpZXItc3R5bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gaXNDb21tYSh0b2tlbikge1xuICByZXR1cm4gdG9rZW4udHlwZSA9PT0gJ1B1bmN0dWF0b3InICYmIHRva2VuLnZhbHVlID09PSAnLCc7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNwZWNpZmllcnMoZml4ZXMsIGZpeGVyLCBzb3VyY2VDb2RlLCBzcGVjaWZpZXJzKSB7XG4gIGZvciAoY29uc3Qgc3BlY2lmaWVyIG9mIHNwZWNpZmllcnMpIHtcbiAgICAvLyByZW1vdmUgdGhlIHRyYWlsaW5nIGNvbW1hXG4gICAgY29uc3QgY29tbWEgPSBzb3VyY2VDb2RlLmdldFRva2VuQWZ0ZXIoc3BlY2lmaWVyLCBpc0NvbW1hKTtcbiAgICBpZiAoY29tbWEpIHtcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlKGNvbW1hKSk7XG4gICAgfVxuICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlKHNwZWNpZmllcikpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEltcG9ydFRleHQoXG4gIG5vZGUsXG4gIHNvdXJjZUNvZGUsXG4gIHNwZWNpZmllcnMsXG4gIGtpbmQsXG4pIHtcbiAgY29uc3Qgc291cmNlU3RyaW5nID0gc291cmNlQ29kZS5nZXRUZXh0KG5vZGUuc291cmNlKTtcbiAgaWYgKHNwZWNpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgY29uc3QgbmFtZXMgPSBzcGVjaWZpZXJzLm1hcChzID0+IHtcbiAgICBpZiAocy5pbXBvcnRlZC5uYW1lID09PSBzLmxvY2FsLm5hbWUpIHtcbiAgICAgIHJldHVybiBzLmltcG9ydGVkLm5hbWU7XG4gICAgfVxuICAgIHJldHVybiBgJHtzLmltcG9ydGVkLm5hbWV9IGFzICR7cy5sb2NhbC5uYW1lfWA7XG4gIH0pO1xuICAvLyBpbnNlcnQgYSBmcmVzaCB0b3AtbGV2ZWwgaW1wb3J0XG4gIHJldHVybiBgaW1wb3J0ICR7a2luZH0geyR7bmFtZXMuam9pbignLCAnKX19IGZyb20gJHtzb3VyY2VTdHJpbmd9O2A7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbmZvcmNlIG9yIGJhbiB0aGUgdXNlIG9mIGlubGluZSB0eXBlLW9ubHkgbWFya2VycyBmb3IgbmFtZWQgaW1wb3J0cy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdjb25zaXN0ZW50LXR5cGUtc3BlY2lmaWVyLXN0eWxlJyksXG4gICAgfSxcbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbJ3ByZWZlci1pbmxpbmUnLCAncHJlZmVyLXRvcC1sZXZlbCddLFxuICAgICAgICBkZWZhdWx0OiAncHJlZmVyLWlubGluZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG5cbiAgICBpZiAoY29udGV4dC5vcHRpb25zWzBdID09PSAncHJlZmVyLWlubGluZScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgICBpZiAobm9kZS5pbXBvcnRLaW5kID09PSAndmFsdWUnIHx8IG5vZGUuaW1wb3J0S2luZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyB0b3AtbGV2ZWwgdmFsdWUgLyB1bmtub3duIGlzIHZhbGlkXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gbm8gc3BlY2lmaWVycyAoaW1wb3J0IHR5cGUge30gZnJvbSAnJykgaGF2ZSBubyBzcGVjaWZpZXJzIHRvIG1hcmsgYXMgaW5saW5lXG4gICAgICAgICAgICBub2RlLnNwZWNpZmllcnMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICAobm9kZS5zcGVjaWZpZXJzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgICAgICAvLyBkZWZhdWx0IGltcG9ydHMgYXJlIGJvdGggXCJpbmxpbmVcIiBhbmQgXCJ0b3AtbGV2ZWxcIlxuICAgICAgICAgICAgICAobm9kZS5zcGVjaWZpZXJzWzBdLnR5cGUgPT09ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyB8fFxuICAgICAgICAgICAgICAgIC8vIG5hbWVzcGFjZSBpbXBvcnRzIGFyZSBib3RoIFwiaW5saW5lXCIgYW5kIFwidG9wLWxldmVsXCJcbiAgICAgICAgICAgICAgICBub2RlLnNwZWNpZmllcnNbMF0udHlwZSA9PT0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnUHJlZmVyIHVzaW5nIGlubGluZSB7e2tpbmR9fSBzcGVjaWZpZXJzIGluc3RlYWQgb2YgYSB0b3AtbGV2ZWwge3traW5kfX0tb25seSBpbXBvcnQuJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAga2luZDogbm9kZS5pbXBvcnRLaW5kLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpeChmaXhlcikge1xuICAgICAgICAgICAgICBjb25zdCBraW5kVG9rZW4gPSBzb3VyY2VDb2RlLmdldEZpcnN0VG9rZW4obm9kZSwgeyBza2lwOiAxIH0pO1xuXG4gICAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQoXG4gICAgICAgICAgICAgICAga2luZFRva2VuID8gZml4ZXIucmVtb3ZlKGtpbmRUb2tlbikgOiBbXSxcbiAgICAgICAgICAgICAgICBub2RlLnNwZWNpZmllcnMubWFwKChzcGVjaWZpZXIpID0+IGZpeGVyLmluc2VydFRleHRCZWZvcmUoc3BlY2lmaWVyLCBgJHtub2RlLmltcG9ydEtpbmR9IGApKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHByZWZlci10b3AtbGV2ZWxcbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgLy8gYWxyZWFkeSB0b3AtbGV2ZWwgaXMgdmFsaWRcbiAgICAgICAgICBub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fFxuICAgICAgICAgIG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGVvZicgfHxcbiAgICAgICAgICAvLyBubyBzcGVjaWZpZXJzIChpbXBvcnQge30gZnJvbSAnJykgY2Fubm90IGhhdmUgaW5saW5lIC0gc28gaXMgdmFsaWRcbiAgICAgICAgICBub2RlLnNwZWNpZmllcnMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgKG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgaW1wb3J0cyBhcmUgYm90aCBcImlubGluZVwiIGFuZCBcInRvcC1sZXZlbFwiXG4gICAgICAgICAgICAobm9kZS5zcGVjaWZpZXJzWzBdLnR5cGUgPT09ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyB8fFxuICAgICAgICAgICAgICAvLyBuYW1lc3BhY2UgaW1wb3J0cyBhcmUgYm90aCBcImlubGluZVwiIGFuZCBcInRvcC1sZXZlbFwiXG4gICAgICAgICAgICAgIG5vZGUuc3BlY2lmaWVyc1swXS50eXBlID09PSAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJykpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGVTcGVjaWZpZXJzID0gW107XG4gICAgICAgIGNvbnN0IHR5cGVvZlNwZWNpZmllcnMgPSBbXTtcbiAgICAgICAgY29uc3QgdmFsdWVTcGVjaWZpZXJzID0gW107XG4gICAgICAgIGxldCBkZWZhdWx0U3BlY2lmaWVyID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBzcGVjaWZpZXIgb2Ygbm9kZS5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci50eXBlID09PSAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcicpIHtcbiAgICAgICAgICAgIGRlZmF1bHRTcGVjaWZpZXIgPSBzcGVjaWZpZXI7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3BlY2lmaWVyLmltcG9ydEtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgICAgdHlwZVNwZWNpZmllcnMucHVzaChzcGVjaWZpZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3BlY2lmaWVyLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnKSB7XG4gICAgICAgICAgICB0eXBlb2ZTcGVjaWZpZXJzLnB1c2goc3BlY2lmaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNwZWNpZmllci5pbXBvcnRLaW5kID09PSAndmFsdWUnIHx8IHNwZWNpZmllci5pbXBvcnRLaW5kID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlU3BlY2lmaWVycy5wdXNoKHNwZWNpZmllcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZUltcG9ydCA9IGdldEltcG9ydFRleHQobm9kZSwgc291cmNlQ29kZSwgdHlwZVNwZWNpZmllcnMsICd0eXBlJyk7XG4gICAgICAgIGNvbnN0IHR5cGVvZkltcG9ydCA9IGdldEltcG9ydFRleHQobm9kZSwgc291cmNlQ29kZSwgdHlwZW9mU3BlY2lmaWVycywgJ3R5cGVvZicpO1xuICAgICAgICBjb25zdCBuZXdJbXBvcnRzID0gYCR7dHlwZUltcG9ydH1cXG4ke3R5cGVvZkltcG9ydH1gLnRyaW0oKTtcblxuICAgICAgICBpZiAodHlwZVNwZWNpZmllcnMubGVuZ3RoICsgdHlwZW9mU3BlY2lmaWVycy5sZW5ndGggPT09IG5vZGUuc3BlY2lmaWVycy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBhbGwgc3BlY2lmaWVycyBoYXZlIGlubGluZSBzcGVjaWZpZXJzIC0gc28gd2UgcmVwbGFjZSB0aGUgZW50aXJlIGltcG9ydFxuICAgICAgICAgIGNvbnN0IGtpbmQgPSBbXS5jb25jYXQoXG4gICAgICAgICAgICB0eXBlU3BlY2lmaWVycy5sZW5ndGggPiAwID8gJ3R5cGUnIDogW10sXG4gICAgICAgICAgICB0eXBlb2ZTcGVjaWZpZXJzLmxlbmd0aCA+IDAgPyAndHlwZW9mJyA6IFtdLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1ByZWZlciB1c2luZyBhIHRvcC1sZXZlbCB7e2tpbmR9fS1vbmx5IGltcG9ydCBpbnN0ZWFkIG9mIGlubGluZSB7e2tpbmR9fSBzcGVjaWZpZXJzLicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGtpbmQ6IGtpbmQuam9pbignLycpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpeChmaXhlcikge1xuICAgICAgICAgICAgICByZXR1cm4gZml4ZXIucmVwbGFjZVRleHQobm9kZSwgbmV3SW1wb3J0cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHJlbW92ZSBzcGVjaWZpYyBzcGVjaWZpZXJzIGFuZCBpbnNlcnQgbmV3IGltcG9ydHMgZm9yIHRoZW1cbiAgICAgICAgICBmb3IgKGNvbnN0IHNwZWNpZmllciBvZiB0eXBlU3BlY2lmaWVycy5jb25jYXQodHlwZW9mU3BlY2lmaWVycykpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgbm9kZTogc3BlY2lmaWVyLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnUHJlZmVyIHVzaW5nIGEgdG9wLWxldmVsIHt7a2luZH19LW9ubHkgaW1wb3J0IGluc3RlYWQgb2YgaW5saW5lIHt7a2luZH19IHNwZWNpZmllcnMuJyxcbiAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGtpbmQ6IHNwZWNpZmllci5pbXBvcnRLaW5kLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmaXgoZml4ZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaXhlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG5vIHZhbHVlIHNwZWNpZmllcnMsIHRoZW4gdGhlIG90aGVyIHJlcG9ydCBmaXhlciB3aWxsIGJlIGNhbGxlZCwgbm90IHRoaXMgb25lXG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWVTcGVjaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIC8vIGltcG9ydCB7IFZhbHVlLCB0eXBlIFR5cGUgfSBmcm9tICdtb2QnO1xuXG4gICAgICAgICAgICAgICAgICAvLyB3ZSBjYW4ganVzdCByZW1vdmUgdGhlIHR5cGUgc3BlY2lmaWVyc1xuICAgICAgICAgICAgICAgICAgcmVtb3ZlU3BlY2lmaWVycyhmaXhlcywgZml4ZXIsIHNvdXJjZUNvZGUsIHR5cGVTcGVjaWZpZXJzKTtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZVNwZWNpZmllcnMoZml4ZXMsIGZpeGVyLCBzb3VyY2VDb2RlLCB0eXBlb2ZTcGVjaWZpZXJzKTtcblxuICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgaW1wb3J0IG5pY2VseSBmb3JtYXR0ZWQgYnkgYWxzbyByZW1vdmluZyB0aGUgdHJhaWxpbmcgY29tbWEgYWZ0ZXIgdGhlIGxhc3QgdmFsdWUgaW1wb3J0XG4gICAgICAgICAgICAgICAgICAvLyBlZ1xuICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0IHsgVmFsdWUsIHR5cGUgVHlwZSB9IGZyb20gJ21vZCc7XG4gICAgICAgICAgICAgICAgICAvLyB0b1xuICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0IHsgVmFsdWUgIH0gZnJvbSAnbW9kJztcbiAgICAgICAgICAgICAgICAgIC8vIG5vdFxuICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0IHsgVmFsdWUsICB9IGZyb20gJ21vZCc7XG4gICAgICAgICAgICAgICAgICBjb25zdCBtYXliZUNvbW1hID0gc291cmNlQ29kZS5nZXRUb2tlbkFmdGVyKHZhbHVlU3BlY2lmaWVyc1t2YWx1ZVNwZWNpZmllcnMubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tbWEobWF5YmVDb21tYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmUobWF5YmVDb21tYSkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVmYXVsdFNwZWNpZmllcikge1xuICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0IERlZmF1bHQsIHsgdHlwZSBUeXBlIH0gZnJvbSAnbW9kJztcblxuICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBlbnRpcmUgY3VybHkgYmxvY2sgc28gd2UgZG9uJ3QgbGVhdmUgYW4gZW1wdHkgb25lIGJlaGluZFxuICAgICAgICAgICAgICAgICAgLy8gTk9URSAtIHRoZSBkZWZhdWx0IHNwZWNpZmllciAqbXVzdCogYmUgdGhlIGZpcnN0IHNwZWNpZmllciBhbHdheXMhXG4gICAgICAgICAgICAgICAgICAvLyAgICAgICAgc28gYSBjb21tYSBleGlzdHMgdGhhdCB3ZSBhbHNvIGhhdmUgdG8gY2xlYW4gdXAgb3IgZWxzZSBpdCdzIGJhZCBzeW50YXhcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hID0gc291cmNlQ29kZS5nZXRUb2tlbkFmdGVyKGRlZmF1bHRTcGVjaWZpZXIsIGlzQ29tbWEpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgY2xvc2luZ0JyYWNlID0gc291cmNlQ29kZS5nZXRUb2tlbkFmdGVyKFxuICAgICAgICAgICAgICAgICAgICBub2RlLnNwZWNpZmllcnNbbm9kZS5zcGVjaWZpZXJzLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9PiB0b2tlbi50eXBlID09PSAnUHVuY3R1YXRvcicgJiYgdG9rZW4udmFsdWUgPT09ICd9JyxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZVJhbmdlKFtcbiAgICAgICAgICAgICAgICAgICAgY29tbWEucmFuZ2VbMF0sXG4gICAgICAgICAgICAgICAgICAgIGNsb3NpbmdCcmFjZS5yYW5nZVsxXSxcbiAgICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZml4ZXMuY29uY2F0KFxuICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IHRoZSBuZXcgaW1wb3J0cyBhZnRlciB0aGUgb2xkIGRlY2xhcmF0aW9uXG4gICAgICAgICAgICAgICAgICBmaXhlci5pbnNlcnRUZXh0QWZ0ZXIobm9kZSwgYFxcbiR7bmV3SW1wb3J0c31gKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19