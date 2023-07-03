'use strict';




var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Rule to disallow namespace import
 * @author Radek Benkel
 */module.exports = { meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid namespace (a.k.a. "wildcard" `*`) imports.',
      url: (0, _docsUrl2['default'])('no-namespace') },

    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        ignore: {
          type: 'array',
          items: {
            type: 'string' },

          uniqueItems: true } } }] },





  create: function () {function create(context) {
      var firstOption = context.options[0] || {};
      var ignoreGlobs = firstOption.ignore;

      return {
        ImportNamespaceSpecifier: function () {function ImportNamespaceSpecifier(node) {
            if (ignoreGlobs && ignoreGlobs.find(function (glob) {return (0, _minimatch2['default'])(node.parent.source.value, glob, { matchBase: true });})) {
              return;
            }

            var scopeVariables = context.getScope().variables;
            var namespaceVariable = scopeVariables.find(function (variable) {return variable.defs[0].node === node;});
            var namespaceReferences = namespaceVariable.references;
            var namespaceIdentifiers = namespaceReferences.map(function (reference) {return reference.identifier;});
            var canFix = namespaceIdentifiers.length > 0 && !usesNamespaceAsObject(namespaceIdentifiers);

            context.report({
              node: node,
              message: 'Unexpected namespace import.',
              fix: canFix && function (fixer) {
                var scopeManager = context.getSourceCode().scopeManager;
                var fixes = [];

                // Pass 1: Collect variable names that are already in scope for each reference we want
                // to transform, so that we can be sure that we choose non-conflicting import names
                var importNameConflicts = {};
                namespaceIdentifiers.forEach(function (identifier) {
                  var parent = identifier.parent;
                  if (parent && parent.type === 'MemberExpression') {
                    var importName = getMemberPropertyName(parent);
                    var localConflicts = getVariableNamesInScope(scopeManager, parent);
                    if (!importNameConflicts[importName]) {
                      importNameConflicts[importName] = localConflicts;
                    } else {
                      localConflicts.forEach(function (c) {return importNameConflicts[importName].add(c);});
                    }
                  }
                });

                // Choose new names for each import
                var importNames = Object.keys(importNameConflicts);
                var importLocalNames = generateLocalNames(
                importNames,
                importNameConflicts,
                namespaceVariable.name);


                // Replace the ImportNamespaceSpecifier with a list of ImportSpecifiers
                var namedImportSpecifiers = importNames.map(function (importName) {return (
                    importName === importLocalNames[importName] ?
                    importName : String(
                    importName) + ' as ' + String(importLocalNames[importName]));});

                fixes.push(fixer.replaceText(node, '{ ' + String(namedImportSpecifiers.join(', ')) + ' }'));

                // Pass 2: Replace references to the namespace with references to the named imports
                namespaceIdentifiers.forEach(function (identifier) {
                  var parent = identifier.parent;
                  if (parent && parent.type === 'MemberExpression') {
                    var importName = getMemberPropertyName(parent);
                    fixes.push(fixer.replaceText(parent, importLocalNames[importName]));
                  }
                });

                return fixes;
              } });

          }return ImportNamespaceSpecifier;}() };

    }return create;}() };


/**
                           * @param {Identifier[]} namespaceIdentifiers
                           * @returns {boolean} `true` if the namespace variable is more than just a glorified constant
                           */
function usesNamespaceAsObject(namespaceIdentifiers) {
  return !namespaceIdentifiers.every(function (identifier) {
    var parent = identifier.parent;

    // `namespace.x` or `namespace['x']`
    return (
      parent && parent.type === 'MemberExpression' && (
      parent.property.type === 'Identifier' || parent.property.type === 'Literal'));

  });
}

/**
   * @param {MemberExpression} memberExpression
   * @returns {string} the name of the member in the object expression, e.g. the `x` in `namespace.x`
   */
function getMemberPropertyName(memberExpression) {
  return memberExpression.property.type === 'Identifier' ?
  memberExpression.property.name :
  memberExpression.property.value;
}

/**
   * @param {ScopeManager} scopeManager
   * @param {ASTNode} node
   * @return {Set<string>}
   */
function getVariableNamesInScope(scopeManager, node) {
  var currentNode = node;
  var scope = scopeManager.acquire(currentNode);
  while (scope == null) {
    currentNode = currentNode.parent;
    scope = scopeManager.acquire(currentNode, true);
  }
  return new Set(scope.variables.concat(scope.upper.variables).map(function (variable) {return variable.name;}));
}

/**
   *
   * @param {*} names
   * @param {*} nameConflicts
   * @param {*} namespaceName
   */
function generateLocalNames(names, nameConflicts, namespaceName) {
  var localNames = {};
  names.forEach(function (name) {
    var localName = void 0;
    if (!nameConflicts[name].has(name)) {
      localName = name;
    } else if (!nameConflicts[name].has(String(namespaceName) + '_' + String(name))) {
      localName = String(namespaceName) + '_' + String(name);
    } else {
      for (var i = 1; i < Infinity; i++) {
        if (!nameConflicts[name].has(String(namespaceName) + '_' + String(name) + '_' + String(i))) {
          localName = String(namespaceName) + '_' + String(name) + '_' + String(i);
          break;
        }
      }
    }
    localNames[name] = localName;
  });
  return localNames;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsImlnbm9yZSIsIml0ZW1zIiwidW5pcXVlSXRlbXMiLCJjcmVhdGUiLCJjb250ZXh0IiwiZmlyc3RPcHRpb24iLCJvcHRpb25zIiwiaWdub3JlR2xvYnMiLCJJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJub2RlIiwiZmluZCIsInBhcmVudCIsInNvdXJjZSIsInZhbHVlIiwiZ2xvYiIsIm1hdGNoQmFzZSIsInNjb3BlVmFyaWFibGVzIiwiZ2V0U2NvcGUiLCJ2YXJpYWJsZXMiLCJuYW1lc3BhY2VWYXJpYWJsZSIsInZhcmlhYmxlIiwiZGVmcyIsIm5hbWVzcGFjZVJlZmVyZW5jZXMiLCJyZWZlcmVuY2VzIiwibmFtZXNwYWNlSWRlbnRpZmllcnMiLCJtYXAiLCJyZWZlcmVuY2UiLCJpZGVudGlmaWVyIiwiY2FuRml4IiwibGVuZ3RoIiwidXNlc05hbWVzcGFjZUFzT2JqZWN0IiwicmVwb3J0IiwibWVzc2FnZSIsImZpeCIsInNjb3BlTWFuYWdlciIsImdldFNvdXJjZUNvZGUiLCJmaXhlcyIsImltcG9ydE5hbWVDb25mbGljdHMiLCJmb3JFYWNoIiwiaW1wb3J0TmFtZSIsImdldE1lbWJlclByb3BlcnR5TmFtZSIsImxvY2FsQ29uZmxpY3RzIiwiZ2V0VmFyaWFibGVOYW1lc0luU2NvcGUiLCJjIiwiYWRkIiwiaW1wb3J0TmFtZXMiLCJPYmplY3QiLCJrZXlzIiwiaW1wb3J0TG9jYWxOYW1lcyIsImdlbmVyYXRlTG9jYWxOYW1lcyIsIm5hbWUiLCJuYW1lZEltcG9ydFNwZWNpZmllcnMiLCJwdXNoIiwiZml4ZXIiLCJyZXBsYWNlVGV4dCIsImpvaW4iLCJldmVyeSIsInByb3BlcnR5IiwibWVtYmVyRXhwcmVzc2lvbiIsImN1cnJlbnROb2RlIiwic2NvcGUiLCJhY3F1aXJlIiwiU2V0IiwiY29uY2F0IiwidXBwZXIiLCJuYW1lcyIsIm5hbWVDb25mbGljdHMiLCJuYW1lc3BhY2VOYW1lIiwibG9jYWxOYW1lcyIsImxvY2FsTmFtZSIsImhhcyIsImkiLCJJbmZpbml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxzQztBQUNBLHFDOztBQUVBO0FBQ0E7QUFDQTtBQVZBOzs7R0FhQUEsT0FBT0MsT0FBUCxHQUFpQixFQUNmQyxNQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGFBRE47QUFFSkMsbUJBQWEsbURBRlQ7QUFHSkMsV0FBSywwQkFBUSxjQUFSLENBSEQsRUFGRjs7QUFPSkMsYUFBUyxNQVBMO0FBUUpDLFlBQVEsQ0FBQztBQUNQTixZQUFNLFFBREM7QUFFUE8sa0JBQVk7QUFDVkMsZ0JBQVE7QUFDTlIsZ0JBQU0sT0FEQTtBQUVOUyxpQkFBTztBQUNMVCxrQkFBTSxRQURELEVBRkQ7O0FBS05VLHVCQUFhLElBTFAsRUFERSxFQUZMLEVBQUQsQ0FSSixFQURTOzs7Ozs7QUF1QmZDLFFBdkJlLCtCQXVCUkMsT0F2QlEsRUF1QkM7QUFDZCxVQUFNQyxjQUFjRCxRQUFRRSxPQUFSLENBQWdCLENBQWhCLEtBQXNCLEVBQTFDO0FBQ0EsVUFBTUMsY0FBY0YsWUFBWUwsTUFBaEM7O0FBRUEsYUFBTztBQUNMUSxnQ0FESyxpREFDb0JDLElBRHBCLEVBQzBCO0FBQzdCLGdCQUFJRixlQUFlQSxZQUFZRyxJQUFaLENBQWlCLHdCQUFRLDRCQUFVRCxLQUFLRSxNQUFMLENBQVlDLE1BQVosQ0FBbUJDLEtBQTdCLEVBQW9DQyxJQUFwQyxFQUEwQyxFQUFFQyxXQUFXLElBQWIsRUFBMUMsQ0FBUixFQUFqQixDQUFuQixFQUE2RztBQUMzRztBQUNEOztBQUVELGdCQUFNQyxpQkFBaUJaLFFBQVFhLFFBQVIsR0FBbUJDLFNBQTFDO0FBQ0EsZ0JBQU1DLG9CQUFvQkgsZUFBZU4s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QztBQUNsQ21CLGtCQUFZbkIsSUFBWjtBQUNELEtBRkQsTUFFTyxJQUFJLENBQUNnQixjQUFjaEIsSUFBZCxFQUFvQm9CLEdBQXBCLFFBQTJCSCxhQUEzQixpQkFBNENqQixJQUE1QyxFQUFMLEVBQTBEO0FBQy9EbUIseUJBQWVGLGFBQWYsaUJBQWdDakIsSUFBaEM7QUFDRCxLQUZNLE1BRUE7QUFDTCxXQUFLLElBQUlxQixJQUFJLENBQWIsRUFBZ0JBLElBQUlDLFFBQXBCLEVBQThCRCxHQUE5QixFQUFtQztBQUNqQyxZQUFJLENBQUNMLGNBQWNoQixJQUFkLEVBQW9Cb0IsR0FBcEIsUUFBMkJILGFBQTNCLGlCQUE0Q2pCLElBQTVDLGlCQUFvRHFCLENBQXBELEVBQUwsRUFBK0Q7QUFDN0RGLDZCQUFlRixhQUFmLGlCQUFnQ2pCLElBQWhDLGlCQUF3Q3FCLENBQXhDO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDREgsZUFBV2xCLElBQVgsSUFBbUJtQixTQUFuQjtBQUNELEdBZkQ7QUFnQkEsU0FBT0QsVUFBUDtBQUNEIiwiZmlsZSI6Im5vLW5hbWVzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBSdWxlIHRvIGRpc2FsbG93IG5hbWVzcGFjZSBpbXBvcnRcbiAqIEBhdXRob3IgUmFkZWsgQmVua2VsXG4gKi9cblxuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSdWxlIERlZmluaXRpb25cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBuYW1lc3BhY2UgKGEuay5hLiBcIndpbGRjYXJkXCIgYCpgKSBpbXBvcnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLW5hbWVzcGFjZScpLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW3tcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBpZ25vcmU6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpcnN0T3B0aW9uID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IGlnbm9yZUdsb2JzID0gZmlyc3RPcHRpb24uaWdub3JlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydE5hbWVzcGFjZVNwZWNpZmllcihub2RlKSB7XG4gICAgICAgIGlmIChpZ25vcmVHbG9icyAmJiBpZ25vcmVHbG9icy5maW5kKGdsb2IgPT4gbWluaW1hdGNoKG5vZGUucGFyZW50LnNvdXJjZS52YWx1ZSwgZ2xvYiwgeyBtYXRjaEJhc2U6IHRydWUgfSkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2NvcGVWYXJpYWJsZXMgPSBjb250ZXh0LmdldFNjb3BlKCkudmFyaWFibGVzO1xuICAgICAgICBjb25zdCBuYW1lc3BhY2VWYXJpYWJsZSA9IHNjb3BlVmFyaWFibGVzLmZpbmQoKHZhcmlhYmxlKSA9PiB2YXJpYWJsZS5kZWZzWzBdLm5vZGUgPT09IG5vZGUpO1xuICAgICAgICBjb25zdCBuYW1lc3BhY2VSZWZlcmVuY2VzID0gbmFtZXNwYWNlVmFyaWFibGUucmVmZXJlbmNlcztcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlSWRlbnRpZmllcnMgPSBuYW1lc3BhY2VSZWZlcmVuY2VzLm1hcChyZWZlcmVuY2UgPT4gcmVmZXJlbmNlLmlkZW50aWZpZXIpO1xuICAgICAgICBjb25zdCBjYW5GaXggPSBuYW1lc3BhY2VJZGVudGlmaWVycy5sZW5ndGggPiAwICYmICF1c2VzTmFtZXNwYWNlQXNPYmplY3QobmFtZXNwYWNlSWRlbnRpZmllcnMpO1xuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IGBVbmV4cGVjdGVkIG5hbWVzcGFjZSBpbXBvcnQuYCxcbiAgICAgICAgICBmaXg6IGNhbkZpeCAmJiAoZml4ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuc2NvcGVNYW5hZ2VyO1xuICAgICAgICAgICAgY29uc3QgZml4ZXMgPSBbXTtcblxuICAgICAgICAgICAgLy8gUGFzcyAxOiBDb2xsZWN0IHZhcmlhYmxlIG5hbWVzIHRoYXQgYXJlIGFscmVhZHkgaW4gc2NvcGUgZm9yIGVhY2ggcmVmZXJlbmNlIHdlIHdhbnRcbiAgICAgICAgICAgIC8vIHRvIHRyYW5zZm9ybSwgc28gdGhhdCB3ZSBjYW4gYmUgc3VyZSB0aGF0IHdlIGNob29zZSBub24tY29uZmxpY3RpbmcgaW1wb3J0IG5hbWVzXG4gICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lQ29uZmxpY3RzID0ge307XG4gICAgICAgICAgICBuYW1lc3BhY2VJZGVudGlmaWVycy5mb3JFYWNoKChpZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGlkZW50aWZpZXIucGFyZW50O1xuICAgICAgICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWxDb25mbGljdHMgPSBnZXRWYXJpYWJsZU5hbWVzSW5TY29wZShzY29wZU1hbmFnZXIsIHBhcmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbXBvcnROYW1lQ29uZmxpY3RzW2ltcG9ydE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICBpbXBvcnROYW1lQ29uZmxpY3RzW2ltcG9ydE5hbWVdID0gbG9jYWxDb25mbGljdHM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxvY2FsQ29uZmxpY3RzLmZvckVhY2goKGMpID0+IGltcG9ydE5hbWVDb25mbGljdHNbaW1wb3J0TmFtZV0uYWRkKGMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDaG9vc2UgbmV3IG5hbWVzIGZvciBlYWNoIGltcG9ydFxuICAgICAgICAgICAgY29uc3QgaW1wb3J0TmFtZXMgPSBPYmplY3Qua2V5cyhpbXBvcnROYW1lQ29uZmxpY3RzKTtcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydExvY2FsTmFtZXMgPSBnZW5lcmF0ZUxvY2FsTmFtZXMoXG4gICAgICAgICAgICAgIGltcG9ydE5hbWVzLFxuICAgICAgICAgICAgICBpbXBvcnROYW1lQ29uZmxpY3RzLFxuICAgICAgICAgICAgICBuYW1lc3BhY2VWYXJpYWJsZS5uYW1lLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyIHdpdGggYSBsaXN0IG9mIEltcG9ydFNwZWNpZmllcnNcbiAgICAgICAgICAgIGNvbnN0IG5hbWVkSW1wb3J0U3BlY2lmaWVycyA9IGltcG9ydE5hbWVzLm1hcCgoaW1wb3J0TmFtZSkgPT4gKFxuICAgICAgICAgICAgICBpbXBvcnROYW1lID09PSBpbXBvcnRMb2NhbE5hbWVzW2ltcG9ydE5hbWVdXG4gICAgICAgICAgICAgICAgPyBpbXBvcnROYW1lXG4gICAgICAgICAgICAgICAgOiBgJHtpbXBvcnROYW1lfSBhcyAke2ltcG9ydExvY2FsTmFtZXNbaW1wb3J0TmFtZV19YFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlcGxhY2VUZXh0KG5vZGUsIGB7ICR7bmFtZWRJbXBvcnRTcGVjaWZpZXJzLmpvaW4oJywgJyl9IH1gKSk7XG5cbiAgICAgICAgICAgIC8vIFBhc3MgMjogUmVwbGFjZSByZWZlcmVuY2VzIHRvIHRoZSBuYW1lc3BhY2Ugd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBuYW1lZCBpbXBvcnRzXG4gICAgICAgICAgICBuYW1lc3BhY2VJZGVudGlmaWVycy5mb3JFYWNoKChpZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGlkZW50aWZpZXIucGFyZW50O1xuICAgICAgICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZXBsYWNlVGV4dChwYXJlbnQsIGltcG9ydExvY2FsTmFtZXNbaW1wb3J0TmFtZV0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaXhlcztcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SWRlbnRpZmllcltdfSBuYW1lc3BhY2VJZGVudGlmaWVyc1xuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgbmFtZXNwYWNlIHZhcmlhYmxlIGlzIG1vcmUgdGhhbiBqdXN0IGEgZ2xvcmlmaWVkIGNvbnN0YW50XG4gKi9cbmZ1bmN0aW9uIHVzZXNOYW1lc3BhY2VBc09iamVjdChuYW1lc3BhY2VJZGVudGlmaWVycykge1xuICByZXR1cm4gIW5hbWVzcGFjZUlkZW50aWZpZXJzLmV2ZXJ5KChpZGVudGlmaWVyKSA9PiB7XG4gICAgY29uc3QgcGFyZW50ID0gaWRlbnRpZmllci5wYXJlbnQ7XG5cbiAgICAvLyBgbmFtZXNwYWNlLnhgIG9yIGBuYW1lc3BhY2VbJ3gnXWBcbiAgICByZXR1cm4gKFxuICAgICAgcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiZcbiAgICAgIChwYXJlbnQucHJvcGVydHkudHlwZSA9PT0gJ0lkZW50aWZpZXInIHx8IHBhcmVudC5wcm9wZXJ0eS50eXBlID09PSAnTGl0ZXJhbCcpXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtNZW1iZXJFeHByZXNzaW9ufSBtZW1iZXJFeHByZXNzaW9uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbWVtYmVyIGluIHRoZSBvYmplY3QgZXhwcmVzc2lvbiwgZS5nLiB0aGUgYHhgIGluIGBuYW1lc3BhY2UueGBcbiAqL1xuZnVuY3Rpb24gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKG1lbWJlckV4cHJlc3Npb24pIHtcbiAgcmV0dXJuIG1lbWJlckV4cHJlc3Npb24ucHJvcGVydHkudHlwZSA9PT0gJ0lkZW50aWZpZXInXG4gICAgPyBtZW1iZXJFeHByZXNzaW9uLnByb3BlcnR5Lm5hbWVcbiAgICA6IG1lbWJlckV4cHJlc3Npb24ucHJvcGVydHkudmFsdWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTY29wZU1hbmFnZXJ9IHNjb3BlTWFuYWdlclxuICogQHBhcmFtIHtBU1ROb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtTZXQ8c3RyaW5nPn1cbiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVOYW1lc0luU2NvcGUoc2NvcGVNYW5hZ2VyLCBub2RlKSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gIGxldCBzY29wZSA9IHNjb3BlTWFuYWdlci5hY3F1aXJlKGN1cnJlbnROb2RlKTtcbiAgd2hpbGUgKHNjb3BlID09IG51bGwpIHtcbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICBzY29wZSA9IHNjb3BlTWFuYWdlci5hY3F1aXJlKGN1cnJlbnROb2RlLCB0cnVlKTtcbiAgfVxuICByZXR1cm4gbmV3IFNldChzY29wZS52YXJpYWJsZXMuY29uY2F0KHNjb3BlLnVwcGVyLnZhcmlhYmxlcykubWFwKHZhcmlhYmxlID0+IHZhcmlhYmxlLm5hbWUpKTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHsqfSBuYW1lc1xuICogQHBhcmFtIHsqfSBuYW1lQ29uZmxpY3RzXG4gKiBAcGFyYW0geyp9IG5hbWVzcGFjZU5hbWVcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVMb2NhbE5hbWVzKG5hbWVzLCBuYW1lQ29uZmxpY3RzLCBuYW1lc3BhY2VOYW1lKSB7XG4gIGNvbnN0IGxvY2FsTmFtZXMgPSB7fTtcbiAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGxldCBsb2NhbE5hbWU7XG4gICAgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhuYW1lKSkge1xuICAgICAgbG9jYWxOYW1lID0gbmFtZTtcbiAgICB9IGVsc2UgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhgJHtuYW1lc3BhY2VOYW1lfV8ke25hbWV9YCkpIHtcbiAgICAgIGxvY2FsTmFtZSA9IGAke25hbWVzcGFjZU5hbWV9XyR7bmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IEluZmluaXR5OyBpKyspIHtcbiAgICAgICAgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhgJHtuYW1lc3BhY2VOYW1lfV8ke25hbWV9XyR7aX1gKSkge1xuICAgICAgICAgIGxvY2FsTmFtZSA9IGAke25hbWVzcGFjZU5hbWV9XyR7bmFtZX1fJHtpfWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYWxOYW1lc1tuYW1lXSA9IGxvY2FsTmFtZTtcbiAgfSk7XG4gIHJldHVybiBsb2NhbE5hbWVzO1xufVxuIl19