'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);

var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var defaultGroups = ['builtin', 'external', 'parent', 'sibling', 'index'];

// REPORTING AND FIXING

function reverse(array) {
  return array.map(function (v) {
    return Object.assign({}, v, { rank: -v.rank });
  }).reverse();
}

function getTokensOrCommentsAfter(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result;
}

function getTokensOrCommentsBefore(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result.reverse();
}

function takeTokensAfterWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsAfter(sourceCode, node, 100);
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result;
}

function takeTokensBeforeWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsBefore(sourceCode, node, 100);
  var result = [];
  for (var i = tokens.length - 1; i >= 0; i--) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result.reverse();
}

function findOutOfOrder(imported) {
  if (imported.length === 0) {
    return [];
  }
  var maxSeenRankNode = imported[0];
  return imported.filter(function (importedModule) {
    var res = importedModule.rank < maxSeenRankNode.rank;
    if (maxSeenRankNode.rank < importedModule.rank) {
      maxSeenRankNode = importedModule;
    }
    return res;
  });
}

function findRootNode(node) {
  var parent = node;
  while (parent.parent != null && parent.parent.body == null) {
    parent = parent.parent;
  }
  return parent;
}

function findEndOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
  var endOfTokens = tokensToEndOfLine.length > 0 ?
  tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1] :
  node.range[1];
  var result = endOfTokens;
  for (var i = endOfTokens; i < sourceCode.text.length; i++) {
    if (sourceCode.text[i] === '\n') {
      result = i + 1;
      break;
    }
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t' && sourceCode.text[i] !== '\r') {
      break;
    }
    result = i + 1;
  }
  return result;
}

function commentOnSameLineAs(node) {
  return function (token) {return (token.type === 'Block' || token.type === 'Line') &&
    token.loc.start.line === token.loc.end.line &&
    token.loc.end.line === node.loc.end.line;};
}

function findStartOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
  var startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
  var result = startOfTokens;
  for (var i = startOfTokens - 1; i > 0; i--) {
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
      break;
    }
    result = i;
  }
  return result;
}

function isRequireExpression(expr) {
  return expr != null &&
  expr.type === 'CallExpression' &&
  expr.callee != null &&
  expr.callee.name === 'require' &&
  expr.arguments != null &&
  expr.arguments.length === 1 &&
  expr.arguments[0].type === 'Literal';
}

function isSupportedRequireModule(node) {
  if (node.type !== 'VariableDeclaration') {
    return false;
  }
  if (node.declarations.length !== 1) {
    return false;
  }
  var decl = node.declarations[0];
  var isPlainRequire = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  isRequireExpression(decl.init);
  var isRequireWithMemberExpression = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  decl.init != null &&
  decl.init.type === 'CallExpression' &&
  decl.init.callee != null &&
  decl.init.callee.type === 'MemberExpression' &&
  isRequireExpression(decl.init.callee.object);
  return isPlainRequire || isRequireWithMemberExpression;
}

function isPlainImportModule(node) {
  return node.type === 'ImportDeclaration' && node.specifiers != null && node.specifiers.length > 0;
}

function isPlainImportEquals(node) {
  return node.type === 'TSImportEqualsDeclaration' && node.moduleReference.expression;
}

function canCrossNodeWhileReorder(node) {
  return isSupportedRequireModule(node) || isPlainImportModule(node) || isPlainImportEquals(node);
}

function canReorderItems(firstNode, secondNode) {
  var parent = firstNode.parent;var _sort =
  [
  parent.body.indexOf(firstNode),
  parent.body.indexOf(secondNode)].
  sort(),_sort2 = _slicedToArray(_sort, 2),firstIndex = _sort2[0],secondIndex = _sort2[1];
  var nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = nodesBetween[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var nodeBetween = _step.value;
      if (!canCrossNodeWhileReorder(nodeBetween)) {
        return false;
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  return true;
}

function makeImportDescription(node) {
  if (node.node.importKind === 'type') {
    return 'type import';
  }
  if (node.node.importKind === 'typeof') {
    return 'typeof import';
  }
  return 'import';
}

function fixOutOfOrder(context, firstNode, secondNode, order) {
  var sourceCode = context.getSourceCode();

  var firstRoot = findRootNode(firstNode.node);
  var firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
  var firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);

  var secondRoot = findRootNode(secondNode.node);
  var secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
  var secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
  var canFix = canReorderItems(firstRoot, secondRoot);

  var newCode = sourceCode.text.substring(secondRootStart, secondRootEnd);
  if (newCode[newCode.length - 1] !== '\n') {
    newCode = newCode + '\n';
  }

  var firstImport = String(makeImportDescription(firstNode)) + ' of `' + String(firstNode.displayName) + '`';
  var secondImport = '`' + String(secondNode.displayName) + '` ' + String(makeImportDescription(secondNode));
  var message = secondImport + ' should occur ' + String(order) + ' ' + firstImport;

  if (order === 'before') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return (
          fixer.replaceTextRange(
          [firstRootStart, secondRootEnd],
          newCode + sourceCode.text.substring(firstRootStart, secondRootStart)));} });


  } else if (order === 'after') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return (
          fixer.replaceTextRange(
          [secondRootStart, firstRootEnd],
          sourceCode.text.substring(secondRootEnd, firstRootEnd) + newCode));} });


  }
}

function reportOutOfOrder(context, imported, outOfOrder, order) {
  outOfOrder.forEach(function (imp) {
    var found = imported.find(function () {function hasHigherRank(importedItem) {
        return importedItem.rank > imp.rank;
      }return hasHigherRank;}());
    fixOutOfOrder(context, found, imp, order);
  });
}

function makeOutOfOrderReport(context, imported) {
  var outOfOrder = findOutOfOrder(imported);
  if (!outOfOrder.length) {
    return;
  }
  // There are things to report. Try to minimize the number of reported errors.
  var reversedImported = reverse(imported);
  var reversedOrder = findOutOfOrder(reversedImported);
  if (reversedOrder.length < outOfOrder.length) {
    reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
    return;
  }
  reportOutOfOrder(context, imported, outOfOrder, 'before');
}

var compareString = function compareString(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/** Some parsers (languages without types) don't provide ImportKind */
var DEAFULT_IMPORT_KIND = 'value';
var getNormalizedValue = function getNormalizedValue(node, toLowerCase) {
  var value = node.value;
  return toLowerCase ? String(value).toLowerCase() : value;
};

function getSorter(alphabetizeOptions) {
  var multiplier = alphabetizeOptions.order === 'asc' ? 1 : -1;
  var orderImportKind = alphabetizeOptions.orderImportKind;
  var multiplierImportKind = orderImportKind !== 'ignore' && (
  alphabetizeOptions.orderImportKind === 'asc' ? 1 : -1);

  return function () {function importsSorter(nodeA, nodeB) {
      var importA = getNormalizedValue(nodeA, alphabetizeOptions.caseInsensitive);
      var importB = getNormalizedValue(nodeB, alphabetizeOptions.caseInsensitive);
      var result = 0;

      if (!(0, _arrayIncludes2['default'])(importA, '/') && !(0, _arrayIncludes2['default'])(importB, '/')) {
        result = compareString(importA, importB);
      } else {
        var A = importA.split('/');
        var B = importB.split('/');
        var a = A.length;
        var b = B.length;

        for (var i = 0; i < Math.min(a, b); i++) {
          result = compareString(A[i], B[i]);
          if (result) break;
        }

        if (!result && a !== b) {
          result = a < b ? -1 : 1;
        }
      }

      result = result * multiplier;

      // In case the paths are equal (result === 0), sort them by importKind
      if (!result && multiplierImportKind) {
        result = multiplierImportKind * compareString(
        nodeA.node.importKind || DEAFULT_IMPORT_KIND,
        nodeB.node.importKind || DEAFULT_IMPORT_KIND);

      }

      return result;
    }return importsSorter;}();
}

function mutateRanksToAlphabetize(imported, alphabetizeOptions) {
  var groupedByRanks = imported.reduce(function (acc, importedItem) {
    if (!Array.isArray(acc[importedItem.rank])) {
      acc[importedItem.rank] = [];
    }
    acc[importedItem.rank].push(importedItem);
    return acc;
  }, {});

  var sorterFn = getSorter(alphabetizeOptions);

  // sort group keys so that they can be iterated on in order
  var groupRanks = Object.keys(groupedByRanks).sort(function (a, b) {
    return a - b;
  });

  // sort imports locally within their group
  groupRanks.forEach(function (groupRank) {
    groupedByRanks[groupRank].sort(sorterFn);
  });

  // assign globally unique rank to each import
  var newRank = 0;
  var alphabetizedRanks = groupRanks.reduce(function (acc, groupRank) {
    groupedByRanks[groupRank].forEach(function (importedItem) {
      acc[String(importedItem.value) + '|' + String(importedItem.node.importKind)] = parseInt(groupRank, 10) + newRank;
      newRank += 1;
    });
    return acc;
  }, {});

  // mutate the original group-rank with alphabetized-rank
  imported.forEach(function (importedItem) {
    importedItem.rank = alphabetizedRanks[String(importedItem.value) + '|' + String(importedItem.node.importKind)];
  });
}

// DETECTING

function computePathRank(ranks, pathGroups, path, maxPosition) {
  for (var i = 0, l = pathGroups.length; i < l; i++) {var _pathGroups$i =
    pathGroups[i],pattern = _pathGroups$i.pattern,patternOptions = _pathGroups$i.patternOptions,group = _pathGroups$i.group,_pathGroups$i$positio = _pathGroups$i.position,position = _pathGroups$i$positio === undefined ? 1 : _pathGroups$i$positio;
    if ((0, _minimatch2['default'])(path, pattern, patternOptions || { nocomment: true })) {
      return ranks[group] + position / maxPosition;
    }
  }
}

function computeRank(context, ranks, importEntry, excludedImportTypes) {
  var impType = void 0;
  var rank = void 0;
  if (importEntry.type === 'import:object') {
    impType = 'object';
  } else if (importEntry.node.importKind === 'type' && ranks.omittedTypes.indexOf('type') === -1) {
    impType = 'type';
  } else {
    impType = (0, _importType2['default'])(importEntry.value, context);
  }
  if (!excludedImportTypes.has(impType)) {
    rank = computePathRank(ranks.groups, ranks.pathGroups, importEntry.value, ranks.maxPosition);
  }
  if (typeof rank === 'undefined') {
    rank = ranks.groups[impType];
  }
  if (importEntry.type !== 'import' && !importEntry.type.startsWith('import:')) {
    rank += 100;
  }

  return rank;
}

function registerNode(context, importEntry, ranks, imported, excludedImportTypes) {
  var rank = computeRank(context, ranks, importEntry, excludedImportTypes);
  if (rank !== -1) {
    imported.push(Object.assign({}, importEntry, { rank: rank }));
  }
}

function getRequireBlock(node) {
  var n = node;
  // Handle cases like `const baz = require('foo').bar.baz`
  // and `const foo = require('foo')()`
  while (
  n.parent.type === 'MemberExpression' && n.parent.object === n ||
  n.parent.type === 'CallExpression' && n.parent.callee === n)
  {
    n = n.parent;
  }
  if (
  n.parent.type === 'VariableDeclarator' &&
  n.parent.parent.type === 'VariableDeclaration' &&
  n.parent.parent.parent.type === 'Program')
  {
    return n.parent.parent.parent;
  }
}

var types = ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'];

// Creates an object with type-rank pairs.
// Example: { index: 0, sibling: 1, parent: 1, external: 1, builtin: 2, internal: 2 }
// Will throw an error if it contains a type that does not exist, or has a duplicate
function convertGroupsToRanks(groups) {
  var rankObject = groups.reduce(function (res, group, index) {
    if (typeof group === 'string') {
      group = [group];
    }
    group.forEach(function (groupItem) {
      if (types.indexOf(groupItem) === -1) {
        throw new Error('Incorrect configuration of the rule: Unknown type `' +
        JSON.stringify(groupItem) + '`');
      }
      if (res[groupItem] !== undefined) {
        throw new Error('Incorrect configuration of the rule: `' + groupItem + '` is duplicated');
      }
      res[groupItem] = index * 2;
    });
    return res;
  }, {});

  var omittedTypes = types.filter(function (type) {
    return rankObject[type] === undefined;
  });

  var ranks = omittedTypes.reduce(function (res, type) {
    res[type] = groups.length * 2;
    return res;
  }, rankObject);

  return { groups: ranks, omittedTypes: omittedTypes };
}

function convertPathGroupsForRanks(pathGroups) {
  var after = {};
  var before = {};

  var transformed = pathGroups.map(function (pathGroup, index) {var
    group = pathGroup.group,positionString = pathGroup.position;
    var position = 0;
    if (positionString === 'after') {
      if (!after[group]) {
        after[group] = 1;
      }
      position = after[group]++;
    } else if (positionString === 'before') {
      if (!before[group]) {
        before[group] = [];
      }
      before[group].push(index);
    }

    return Object.assign({}, pathGroup, { position: position });
  });

  var maxPosition = 1;

  Object.keys(before).forEach(function (group) {
    var groupLength = before[group].length;
    before[group].forEach(function (groupIndex, index) {
      transformed[groupIndex].position = -1 * (groupLength - index);
    });
    maxPosition = Math.max(maxPosition, groupLength);
  });

  Object.keys(after).forEach(function (key) {
    var groupNextPosition = after[key];
    maxPosition = Math.max(maxPosition, groupNextPosition - 1);
  });

  return {
    pathGroups: transformed,
    maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10 };

}

function fixNewLineAfterImport(context, previousImport) {
  var prevRoot = findRootNode(previousImport.node);
  var tokensToEndOfLine = takeTokensAfterWhile(
  context.getSourceCode(), prevRoot, commentOnSameLineAs(prevRoot));

  var endOfLine = prevRoot.range[1];
  if (tokensToEndOfLine.length > 0) {
    endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
  }
  return function (fixer) {return fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n');};
}

function removeNewLineAfterImport(context, currentImport, previousImport) {
  var sourceCode = context.getSourceCode();
  var prevRoot = findRootNode(previousImport.node);
  var currRoot = findRootNode(currentImport.node);
  var rangeToRemove = [
  findEndOfLineWithComments(sourceCode, prevRoot),
  findStartOfLineWithComments(sourceCode, currRoot)];

  if (/^\s*$/.test(sourceCode.text.substring(rangeToRemove[0], rangeToRemove[1]))) {
    return function (fixer) {return fixer.removeRange(rangeToRemove);};
  }
  return undefined;
}

function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup) {
  var getNumberOfEmptyLinesBetween = function getNumberOfEmptyLinesBetween(currentImport, previousImport) {
    var linesBetweenImports = context.getSourceCode().lines.slice(
    previousImport.node.loc.end.line,
    currentImport.node.loc.start.line - 1);


    return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
  };
  var getIsStartOfDistinctGroup = function getIsStartOfDistinctGroup(currentImport, previousImport) {
    return currentImport.rank - 1 >= previousImport.rank;
  };
  var previousImport = imported[0];

  imported.slice(1).forEach(function (currentImport) {
    var emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);
    var isStartOfDistinctGroup = getIsStartOfDistinctGroup(currentImport, previousImport);

    if (newlinesBetweenImports === 'always' ||
    newlinesBetweenImports === 'always-and-inside-groups') {
      if (currentImport.rank !== previousImport.rank && emptyLinesBetween === 0) {
        if (distinctGroup || !distinctGroup && isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be at least one empty line between import groups',
            fix: fixNewLineAfterImport(context, previousImport) });

        }
      } else if (emptyLinesBetween > 0 &&
      newlinesBetweenImports !== 'always-and-inside-groups') {
        if (distinctGroup && currentImport.rank === previousImport.rank || !distinctGroup && !isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be no empty line within import group',
            fix: removeNewLineAfterImport(context, currentImport, previousImport) });

        }
      }
    } else if (emptyLinesBetween > 0) {
      context.report({
        node: previousImport.node,
        message: 'There should be no empty line between import groups',
        fix: removeNewLineAfterImport(context, currentImport, previousImport) });

    }

    previousImport = currentImport;
  });
}

function getAlphabetizeConfig(options) {
  var alphabetize = options.alphabetize || {};
  var order = alphabetize.order || 'ignore';
  var orderImportKind = alphabetize.orderImportKind || 'ignore';
  var caseInsensitive = alphabetize.caseInsensitive || false;

  return { order: order, orderImportKind: orderImportKind, caseInsensitive: caseInsensitive };
}

// TODO, semver-major: Change the default of "distinctGroup" from true to false
var defaultDistinctGroup = true;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce a convention in module import order.',
      url: (0, _docsUrl2['default'])('order') },


    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        groups: {
          type: 'array' },

        pathGroupsExcludedImportTypes: {
          type: 'array' },

        distinctGroup: {
          type: 'boolean',
          'default': defaultDistinctGroup },

        pathGroups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pattern: {
                type: 'string' },

              patternOptions: {
                type: 'object' },

              group: {
                type: 'string',
                'enum': types },

              position: {
                type: 'string',
                'enum': ['after', 'before'] } },


            additionalProperties: false,
            required: ['pattern', 'group'] } },


        'newlines-between': {
          'enum': [
          'ignore',
          'always',
          'always-and-inside-groups',
          'never'] },


        alphabetize: {
          type: 'object',
          properties: {
            caseInsensitive: {
              type: 'boolean',
              'default': false },

            order: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' },

            orderImportKind: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' } },


          additionalProperties: false },

        warnOnUnassignedImports: {
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function importOrderRule(context) {
      var options = context.options[0] || {};
      var newlinesBetweenImports = options['newlines-between'] || 'ignore';
      var pathGroupsExcludedImportTypes = new Set(options['pathGroupsExcludedImportTypes'] || ['builtin', 'external', 'object']);
      var alphabetize = getAlphabetizeConfig(options);
      var distinctGroup = options.distinctGroup == null ? defaultDistinctGroup : !!options.distinctGroup;
      var ranks = void 0;

      try {var _convertPathGroupsFor =
        convertPathGroupsForRanks(options.pathGroups || []),pathGroups = _convertPathGroupsFor.pathGroups,maxPosition = _convertPathGroupsFor.maxPosition;var _convertGroupsToRanks =
        convertGroupsToRanks(options.groups || defaultGroups),groups = _convertGroupsToRanks.groups,omittedTypes = _convertGroupsToRanks.omittedTypes;
        ranks = {
          groups: groups,
          omittedTypes: omittedTypes,
          pathGroups: pathGroups,
          maxPosition: maxPosition };

      } catch (error) {
        // Malformed configuration
        return {
          Program: function () {function Program(node) {
              context.report(node, error.message);
            }return Program;}() };

      }
      var importMap = new Map();

      function getBlockImports(node) {
        if (!importMap.has(node)) {
          importMap.set(node, []);
        }
        return importMap.get(node);
      }

      return {
        ImportDeclaration: function () {function handleImports(node) {
            // Ignoring unassigned imports unless warnOnUnassignedImports is set
            if (node.specifiers.length || options.warnOnUnassignedImports) {
              var name = node.source.value;
              registerNode(
              context,
              {
                node: node,
                value: name,
                displayName: name,
                type: 'import' },

              ranks,
              getBlockImports(node.parent),
              pathGroupsExcludedImportTypes);

            }
          }return handleImports;}(),
        TSImportEqualsDeclaration: function () {function handleImports(node) {
            var displayName = void 0;
            var value = void 0;
            var type = void 0;
            // skip "export import"s
            if (node.isExport) {
              return;
            }
            if (node.moduleReference.type === 'TSExternalModuleReference') {
              value = node.moduleReference.expression.value;
              displayName = value;
              type = 'import';
            } else {
              value = '';
              displayName = context.getSourceCode().getText(node.moduleReference);
              type = 'import:object';
            }
            registerNode(
            context,
            {
              node: node,
              value: value,
              displayName: displayName,
              type: type },

            ranks,
            getBlockImports(node.parent),
            pathGroupsExcludedImportTypes);

          }return handleImports;}(),
        CallExpression: function () {function handleRequires(node) {
            if (!(0, _staticRequire2['default'])(node)) {
              return;
            }
            var block = getRequireBlock(node);
            if (!block) {
              return;
            }
            var name = node.arguments[0].value;
            registerNode(
            context,
            {
              node: node,
              value: name,
              displayName: name,
              type: 'require' },

            ranks,
            getBlockImports(block),
            pathGroupsExcludedImportTypes);

          }return handleRequires;}(),
        'Program:exit': function () {function reportAndReset() {
            importMap.forEach(function (imported) {
              if (newlinesBetweenImports !== 'ignore') {
                makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup);
              }

              if (alphabetize.order !== 'ignore') {
                mutateRanksToAlphabetize(imported, alphabetize);
              }

              makeOutOfOrderReport(context, imported);
            });

            importMap.clear();
          }return reportAndReset;}() };

    }return importOrderRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9vcmRlci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0R3JvdXBzIiwicmV2ZXJzZSIsImFycmF5IiwibWFwIiwidiIsIk9iamVjdCIsImFzc2lnbiIsInJhbmsiLCJnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIiLCJzb3VyY2VDb2RlIiwibm9kZSIsImNvdW50IiwiY3VycmVudE5vZGVPclRva2VuIiwicmVzdWx0IiwiaSIsImdldFRva2VuT3JDb21tZW50QWZ0ZXIiLCJwdXNoIiwiZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZSIsImdldFRva2VuT3JDb21tZW50QmVmb3JlIiwidGFrZVRva2Vuc0FmdGVyV2hpbGUiLCJjb25kaXRpb24iLCJ0b2tlbnMiLCJsZW5ndGgiLCJ0YWtlVG9rZW5zQmVmb3JlV2hpbGUiLCJmaW5kT3V0T2ZPcmRlciIsImltcG9ydGVkIiwibWF4U2VlblJhbmtOb2RlIiwiZmlsdGVyIiwiaW1wb3J0ZWRNb2R1bGUiLCJyZXMiLCJmaW5kUm9vdE5vZGUiLCJwYXJlbnQiLCJib2R5IiwiZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyIsInRva2Vuc1RvRW5kT2ZMaW5lIiwiY29tbWVudE9uU2FtZUxpbmVBcyIsImVuZE9mVG9rZW5zIiwicmFuZ2UiLCJ0ZXh0IiwidG9rZW4iLCJ0eXBlIiwibG9jIiwic3RhcnQiLCJsaW5lIiwiZW5kIiwiZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzIiwic3RhcnRPZlRva2VucyIsImlzUmVxdWlyZUV4cHJlc3Npb24iLCJleHByIiwiY2FsbGVlIiwibmFtZSIsImFyZ3VtZW50cyIsImlzU3VwcG9ydGVkUmVxdWlyZU1vZHVsZSIsImRlY2xhcmF0aW9ucyIsImRlY2wiLCJpc1BsYWluUmVxdWlyZSIsImlkIiwiaW5pdCIsImlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0IiwiaXNQbGFpbkltcG9ydE1vZHVsZSIsInNwZWNpZmllcnMiLCJpc1BsYWluSW1wb3J0RXF1YWxzIiwibW9kdWxlUmVmZXJlbmNlIiwiZXhwcmVzc2lvbiIsImNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlciIsImNhblJlb3JkZXJJdGVtcyIsImZpcnN0Tm9kZSIsInNlY29uZE5vZGUiLCJpbmRleE9mIiwic29ydCIsImZpcnN0SW5kZXgiLCJzZWNvbmRJbmRleCIsIm5vZGVzQmV0d2VlbiIsInNsaWNlIiwibm9kZUJldHdlZW4iLCJtYWtlSW1wb3J0RGVzY3JpcHRpb24iLCJpbXBvcnRLaW5kIiwiZml4T3V0T2ZPcmRlciIsImNvbnRleHQiLCJvcmRlciIsImdldFNvdXJjZUNvZGUiLCJmaXJzdFJvb3QiLCJmaXJzdFJvb3RTdGFydCIsImZpcnN0Um9vdEVuZCIsInNlY29uZFJvb3QiLCJzZWNvbmRSb290U3RhcnQiLCJzZWNvbmRSb290RW5kIiwiY2FuRml4IiwibmV3Q29kZSIsInN1YnN0cmluZyIsImZpcnN0SW1wb3J0IiwiZGlzcGxheU5hbWUiLCJzZWNvbmRJbXBvcnQiLCJtZXNzYWdlIiwicmVwb3J0IiwiZml4IiwiZml4ZXIiLCJyZXBsYWNlVGV4dFJhbmdlIiwicmVwb3J0T3V0T2ZPcmRlciIsIm91dE9mT3JkZXIiLCJmb3JFYWNoIiwiaW1wIiwiZm91bmQiLCJmaW5kIiwiaGFzSGlnaGVyUmFuayIsImltcG9ydGVkSXRlbSIsIm1ha2VPdXRPZk9yZGVyUmVwb3J0IiwicmV2ZXJzZWRJbXBvcnRlZCIsInJldmVyc2VkT3JkZXIiLCJjb21wYXJlU3RyaW5nIiwiYSIsImIiLCJERUFGVUxUX0lNUE9SVF9LSU5EIiwiZ2V0Tm9ybWFsaXplZFZhbHVlIiwidG9Mb3dlckNhc2UiLCJ2YWx1ZSIsIlN0cmluZyIsImdldFNvcnRlciIsImFscGhhYmV0aXplT3B0aW9ucyIsIm11bHRpcGxpZXIiLCJvcmRlckltcG9ydEtpbmQiLCJtdWx0aXBsaWVySW1wb3J0S2luZCIsImltcG9ydHNTb3J0ZXIiLCJub2RlQSIsIm5vZGVCIiwiaW1wb3J0QSIsImNhc2VJbnNlbnNpdGl2ZSIsImltcG9ydEIiLCJBIiwic3BsaXQiLCJCIiwiTWF0aCIsIm1pbiIsIm11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZSIsImdyb3VwZWRCeVJhbmtzIiwicmVkdWNlIiwiYWNjIiwiQXJyYXkiLCJpc0FycmF5Iiwic29ydGVyRm4iLCJncm91cFJhbmtzIiwia2V5cyIsImdyb3VwUmFuayIsIm5ld1JhbmsiLCJhbHBoYWJldGl6ZWRSYW5rcyIsInBhcnNlSW50IiwiY29tcHV0ZVBhdGhSYW5rIiwicmFua3MiLCJwYXRoR3JvdXBzIiwicGF0aCIsIm1heFBvc2l0aW9uIiwibCIsInBhdHRlcm4iLCJwYXR0ZXJuT3B0aW9ucyIsImdyb3VwIiwicG9zaXRpb24iLCJub2NvbW1lbnQiLCJjb21wdXRlUmFuayIsImltcG9ydEVudHJ5IiwiZXhjbHVkZWRJbXBvcnRUeXBlcyIsImltcFR5cGUiLCJvbWl0dGVkVHlwZXMiLCJoYXMiLCJncm91cHMiLCJzdGFydHNXaXRoIiwicmVnaXN0ZXJOb2RlIiwiZ2V0UmVxdWlyZUJsb2NrIiwibiIsInR5cGVzIiwiY29udmVydEdyb3Vwc1RvUmFua3MiLCJyYW5rT2JqZWN0IiwiaW5kZXgiLCJncm91cEl0ZW0iLCJFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1bmRlZmluZWQiLCJjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzIiwiYWZ0ZXIiLCJiZWZvcmUiLCJ0cmFuc2Zvcm1lZCIsInBhdGhHcm91cCIsInBvc2l0aW9uU3RyaW5nIiwiZ3JvdXBMZW5ndGgiLCJncm91cEluZGV4IiwibWF4Iiwia2V5IiwiZ3JvdXBOZXh0UG9zaXRpb24iLCJwb3ciLCJjZWlsIiwibG9nMTAiLCJmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJwcmV2aW91c0ltcG9ydCIsInByZXZSb290IiwiZW5kT2ZMaW5lIiwiaW5zZXJ0VGV4dEFmdGVyUmFuZ2UiLCJyZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJjdXJyZW50SW1wb3J0IiwiY3VyclJvb3QiLCJyYW5nZVRvUmVtb3ZlIiwidGVzdCIsInJlbW92ZVJhbmdlIiwibWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydCIsIm5ld2xpbmVzQmV0d2VlbkltcG9ydHMiLCJkaXN0aW5jdEdyb3VwIiwiZ2V0TnVtYmVyT2ZFbXB0eUxpbmVzQmV0d2VlbiIsImxpbmVzQmV0d2VlbkltcG9ydHMiLCJsaW5lcyIsInRyaW0iLCJnZXRJc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwIiwiZW1wdHlMaW5lc0JldHdlZW4iLCJpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwIiwiZ2V0QWxwaGFiZXRpemVDb25maWciLCJvcHRpb25zIiwiYWxwaGFiZXRpemUiLCJkZWZhdWx0RGlzdGluY3RHcm91cCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsInBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzIiwiaXRlbXMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsInJlcXVpcmVkIiwid2Fybk9uVW5hc3NpZ25lZEltcG9ydHMiLCJjcmVhdGUiLCJpbXBvcnRPcmRlclJ1bGUiLCJTZXQiLCJlcnJvciIsIlByb2dyYW0iLCJpbXBvcnRNYXAiLCJNYXAiLCJnZXRCbG9ja0ltcG9ydHMiLCJzZXQiLCJnZXQiLCJJbXBvcnREZWNsYXJhdGlvbiIsImhhbmRsZUltcG9ydHMiLCJzb3VyY2UiLCJUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIiwiaXNFeHBvcnQiLCJnZXRUZXh0IiwiQ2FsbEV4cHJlc3Npb24iLCJoYW5kbGVSZXF1aXJlcyIsImJsb2NrIiwicmVwb3J0QW5kUmVzZXQiLCJjbGVhciJdLCJtYXBwaW5ncyI6IkFBQUEsYTs7QUFFQSxzQztBQUNBLCtDOztBQUVBLGdEO0FBQ0Esc0Q7QUFDQSxxQzs7QUFFQSxJQUFNQSxnQkFBZ0IsQ0FBQyxTQUFELEVBQVksVUFBWixFQUF3QixRQUF4QixFQUFrQyxTQUFsQyxFQUE2QyxPQUE3QyxDQUF0Qjs7QUFFQTs7QUFFQSxTQUFT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QXlDO0FBQ3ZDRCwwQ0FBMEI1SCxPQUExQixFQUFtQ3RELFFBQW5DLEVBQTZDbUwsc0JBQTdDLEVBQXFFQyxhQUFyRTtBQUNEOztBQUVELGtCQUFJVSxZQUFZdkksS0FBWixLQUFzQixRQUExQixFQUFvQztBQUNsQ3NELHlDQUF5QjdHLFFBQXpCLEVBQW1DOEwsV0FBbkM7QUFDRDs7QUFFRDVHLG1DQUFxQjVCLE9BQXJCLEVBQThCdEQsUUFBOUI7QUFDRCxhQVZEOztBQVlBb04sc0JBQVVlLEtBQVY7QUFDRCxXQWRELE9BQXlCRCxjQUF6QixJQXZFSyxFQUFQOztBQXVGRCxLQXpIRCxPQUFpQmxCLGVBQWpCLElBcEZlLEVBQWpCIiwiZmlsZSI6Im9yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnYXJyYXktaW5jbHVkZXMnO1xuXG5pbXBvcnQgaW1wb3J0VHlwZSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnO1xuaW1wb3J0IGlzU3RhdGljUmVxdWlyZSBmcm9tICcuLi9jb3JlL3N0YXRpY1JlcXVpcmUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmNvbnN0IGRlZmF1bHRHcm91cHMgPSBbJ2J1aWx0aW4nLCAnZXh0ZXJuYWwnLCAncGFyZW50JywgJ3NpYmxpbmcnLCAnaW5kZXgnXTtcblxuLy8gUkVQT1JUSU5HIEFORCBGSVhJTkdcblxuZnVuY3Rpb24gcmV2ZXJzZShhcnJheSkge1xuICByZXR1cm4gYXJyYXkubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHYsIHsgcmFuazogLXYucmFuayB9KTtcbiAgfSkucmV2ZXJzZSgpO1xufVxuXG5mdW5jdGlvbiBnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIoc291cmNlQ29kZSwgbm9kZSwgY291bnQpIHtcbiAgbGV0IGN1cnJlbnROb2RlT3JUb2tlbiA9IG5vZGU7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICBjdXJyZW50Tm9kZU9yVG9rZW4gPSBzb3VyY2VDb2RlLmdldFRva2VuT3JDb21tZW50QWZ0ZXIoY3VycmVudE5vZGVPclRva2VuKTtcbiAgICBpZiAoY3VycmVudE5vZGVPclRva2VuID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdldFRva2Vuc09yQ29tbWVudHNCZWZvcmUoc291cmNlQ29kZSwgbm9kZSwgY291bnQpIHtcbiAgbGV0IGN1cnJlbnROb2RlT3JUb2tlbiA9IG5vZGU7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICBjdXJyZW50Tm9kZU9yVG9rZW4gPSBzb3VyY2VDb2RlLmdldFRva2VuT3JDb21tZW50QmVmb3JlKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gICAgaWYgKGN1cnJlbnROb2RlT3JUb2tlbiA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goY3VycmVudE5vZGVPclRva2VuKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LnJldmVyc2UoKTtcbn1cblxuZnVuY3Rpb24gdGFrZVRva2Vuc0FmdGVyV2hpbGUoc291cmNlQ29kZSwgbm9kZSwgY29uZGl0aW9uKSB7XG4gIGNvbnN0IHRva2VucyA9IGdldFRva2Vuc09yQ29tbWVudHNBZnRlcihzb3VyY2VDb2RlLCBub2RlLCAxMDApO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY29uZGl0aW9uKHRva2Vuc1tpXSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRva2Vuc1tpXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB0YWtlVG9rZW5zQmVmb3JlV2hpbGUoc291cmNlQ29kZSwgbm9kZSwgY29uZGl0aW9uKSB7XG4gIGNvbnN0IHRva2VucyA9IGdldFRva2Vuc09yQ29tbWVudHNCZWZvcmUoc291cmNlQ29kZSwgbm9kZSwgMTAwKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoY29uZGl0aW9uKHRva2Vuc1tpXSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRva2Vuc1tpXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0LnJldmVyc2UoKTtcbn1cblxuZnVuY3Rpb24gZmluZE91dE9mT3JkZXIoaW1wb3J0ZWQpIHtcbiAgaWYgKGltcG9ydGVkLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBsZXQgbWF4U2VlblJhbmtOb2RlID0gaW1wb3J0ZWRbMF07XG4gIHJldHVybiBpbXBvcnRlZC5maWx0ZXIoZnVuY3Rpb24gKGltcG9ydGVkTW9kdWxlKSB7XG4gICAgY29uc3QgcmVzID0gaW1wb3J0ZWRNb2R1bGUucmFuayA8IG1heFNlZW5SYW5rTm9kZS5yYW5rO1xuICAgIGlmIChtYXhTZWVuUmFua05vZGUucmFuayA8IGltcG9ydGVkTW9kdWxlLnJhbmspIHtcbiAgICAgIG1heFNlZW5SYW5rTm9kZSA9IGltcG9ydGVkTW9kdWxlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmluZFJvb3ROb2RlKG5vZGUpIHtcbiAgbGV0IHBhcmVudCA9IG5vZGU7XG4gIHdoaWxlIChwYXJlbnQucGFyZW50ICE9IG51bGwgJiYgcGFyZW50LnBhcmVudC5ib2R5ID09IG51bGwpIHtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbmZ1bmN0aW9uIGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgbm9kZSkge1xuICBjb25zdCB0b2tlbnNUb0VuZE9mTGluZSA9IHRha2VUb2tlbnNBZnRlcldoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbW1lbnRPblNhbWVMaW5lQXMobm9kZSkpO1xuICBjb25zdCBlbmRPZlRva2VucyA9IHRva2Vuc1RvRW5kT2ZMaW5lLmxlbmd0aCA+IDBcbiAgICA/IHRva2Vuc1RvRW5kT2ZMaW5lW3Rva2Vuc1RvRW5kT2ZMaW5lLmxlbmd0aCAtIDFdLnJhbmdlWzFdXG4gICAgOiBub2RlLnJhbmdlWzFdO1xuICBsZXQgcmVzdWx0ID0gZW5kT2ZUb2tlbnM7XG4gIGZvciAobGV0IGkgPSBlbmRPZlRva2VuczsgaSA8IHNvdXJjZUNvZGUudGV4dC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzb3VyY2VDb2RlLnRleHRbaV0gPT09ICdcXG4nKSB7XG4gICAgICByZXN1bHQgPSBpICsgMTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoc291cmNlQ29kZS50ZXh0W2ldICE9PSAnICcgJiYgc291cmNlQ29kZS50ZXh0W2ldICE9PSAnXFx0JyAmJiBzb3VyY2VDb2RlLnRleHRbaV0gIT09ICdcXHInKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0ID0gaSArIDE7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29tbWVudE9uU2FtZUxpbmVBcyhub2RlKSB7XG4gIHJldHVybiB0b2tlbiA9PiAodG9rZW4udHlwZSA9PT0gJ0Jsb2NrJyB8fCAgdG9rZW4udHlwZSA9PT0gJ0xpbmUnKSAmJlxuICAgICAgdG9rZW4ubG9jLnN0YXJ0LmxpbmUgPT09IHRva2VuLmxvYy5lbmQubGluZSAmJlxuICAgICAgdG9rZW4ubG9jLmVuZC5saW5lID09PSBub2RlLmxvYy5lbmQubGluZTtcbn1cblxuZnVuY3Rpb24gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIG5vZGUpIHtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQmVmb3JlV2hpbGUoc291cmNlQ29kZSwgbm9kZSwgY29tbWVudE9uU2FtZUxpbmVBcyhub2RlKSk7XG4gIGNvbnN0IHN0YXJ0T2ZUb2tlbnMgPSB0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwID8gdG9rZW5zVG9FbmRPZkxpbmVbMF0ucmFuZ2VbMF0gOiBub2RlLnJhbmdlWzBdO1xuICBsZXQgcmVzdWx0ID0gc3RhcnRPZlRva2VucztcbiAgZm9yIChsZXQgaSA9IHN0YXJ0T2ZUb2tlbnMgLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgaWYgKHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJyAnICYmIHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJ1xcdCcpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQgPSBpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGlzUmVxdWlyZUV4cHJlc3Npb24oZXhwcikge1xuICByZXR1cm4gZXhwciAhPSBudWxsICYmXG4gICAgZXhwci50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nICYmXG4gICAgZXhwci5jYWxsZWUgIT0gbnVsbCAmJlxuICAgIGV4cHIuY2FsbGVlLm5hbWUgPT09ICdyZXF1aXJlJyAmJlxuICAgIGV4cHIuYXJndW1lbnRzICE9IG51bGwgJiZcbiAgICBleHByLmFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICBleHByLmFyZ3VtZW50c1swXS50eXBlID09PSAnTGl0ZXJhbCc7XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkUmVxdWlyZU1vZHVsZShub2RlKSB7XG4gIGlmIChub2RlLnR5cGUgIT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAobm9kZS5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAxKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY2wgPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgY29uc3QgaXNQbGFpblJlcXVpcmUgPSBkZWNsLmlkICYmXG4gICAgKGRlY2wuaWQudHlwZSA9PT0gJ0lkZW50aWZpZXInIHx8IGRlY2wuaWQudHlwZSA9PT0gJ09iamVjdFBhdHRlcm4nKSAmJlxuICAgIGlzUmVxdWlyZUV4cHJlc3Npb24oZGVjbC5pbml0KTtcbiAgY29uc3QgaXNSZXF1aXJlV2l0aE1lbWJlckV4cHJlc3Npb24gPSBkZWNsLmlkICYmXG4gICAgKGRlY2wuaWQudHlwZSA9PT0gJ0lkZW50aWZpZXInIHx8IGRlY2wuaWQudHlwZSA9PT0gJ09iamVjdFBhdHRlcm4nKSAmJlxuICAgIGRlY2wuaW5pdCAhPSBudWxsICYmXG4gICAgZGVjbC5pbml0LnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbicgJiZcbiAgICBkZWNsLmluaXQuY2FsbGVlICE9IG51bGwgJiZcbiAgICBkZWNsLmluaXQuY2FsbGVlLnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJyAmJlxuICAgIGlzUmVxdWlyZUV4cHJlc3Npb24oZGVjbC5pbml0LmNhbGxlZS5vYmplY3QpO1xuICByZXR1cm4gaXNQbGFpblJlcXVpcmUgfHwgaXNSZXF1aXJlV2l0aE1lbWJlckV4cHJlc3Npb247XG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5JbXBvcnRNb2R1bGUobm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnSW1wb3J0RGVjbGFyYXRpb24nICYmIG5vZGUuc3BlY2lmaWVycyAhPSBudWxsICYmIG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPiAwO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluSW1wb3J0RXF1YWxzKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ1RTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24nICYmIG5vZGUubW9kdWxlUmVmZXJlbmNlLmV4cHJlc3Npb247XG59XG5cbmZ1bmN0aW9uIGNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlcihub2RlKSB7XG4gIHJldHVybiBpc1N1cHBvcnRlZFJlcXVpcmVNb2R1bGUobm9kZSkgfHwgaXNQbGFpbkltcG9ydE1vZHVsZShub2RlKSB8fCBpc1BsYWluSW1wb3J0RXF1YWxzKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBjYW5SZW9yZGVySXRlbXMoZmlyc3ROb2RlLCBzZWNvbmROb2RlKSB7XG4gIGNvbnN0IHBhcmVudCA9IGZpcnN0Tm9kZS5wYXJlbnQ7XG4gIGNvbnN0IFtmaXJzdEluZGV4LCBzZWNvbmRJbmRleF0gPSBbXG4gICAgcGFyZW50LmJvZHkuaW5kZXhPZihmaXJzdE5vZGUpLFxuICAgIHBhcmVudC5ib2R5LmluZGV4T2Yoc2Vjb25kTm9kZSksXG4gIF0uc29ydCgpO1xuICBjb25zdCBub2Rlc0JldHdlZW4gPSBwYXJlbnQuYm9keS5zbGljZShmaXJzdEluZGV4LCBzZWNvbmRJbmRleCArIDEpO1xuICBmb3IgKGNvbnN0IG5vZGVCZXR3ZWVuIG9mIG5vZGVzQmV0d2Vlbikge1xuICAgIGlmICghY2FuQ3Jvc3NOb2RlV2hpbGVSZW9yZGVyKG5vZGVCZXR3ZWVuKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbWFrZUltcG9ydERlc2NyaXB0aW9uKG5vZGUpIHtcbiAgaWYgKG5vZGUubm9kZS5pbXBvcnRLaW5kID09PSAndHlwZScpIHtcbiAgICByZXR1cm4gJ3R5cGUgaW1wb3J0JztcbiAgfVxuICBpZiAobm9kZS5ub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnKSB7XG4gICAgcmV0dXJuICd0eXBlb2YgaW1wb3J0JztcbiAgfVxuICByZXR1cm4gJ2ltcG9ydCc7XG59XG5cbmZ1bmN0aW9uIGZpeE91dE9mT3JkZXIoY29udGV4dCwgZmlyc3ROb2RlLCBzZWNvbmROb2RlLCBvcmRlcikge1xuICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG5cbiAgY29uc3QgZmlyc3RSb290ID0gZmluZFJvb3ROb2RlKGZpcnN0Tm9kZS5ub2RlKTtcbiAgY29uc3QgZmlyc3RSb290U3RhcnQgPSBmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgZmlyc3RSb290KTtcbiAgY29uc3QgZmlyc3RSb290RW5kID0gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBmaXJzdFJvb3QpO1xuXG4gIGNvbnN0IHNlY29uZFJvb3QgPSBmaW5kUm9vdE5vZGUoc2Vjb25kTm9kZS5ub2RlKTtcbiAgY29uc3Qgc2Vjb25kUm9vdFN0YXJ0ID0gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIHNlY29uZFJvb3QpO1xuICBjb25zdCBzZWNvbmRSb290RW5kID0gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBzZWNvbmRSb290KTtcbiAgY29uc3QgY2FuRml4ID0gY2FuUmVvcmRlckl0ZW1zKGZpcnN0Um9vdCwgc2Vjb25kUm9vdCk7XG5cbiAgbGV0IG5ld0NvZGUgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKHNlY29uZFJvb3RTdGFydCwgc2Vjb25kUm9vdEVuZCk7XG4gIGlmIChuZXdDb2RlW25ld0NvZGUubGVuZ3RoIC0gMV0gIT09ICdcXG4nKSB7XG4gICAgbmV3Q29kZSA9IG5ld0NvZGUgKyAnXFxuJztcbiAgfVxuXG4gIGNvbnN0IGZpcnN0SW1wb3J0ID0gYCR7bWFrZUltcG9ydERlc2NyaXB0aW9uKGZpcnN0Tm9kZSl9IG9mIFxcYCR7Zmlyc3ROb2RlLmRpc3BsYXlOYW1lfVxcYGA7XG4gIGNvbnN0IHNlY29uZEltcG9ydCA9IGBcXGAke3NlY29uZE5vZGUuZGlzcGxheU5hbWV9XFxgICR7bWFrZUltcG9ydERlc2NyaXB0aW9uKHNlY29uZE5vZGUpfWA7XG4gIGNvbnN0IG1lc3NhZ2UgPSBgJHtzZWNvbmRJbXBvcnR9IHNob3VsZCBvY2N1ciAke29yZGVyfSAke2ZpcnN0SW1wb3J0fWA7XG5cbiAgaWYgKG9yZGVyID09PSAnYmVmb3JlJykge1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG5vZGU6IHNlY29uZE5vZGUubm9kZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBmaXg6IGNhbkZpeCAmJiAoZml4ZXIgPT5cbiAgICAgICAgZml4ZXIucmVwbGFjZVRleHRSYW5nZShcbiAgICAgICAgICBbZmlyc3RSb290U3RhcnQsIHNlY29uZFJvb3RFbmRdLFxuICAgICAgICAgIG5ld0NvZGUgKyBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKGZpcnN0Um9vdFN0YXJ0LCBzZWNvbmRSb290U3RhcnQpLFxuICAgICAgICApKSxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChvcmRlciA9PT0gJ2FmdGVyJykge1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG5vZGU6IHNlY29uZE5vZGUubm9kZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBmaXg6IGNhbkZpeCAmJiAoZml4ZXIgPT5cbiAgICAgICAgZml4ZXIucmVwbGFjZVRleHRSYW5nZShcbiAgICAgICAgICBbc2Vjb25kUm9vdFN0YXJ0LCBmaXJzdFJvb3RFbmRdLFxuICAgICAgICAgIHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcoc2Vjb25kUm9vdEVuZCwgZmlyc3RSb290RW5kKSArIG5ld0NvZGUsXG4gICAgICAgICkpLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlcG9ydE91dE9mT3JkZXIoY29udGV4dCwgaW1wb3J0ZWQsIG91dE9mT3JkZXIsIG9yZGVyKSB7XG4gIG91dE9mT3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoaW1wKSB7XG4gICAgY29uc3QgZm91bmQgPSBpbXBvcnRlZC5maW5kKGZ1bmN0aW9uIGhhc0hpZ2hlclJhbmsoaW1wb3J0ZWRJdGVtKSB7XG4gICAgICByZXR1cm4gaW1wb3J0ZWRJdGVtLnJhbmsgPiBpbXAucmFuaztcbiAgICB9KTtcbiAgICBmaXhPdXRPZk9yZGVyKGNvbnRleHQsIGZvdW5kLCBpbXAsIG9yZGVyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VPdXRPZk9yZGVyUmVwb3J0KGNvbnRleHQsIGltcG9ydGVkKSB7XG4gIGNvbnN0IG91dE9mT3JkZXIgPSBmaW5kT3V0T2ZPcmRlcihpbXBvcnRlZCk7XG4gIGlmICghb3V0T2ZPcmRlci5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gVGhlcmUgYXJlIHRoaW5ncyB0byByZXBvcnQuIFRyeSB0byBtaW5pbWl6ZSB0aGUgbnVtYmVyIG9mIHJlcG9ydGVkIGVycm9ycy5cbiAgY29uc3QgcmV2ZXJzZWRJbXBvcnRlZCA9IHJldmVyc2UoaW1wb3J0ZWQpO1xuICBjb25zdCByZXZlcnNlZE9yZGVyID0gZmluZE91dE9mT3JkZXIocmV2ZXJzZWRJbXBvcnRlZCk7XG4gIGlmIChyZXZlcnNlZE9yZGVyLmxlbmd0aCA8IG91dE9mT3JkZXIubGVuZ3RoKSB7XG4gICAgcmVwb3J0T3V0T2ZPcmRlcihjb250ZXh0LCByZXZlcnNlZEltcG9ydGVkLCByZXZlcnNlZE9yZGVyLCAnYWZ0ZXInKTtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVwb3J0T3V0T2ZPcmRlcihjb250ZXh0LCBpbXBvcnRlZCwgb3V0T2ZPcmRlciwgJ2JlZm9yZScpO1xufVxuXG5jb25zdCBjb21wYXJlU3RyaW5nID0gKGEsIGIpID0+IHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChhID4gYikge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuLyoqIFNvbWUgcGFyc2VycyAobGFuZ3VhZ2VzIHdpdGhvdXQgdHlwZXMpIGRvbid0IHByb3ZpZGUgSW1wb3J0S2luZCAqL1xuY29uc3QgREVBRlVMVF9JTVBPUlRfS0lORCA9ICd2YWx1ZSc7XG5jb25zdCBnZXROb3JtYWxpemVkVmFsdWUgPSAobm9kZSwgdG9Mb3dlckNhc2UpID0+IHtcbiAgY29uc3QgdmFsdWUgPSBub2RlLnZhbHVlO1xuICByZXR1cm4gdG9Mb3dlckNhc2UgPyBTdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCkgOiB2YWx1ZTtcbn07XG5cbmZ1bmN0aW9uIGdldFNvcnRlcihhbHBoYWJldGl6ZU9wdGlvbnMpIHtcbiAgY29uc3QgbXVsdGlwbGllciA9IGFscGhhYmV0aXplT3B0aW9ucy5vcmRlciA9PT0gJ2FzYycgPyAxIDogLTE7XG4gIGNvbnN0IG9yZGVySW1wb3J0S2luZCA9IGFscGhhYmV0aXplT3B0aW9ucy5vcmRlckltcG9ydEtpbmQ7XG4gIGNvbnN0IG11bHRpcGxpZXJJbXBvcnRLaW5kID0gb3JkZXJJbXBvcnRLaW5kICE9PSAnaWdub3JlJyAmJlxuICAgIChhbHBoYWJldGl6ZU9wdGlvbnMub3JkZXJJbXBvcnRLaW5kID09PSAnYXNjJyA/IDEgOiAtMSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGltcG9ydHNTb3J0ZXIobm9kZUEsIG5vZGVCKSB7XG4gICAgY29uc3QgaW1wb3J0QSA9IGdldE5vcm1hbGl6ZWRWYWx1ZShub2RlQSwgYWxwaGFiZXRpemVPcHRpb25zLmNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgY29uc3QgaW1wb3J0QiA9IGdldE5vcm1hbGl6ZWRWYWx1ZShub2RlQiwgYWxwaGFiZXRpemVPcHRpb25zLmNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgbGV0IHJlc3VsdCA9IDA7XG5cbiAgICBpZiAoIWluY2x1ZGVzKGltcG9ydEEsICcvJykgJiYgIWluY2x1ZGVzKGltcG9ydEIsICcvJykpIHtcbiAgICAgIHJlc3VsdCA9IGNvbXBhcmVTdHJpbmcoaW1wb3J0QSwgaW1wb3J0Qik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IEEgPSBpbXBvcnRBLnNwbGl0KCcvJyk7XG4gICAgICBjb25zdCBCID0gaW1wb3J0Qi5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgYSA9IEEubGVuZ3RoO1xuICAgICAgY29uc3QgYiA9IEIubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluKGEsIGIpOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGFyZVN0cmluZyhBW2ldLCBCW2ldKTtcbiAgICAgICAgaWYgKHJlc3VsdCkgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzdWx0ICYmIGEgIT09IGIpIHtcbiAgICAgICAgcmVzdWx0ID0gYSA8IGIgPyAtMSA6IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0ID0gcmVzdWx0ICogbXVsdGlwbGllcjtcblxuICAgIC8vIEluIGNhc2UgdGhlIHBhdGhzIGFyZSBlcXVhbCAocmVzdWx0ID09PSAwKSwgc29ydCB0aGVtIGJ5IGltcG9ydEtpbmRcbiAgICBpZiAoIXJlc3VsdCAmJiBtdWx0aXBsaWVySW1wb3J0S2luZCkge1xuICAgICAgcmVzdWx0ID0gbXVsdGlwbGllckltcG9ydEtpbmQgKiBjb21wYXJlU3RyaW5nKFxuICAgICAgICBub2RlQS5ub2RlLmltcG9ydEtpbmQgfHwgREVBRlVMVF9JTVBPUlRfS0lORCxcbiAgICAgICAgbm9kZUIubm9kZS5pbXBvcnRLaW5kIHx8IERFQUZVTFRfSU1QT1JUX0tJTkQsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZShpbXBvcnRlZCwgYWxwaGFiZXRpemVPcHRpb25zKSB7XG4gIGNvbnN0IGdyb3VwZWRCeVJhbmtzID0gaW1wb3J0ZWQucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGltcG9ydGVkSXRlbSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhY2NbaW1wb3J0ZWRJdGVtLnJhbmtdKSkge1xuICAgICAgYWNjW2ltcG9ydGVkSXRlbS5yYW5rXSA9IFtdO1xuICAgIH1cbiAgICBhY2NbaW1wb3J0ZWRJdGVtLnJhbmtdLnB1c2goaW1wb3J0ZWRJdGVtKTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgY29uc3Qgc29ydGVyRm4gPSBnZXRTb3J0ZXIoYWxwaGFiZXRpemVPcHRpb25zKTtcblxuICAvLyBzb3J0IGdyb3VwIGtleXMgc28gdGhhdCB0aGV5IGNhbiBiZSBpdGVyYXRlZCBvbiBpbiBvcmRlclxuICBjb25zdCBncm91cFJhbmtzID0gT2JqZWN0LmtleXMoZ3JvdXBlZEJ5UmFua3MpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYSAtIGI7XG4gIH0pO1xuXG4gIC8vIHNvcnQgaW1wb3J0cyBsb2NhbGx5IHdpdGhpbiB0aGVpciBncm91cFxuICBncm91cFJhbmtzLmZvckVhY2goZnVuY3Rpb24gKGdyb3VwUmFuaykge1xuICAgIGdyb3VwZWRCeVJhbmtzW2dyb3VwUmFua10uc29ydChzb3J0ZXJGbik7XG4gIH0pO1xuXG4gIC8vIGFzc2lnbiBnbG9iYWxseSB1bmlxdWUgcmFuayB0byBlYWNoIGltcG9ydFxuICBsZXQgbmV3UmFuayA9IDA7XG4gIGNvbnN0IGFscGhhYmV0aXplZFJhbmtzID0gZ3JvdXBSYW5rcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZ3JvdXBSYW5rKSB7XG4gICAgZ3JvdXBlZEJ5UmFua3NbZ3JvdXBSYW5rXS5mb3JFYWNoKGZ1bmN0aW9uIChpbXBvcnRlZEl0ZW0pIHtcbiAgICAgIGFjY1tgJHtpbXBvcnRlZEl0ZW0udmFsdWV9fCR7aW1wb3J0ZWRJdGVtLm5vZGUuaW1wb3J0S2luZH1gXSA9IHBhcnNlSW50KGdyb3VwUmFuaywgMTApICsgbmV3UmFuaztcbiAgICAgIG5ld1JhbmsgKz0gMTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgLy8gbXV0YXRlIHRoZSBvcmlnaW5hbCBncm91cC1yYW5rIHdpdGggYWxwaGFiZXRpemVkLXJhbmtcbiAgaW1wb3J0ZWQuZm9yRWFjaChmdW5jdGlvbiAoaW1wb3J0ZWRJdGVtKSB7XG4gICAgaW1wb3J0ZWRJdGVtLnJhbmsgPSBhbHBoYWJldGl6ZWRSYW5rc1tgJHtpbXBvcnRlZEl0ZW0udmFsdWV9fCR7aW1wb3J0ZWRJdGVtLm5vZGUuaW1wb3J0S2luZH1gXTtcbiAgfSk7XG59XG5cbi8vIERFVEVDVElOR1xuXG5mdW5jdGlvbiBjb21wdXRlUGF0aFJhbmsocmFua3MsIHBhdGhHcm91cHMsIHBhdGgsIG1heFBvc2l0aW9uKSB7XG4gIGZvciAobGV0IGkgPSAwLCBsID0gcGF0aEdyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCB7IHBhdHRlcm4sIHBhdHRlcm5PcHRpb25zLCBncm91cCwgcG9zaXRpb24gPSAxIH0gPSBwYXRoR3JvdXBzW2ldO1xuICAgIGlmIChtaW5pbWF0Y2gocGF0aCwgcGF0dGVybiwgcGF0dGVybk9wdGlvbnMgfHwgeyBub2NvbW1lbnQ6IHRydWUgfSkpIHtcbiAgICAgIHJldHVybiByYW5rc1tncm91cF0gKyAocG9zaXRpb24gLyBtYXhQb3NpdGlvbik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVSYW5rKGNvbnRleHQsIHJhbmtzLCBpbXBvcnRFbnRyeSwgZXhjbHVkZWRJbXBvcnRUeXBlcykge1xuICBsZXQgaW1wVHlwZTtcbiAgbGV0IHJhbms7XG4gIGlmIChpbXBvcnRFbnRyeS50eXBlID09PSAnaW1wb3J0Om9iamVjdCcpIHtcbiAgICBpbXBUeXBlID0gJ29iamVjdCc7XG4gIH0gZWxzZSBpZiAoaW1wb3J0RW50cnkubm9kZS5pbXBvcnRLaW5kID09PSAndHlwZScgJiYgcmFua3Mub21pdHRlZFR5cGVzLmluZGV4T2YoJ3R5cGUnKSA9PT0gLTEpIHtcbiAgICBpbXBUeXBlID0gJ3R5cGUnO1xuICB9IGVsc2Uge1xuICAgIGltcFR5cGUgPSBpbXBvcnRUeXBlKGltcG9ydEVudHJ5LnZhbHVlLCBjb250ZXh0KTtcbiAgfVxuICBpZiAoIWV4Y2x1ZGVkSW1wb3J0VHlwZXMuaGFzKGltcFR5cGUpKSB7XG4gICAgcmFuayA9IGNvbXB1dGVQYXRoUmFuayhyYW5rcy5ncm91cHMsIHJhbmtzLnBhdGhHcm91cHMsIGltcG9ydEVudHJ5LnZhbHVlLCByYW5rcy5tYXhQb3NpdGlvbik7XG4gIH1cbiAgaWYgKHR5cGVvZiByYW5rID09PSAndW5kZWZpbmVkJykge1xuICAgIHJhbmsgPSByYW5rcy5ncm91cHNbaW1wVHlwZV07XG4gIH1cbiAgaWYgKGltcG9ydEVudHJ5LnR5cGUgIT09ICdpbXBvcnQnICYmICFpbXBvcnRFbnRyeS50eXBlLnN0YXJ0c1dpdGgoJ2ltcG9ydDonKSkge1xuICAgIHJhbmsgKz0gMTAwO1xuICB9XG5cbiAgcmV0dXJuIHJhbms7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyTm9kZShjb250ZXh0LCBpbXBvcnRFbnRyeSwgcmFua3MsIGltcG9ydGVkLCBleGNsdWRlZEltcG9ydFR5cGVzKSB7XG4gIGNvbnN0IHJhbmsgPSBjb21wdXRlUmFuayhjb250ZXh0LCByYW5rcywgaW1wb3J0RW50cnksIGV4Y2x1ZGVkSW1wb3J0VHlwZXMpO1xuICBpZiAocmFuayAhPT0gLTEpIHtcbiAgICBpbXBvcnRlZC5wdXNoKE9iamVjdC5hc3NpZ24oe30sIGltcG9ydEVudHJ5LCB7IHJhbmsgfSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJlcXVpcmVCbG9jayhub2RlKSB7XG4gIGxldCBuID0gbm9kZTtcbiAgLy8gSGFuZGxlIGNhc2VzIGxpa2UgYGNvbnN0IGJheiA9IHJlcXVpcmUoJ2ZvbycpLmJhci5iYXpgXG4gIC8vIGFuZCBgY29uc3QgZm9vID0gcmVxdWlyZSgnZm9vJykoKWBcbiAgd2hpbGUgKFxuICAgIChuLnBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiYgbi5wYXJlbnQub2JqZWN0ID09PSBuKSB8fFxuICAgIChuLnBhcmVudC50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nICYmIG4ucGFyZW50LmNhbGxlZSA9PT0gbilcbiAgKSB7XG4gICAgbiA9IG4ucGFyZW50O1xuICB9XG4gIGlmIChcbiAgICBuLnBhcmVudC50eXBlID09PSAnVmFyaWFibGVEZWNsYXJhdG9yJyAmJlxuICAgIG4ucGFyZW50LnBhcmVudC50eXBlID09PSAnVmFyaWFibGVEZWNsYXJhdGlvbicgJiZcbiAgICBuLnBhcmVudC5wYXJlbnQucGFyZW50LnR5cGUgPT09ICdQcm9ncmFtJ1xuICApIHtcbiAgICByZXR1cm4gbi5wYXJlbnQucGFyZW50LnBhcmVudDtcbiAgfVxufVxuXG5jb25zdCB0eXBlcyA9IFsnYnVpbHRpbicsICdleHRlcm5hbCcsICdpbnRlcm5hbCcsICd1bmtub3duJywgJ3BhcmVudCcsICdzaWJsaW5nJywgJ2luZGV4JywgJ29iamVjdCcsICd0eXBlJ107XG5cbi8vIENyZWF0ZXMgYW4gb2JqZWN0IHdpdGggdHlwZS1yYW5rIHBhaXJzLlxuLy8gRXhhbXBsZTogeyBpbmRleDogMCwgc2libGluZzogMSwgcGFyZW50OiAxLCBleHRlcm5hbDogMSwgYnVpbHRpbjogMiwgaW50ZXJuYWw6IDIgfVxuLy8gV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBpdCBjb250YWlucyBhIHR5cGUgdGhhdCBkb2VzIG5vdCBleGlzdCwgb3IgaGFzIGEgZHVwbGljYXRlXG5mdW5jdGlvbiBjb252ZXJ0R3JvdXBzVG9SYW5rcyhncm91cHMpIHtcbiAgY29uc3QgcmFua09iamVjdCA9IGdyb3Vwcy5yZWR1Y2UoZnVuY3Rpb24gKHJlcywgZ3JvdXAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBncm91cCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGdyb3VwID0gW2dyb3VwXTtcbiAgICB9XG4gICAgZ3JvdXAuZm9yRWFjaChmdW5jdGlvbiAoZ3JvdXBJdGVtKSB7XG4gICAgICBpZiAodHlwZXMuaW5kZXhPZihncm91cEl0ZW0pID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBjb25maWd1cmF0aW9uIG9mIHRoZSBydWxlOiBVbmtub3duIHR5cGUgYCcgK1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGdyb3VwSXRlbSkgKyAnYCcpO1xuICAgICAgfVxuICAgICAgaWYgKHJlc1tncm91cEl0ZW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgY29uZmlndXJhdGlvbiBvZiB0aGUgcnVsZTogYCcgKyBncm91cEl0ZW0gKyAnYCBpcyBkdXBsaWNhdGVkJyk7XG4gICAgICB9XG4gICAgICByZXNbZ3JvdXBJdGVtXSA9IGluZGV4ICogMjtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9LCB7fSk7XG5cbiAgY29uc3Qgb21pdHRlZFR5cGVzID0gdHlwZXMuZmlsdGVyKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHJhbmtPYmplY3RbdHlwZV0gPT09IHVuZGVmaW5lZDtcbiAgfSk7XG5cbiAgY29uc3QgcmFua3MgPSBvbWl0dGVkVHlwZXMucmVkdWNlKGZ1bmN0aW9uIChyZXMsIHR5cGUpIHtcbiAgICByZXNbdHlwZV0gPSBncm91cHMubGVuZ3RoICogMjtcbiAgICByZXR1cm4gcmVzO1xuICB9LCByYW5rT2JqZWN0KTtcblxuICByZXR1cm4geyBncm91cHM6IHJhbmtzLCBvbWl0dGVkVHlwZXMgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBhdGhHcm91cHNGb3JSYW5rcyhwYXRoR3JvdXBzKSB7XG4gIGNvbnN0IGFmdGVyID0ge307XG4gIGNvbnN0IGJlZm9yZSA9IHt9O1xuXG4gIGNvbnN0IHRyYW5zZm9ybWVkID0gcGF0aEdyb3Vwcy5tYXAoKHBhdGhHcm91cCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IGdyb3VwLCBwb3NpdGlvbjogcG9zaXRpb25TdHJpbmcgfSA9IHBhdGhHcm91cDtcbiAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgIGlmIChwb3NpdGlvblN0cmluZyA9PT0gJ2FmdGVyJykge1xuICAgICAgaWYgKCFhZnRlcltncm91cF0pIHtcbiAgICAgICAgYWZ0ZXJbZ3JvdXBdID0gMTtcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uID0gYWZ0ZXJbZ3JvdXBdKys7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvblN0cmluZyA9PT0gJ2JlZm9yZScpIHtcbiAgICAgIGlmICghYmVmb3JlW2dyb3VwXSkge1xuICAgICAgICBiZWZvcmVbZ3JvdXBdID0gW107XG4gICAgICB9XG4gICAgICBiZWZvcmVbZ3JvdXBdLnB1c2goaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwYXRoR3JvdXAsIHsgcG9zaXRpb24gfSk7XG4gIH0pO1xuXG4gIGxldCBtYXhQb3NpdGlvbiA9IDE7XG5cbiAgT2JqZWN0LmtleXMoYmVmb3JlKS5mb3JFYWNoKChncm91cCkgPT4ge1xuICAgIGNvbnN0IGdyb3VwTGVuZ3RoID0gYmVmb3JlW2dyb3VwXS5sZW5ndGg7XG4gICAgYmVmb3JlW2dyb3VwXS5mb3JFYWNoKChncm91cEluZGV4LCBpbmRleCkgPT4ge1xuICAgICAgdHJhbnNmb3JtZWRbZ3JvdXBJbmRleF0ucG9zaXRpb24gPSAtMSAqIChncm91cExlbmd0aCAtIGluZGV4KTtcbiAgICB9KTtcbiAgICBtYXhQb3NpdGlvbiA9IE1hdGgubWF4KG1heFBvc2l0aW9uLCBncm91cExlbmd0aCk7XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKGFmdGVyKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCBncm91cE5leHRQb3NpdGlvbiA9IGFmdGVyW2tleV07XG4gICAgbWF4UG9zaXRpb24gPSBNYXRoLm1heChtYXhQb3NpdGlvbiwgZ3JvdXBOZXh0UG9zaXRpb24gLSAxKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwYXRoR3JvdXBzOiB0cmFuc2Zvcm1lZCxcbiAgICBtYXhQb3NpdGlvbjogbWF4UG9zaXRpb24gPiAxMCA/IE1hdGgucG93KDEwLCBNYXRoLmNlaWwoTWF0aC5sb2cxMChtYXhQb3NpdGlvbikpKSA6IDEwLFxuICB9O1xufVxuXG5mdW5jdGlvbiBmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgcHJldmlvdXNJbXBvcnQpIHtcbiAgY29uc3QgcHJldlJvb3QgPSBmaW5kUm9vdE5vZGUocHJldmlvdXNJbXBvcnQubm9kZSk7XG4gIGNvbnN0IHRva2Vuc1RvRW5kT2ZMaW5lID0gdGFrZVRva2Vuc0FmdGVyV2hpbGUoXG4gICAgY29udGV4dC5nZXRTb3VyY2VDb2RlKCksIHByZXZSb290LCBjb21tZW50T25TYW1lTGluZUFzKHByZXZSb290KSk7XG5cbiAgbGV0IGVuZE9mTGluZSA9IHByZXZSb290LnJhbmdlWzFdO1xuICBpZiAodG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoID4gMCkge1xuICAgIGVuZE9mTGluZSA9IHRva2Vuc1RvRW5kT2ZMaW5lW3Rva2Vuc1RvRW5kT2ZMaW5lLmxlbmd0aCAtIDFdLnJhbmdlWzFdO1xuICB9XG4gIHJldHVybiAoZml4ZXIpID0+IGZpeGVyLmluc2VydFRleHRBZnRlclJhbmdlKFtwcmV2Um9vdC5yYW5nZVswXSwgZW5kT2ZMaW5lXSwgJ1xcbicpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpIHtcbiAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuICBjb25zdCBwcmV2Um9vdCA9IGZpbmRSb290Tm9kZShwcmV2aW91c0ltcG9ydC5ub2RlKTtcbiAgY29uc3QgY3VyclJvb3QgPSBmaW5kUm9vdE5vZGUoY3VycmVudEltcG9ydC5ub2RlKTtcbiAgY29uc3QgcmFuZ2VUb1JlbW92ZSA9IFtcbiAgICBmaW5kRW5kT2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIHByZXZSb290KSxcbiAgICBmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgY3VyclJvb3QpLFxuICBdO1xuICBpZiAoL15cXHMqJC8udGVzdChzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKHJhbmdlVG9SZW1vdmVbMF0sIHJhbmdlVG9SZW1vdmVbMV0pKSkge1xuICAgIHJldHVybiAoZml4ZXIpID0+IGZpeGVyLnJlbW92ZVJhbmdlKHJhbmdlVG9SZW1vdmUpO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIG1ha2VOZXdsaW5lc0JldHdlZW5SZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQsIG5ld2xpbmVzQmV0d2VlbkltcG9ydHMsIGRpc3RpbmN0R3JvdXApIHtcbiAgY29uc3QgZ2V0TnVtYmVyT2ZFbXB0eUxpbmVzQmV0d2VlbiA9IChjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkgPT4ge1xuICAgIGNvbnN0IGxpbmVzQmV0d2VlbkltcG9ydHMgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKS5saW5lcy5zbGljZShcbiAgICAgIHByZXZpb3VzSW1wb3J0Lm5vZGUubG9jLmVuZC5saW5lLFxuICAgICAgY3VycmVudEltcG9ydC5ub2RlLmxvYy5zdGFydC5saW5lIC0gMSxcbiAgICApO1xuXG4gICAgcmV0dXJuIGxpbmVzQmV0d2VlbkltcG9ydHMuZmlsdGVyKChsaW5lKSA9PiAhbGluZS50cmltKCkubGVuZ3RoKS5sZW5ndGg7XG4gIH07XG4gIGNvbnN0IGdldElzU3RhcnRPZkRpc3RpbmN0R3JvdXAgPSAoY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpID0+IHtcbiAgICByZXR1cm4gY3VycmVudEltcG9ydC5yYW5rIC0gMSA+PSBwcmV2aW91c0ltcG9ydC5yYW5rO1xuICB9O1xuICBsZXQgcHJldmlvdXNJbXBvcnQgPSBpbXBvcnRlZFswXTtcblxuICBpbXBvcnRlZC5zbGljZSgxKS5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50SW1wb3J0KSB7XG4gICAgY29uc3QgZW1wdHlMaW5lc0JldHdlZW4gPSBnZXROdW1iZXJPZkVtcHR5TGluZXNCZXR3ZWVuKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KTtcbiAgICBjb25zdCBpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwID0gZ2V0SXNTdGFydE9mRGlzdGluY3RHcm91cChjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCk7XG5cbiAgICBpZiAobmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9PT0gJ2Fsd2F5cydcbiAgICAgICAgfHwgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9PT0gJ2Fsd2F5cy1hbmQtaW5zaWRlLWdyb3VwcycpIHtcbiAgICAgIGlmIChjdXJyZW50SW1wb3J0LnJhbmsgIT09IHByZXZpb3VzSW1wb3J0LnJhbmsgJiYgZW1wdHlMaW5lc0JldHdlZW4gPT09IDApIHtcbiAgICAgICAgaWYgKGRpc3RpbmN0R3JvdXAgfHwgKCFkaXN0aW5jdEdyb3VwICYmIGlzU3RhcnRPZkRpc3RpbmN0R3JvdXApKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogcHJldmlvdXNJbXBvcnQubm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGVyZSBzaG91bGQgYmUgYXQgbGVhc3Qgb25lIGVtcHR5IGxpbmUgYmV0d2VlbiBpbXBvcnQgZ3JvdXBzJyxcbiAgICAgICAgICAgIGZpeDogZml4TmV3TGluZUFmdGVySW1wb3J0KGNvbnRleHQsIHByZXZpb3VzSW1wb3J0KSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbXB0eUxpbmVzQmV0d2VlbiA+IDBcbiAgICAgICAgJiYgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyAhPT0gJ2Fsd2F5cy1hbmQtaW5zaWRlLWdyb3VwcycpIHtcbiAgICAgICAgaWYgKChkaXN0aW5jdEdyb3VwICYmIGN1cnJlbnRJbXBvcnQucmFuayA9PT0gcHJldmlvdXNJbXBvcnQucmFuaykgfHwgKCFkaXN0aW5jdEdyb3VwICYmICFpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHByZXZpb3VzSW1wb3J0Lm5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIG5vIGVtcHR5IGxpbmUgd2l0aGluIGltcG9ydCBncm91cCcsXG4gICAgICAgICAgICBmaXg6IHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVtcHR5TGluZXNCZXR3ZWVuID4gMCkge1xuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlOiBwcmV2aW91c0ltcG9ydC5ub2RlLFxuICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIG5vIGVtcHR5IGxpbmUgYmV0d2VlbiBpbXBvcnQgZ3JvdXBzJyxcbiAgICAgICAgZml4OiByZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNJbXBvcnQgPSBjdXJyZW50SW1wb3J0O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFiZXRpemVDb25maWcob3B0aW9ucykge1xuICBjb25zdCBhbHBoYWJldGl6ZSA9IG9wdGlvbnMuYWxwaGFiZXRpemUgfHwge307XG4gIGNvbnN0IG9yZGVyID0gYWxwaGFiZXRpemUub3JkZXIgfHwgJ2lnbm9yZSc7XG4gIGNvbnN0IG9yZGVySW1wb3J0S2luZCA9IGFscGhhYmV0aXplLm9yZGVySW1wb3J0S2luZCB8fCAnaWdub3JlJztcbiAgY29uc3QgY2FzZUluc2Vuc2l0aXZlID0gYWxwaGFiZXRpemUuY2FzZUluc2Vuc2l0aXZlIHx8IGZhbHNlO1xuXG4gIHJldHVybiB7IG9yZGVyLCBvcmRlckltcG9ydEtpbmQsIGNhc2VJbnNlbnNpdGl2ZSB9O1xufVxuXG4vLyBUT0RPLCBzZW12ZXItbWFqb3I6IENoYW5nZSB0aGUgZGVmYXVsdCBvZiBcImRpc3RpbmN0R3JvdXBcIiBmcm9tIHRydWUgdG8gZmFsc2VcbmNvbnN0IGRlZmF1bHREaXN0aW5jdEdyb3VwID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuZm9yY2UgYSBjb252ZW50aW9uIGluIG1vZHVsZSBpbXBvcnQgb3JkZXIuJyxcbiAgICAgIHVybDogZG9jc1VybCgnb3JkZXInKSxcbiAgICB9LFxuXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGdyb3Vwczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzdGluY3RHcm91cDoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZGVmYXVsdERpc3RpbmN0R3JvdXAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwYXRoR3JvdXBzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBhdHRlcm5PcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdyb3VwOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIGVudW06IHR5cGVzLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgZW51bTogWydhZnRlcicsICdiZWZvcmUnXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3BhdHRlcm4nLCAnZ3JvdXAnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnbmV3bGluZXMtYmV0d2Vlbic6IHtcbiAgICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgICAgJ2lnbm9yZScsXG4gICAgICAgICAgICAgICdhbHdheXMnLFxuICAgICAgICAgICAgICAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJyxcbiAgICAgICAgICAgICAgJ25ldmVyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhbHBoYWJldGl6ZToge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGNhc2VJbnNlbnNpdGl2ZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgb3JkZXI6IHtcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2lnbm9yZScsICdhc2MnLCAnZGVzYyddLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdpZ25vcmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvcmRlckltcG9ydEtpbmQ6IHtcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2lnbm9yZScsICdhc2MnLCAnZGVzYyddLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdpZ25vcmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdhcm5PblVuYXNzaWduZWRJbXBvcnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiBpbXBvcnRPcmRlclJ1bGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9IG9wdGlvbnNbJ25ld2xpbmVzLWJldHdlZW4nXSB8fCAnaWdub3JlJztcbiAgICBjb25zdCBwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyA9IG5ldyBTZXQob3B0aW9uc1sncGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXMnXSB8fCBbJ2J1aWx0aW4nLCAnZXh0ZXJuYWwnLCAnb2JqZWN0J10pO1xuICAgIGNvbnN0IGFscGhhYmV0aXplID0gZ2V0QWxwaGFiZXRpemVDb25maWcob3B0aW9ucyk7XG4gICAgY29uc3QgZGlzdGluY3RHcm91cCA9IG9wdGlvbnMuZGlzdGluY3RHcm91cCA9PSBudWxsID8gZGVmYXVsdERpc3RpbmN0R3JvdXAgOiAhIW9wdGlvbnMuZGlzdGluY3RHcm91cDtcbiAgICBsZXQgcmFua3M7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBwYXRoR3JvdXBzLCBtYXhQb3NpdGlvbiB9ID0gY29udmVydFBhdGhHcm91cHNGb3JSYW5rcyhvcHRpb25zLnBhdGhHcm91cHMgfHwgW10pO1xuICAgICAgY29uc3QgeyBncm91cHMsIG9taXR0ZWRUeXBlcyB9ID0gY29udmVydEdyb3Vwc1RvUmFua3Mob3B0aW9ucy5ncm91cHMgfHwgZGVmYXVsdEdyb3Vwcyk7XG4gICAgICByYW5rcyA9IHtcbiAgICAgICAgZ3JvdXBzLFxuICAgICAgICBvbWl0dGVkVHlwZXMsXG4gICAgICAgIHBhdGhHcm91cHMsXG4gICAgICAgIG1heFBvc2l0aW9uLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gTWFsZm9ybWVkIGNvbmZpZ3VyYXRpb25cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFByb2dyYW0obm9kZSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgZnVuY3Rpb24gZ2V0QmxvY2tJbXBvcnRzKG5vZGUpIHtcbiAgICAgIGlmICghaW1wb3J0TWFwLmhhcyhub2RlKSkge1xuICAgICAgICBpbXBvcnRNYXAuc2V0KG5vZGUsIFtdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbXBvcnRNYXAuZ2V0KG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogZnVuY3Rpb24gaGFuZGxlSW1wb3J0cyhub2RlKSB7XG4gICAgICAgIC8vIElnbm9yaW5nIHVuYXNzaWduZWQgaW1wb3J0cyB1bmxlc3Mgd2Fybk9uVW5hc3NpZ25lZEltcG9ydHMgaXMgc2V0XG4gICAgICAgIGlmIChub2RlLnNwZWNpZmllcnMubGVuZ3RoIHx8IG9wdGlvbnMud2Fybk9uVW5hc3NpZ25lZEltcG9ydHMpIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5zb3VyY2UudmFsdWU7XG4gICAgICAgICAgcmVnaXN0ZXJOb2RlKFxuICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1wb3J0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5rcyxcbiAgICAgICAgICAgIGdldEJsb2NrSW1wb3J0cyhub2RlLnBhcmVudCksXG4gICAgICAgICAgICBwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjogZnVuY3Rpb24gaGFuZGxlSW1wb3J0cyhub2RlKSB7XG4gICAgICAgIGxldCBkaXNwbGF5TmFtZTtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBsZXQgdHlwZTtcbiAgICAgICAgLy8gc2tpcCBcImV4cG9ydCBpbXBvcnRcInNcbiAgICAgICAgaWYgKG5vZGUuaXNFeHBvcnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUubW9kdWxlUmVmZXJlbmNlLnR5cGUgPT09ICdUU0V4dGVybmFsTW9kdWxlUmVmZXJlbmNlJykge1xuICAgICAgICAgIHZhbHVlID0gbm9kZS5tb2R1bGVSZWZlcmVuY2UuZXhwcmVzc2lvbi52YWx1ZTtcbiAgICAgICAgICBkaXNwbGF5TmFtZSA9IHZhbHVlO1xuICAgICAgICAgIHR5cGUgPSAnaW1wb3J0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgIGRpc3BsYXlOYW1lID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuZ2V0VGV4dChub2RlLm1vZHVsZVJlZmVyZW5jZSk7XG4gICAgICAgICAgdHlwZSA9ICdpbXBvcnQ6b2JqZWN0JztcbiAgICAgICAgfVxuICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByYW5rcyxcbiAgICAgICAgICBnZXRCbG9ja0ltcG9ydHMobm9kZS5wYXJlbnQpLFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uOiBmdW5jdGlvbiBoYW5kbGVSZXF1aXJlcyhub2RlKSB7XG4gICAgICAgIGlmICghaXNTdGF0aWNSZXF1aXJlKG5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsb2NrID0gZ2V0UmVxdWlyZUJsb2NrKG5vZGUpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLmFyZ3VtZW50c1swXS52YWx1ZTtcbiAgICAgICAgcmVnaXN0ZXJOb2RlKFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIHZhbHVlOiBuYW1lLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiAncmVxdWlyZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByYW5rcyxcbiAgICAgICAgICBnZXRCbG9ja0ltcG9ydHMoYmxvY2spLFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiByZXBvcnRBbmRSZXNldCgpIHtcbiAgICAgICAgaW1wb3J0TWFwLmZvckVhY2goKGltcG9ydGVkKSA9PiB7XG4gICAgICAgICAgaWYgKG5ld2xpbmVzQmV0d2VlbkltcG9ydHMgIT09ICdpZ25vcmUnKSB7XG4gICAgICAgICAgICBtYWtlTmV3bGluZXNCZXR3ZWVuUmVwb3J0KGNvbnRleHQsIGltcG9ydGVkLCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzLCBkaXN0aW5jdEdyb3VwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYWxwaGFiZXRpemUub3JkZXIgIT09ICdpZ25vcmUnKSB7XG4gICAgICAgICAgICBtdXRhdGVSYW5rc1RvQWxwaGFiZXRpemUoaW1wb3J0ZWQsIGFscGhhYmV0aXplKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYWtlT3V0T2ZPcmRlclJlcG9ydChjb250ZXh0LCBpbXBvcnRlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGltcG9ydE1hcC5jbGVhcigpO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==