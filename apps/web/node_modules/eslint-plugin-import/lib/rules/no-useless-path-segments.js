'use strict';




var _ignore = require('eslint-module-utils/ignore');
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

/**
                                                                                                                                                                                       * convert a potentially relative path from node utils into a true
                                                                                                                                                                                       * relative path.
                                                                                                                                                                                       *
                                                                                                                                                                                       * ../ -> ..
                                                                                                                                                                                       * ./ -> .
                                                                                                                                                                                       * .foo/bar -> ./.foo/bar
                                                                                                                                                                                       * ..foo/bar -> ./..foo/bar
                                                                                                                                                                                       * foo/bar -> ./foo/bar
                                                                                                                                                                                       *
                                                                                                                                                                                       * @param relativePath {string} relative posix path potentially missing leading './'
                                                                                                                                                                                       * @returns {string} relative posix path that always starts with a ./
                                                                                                                                                                                       **/
function toRelativePath(relativePath) {
  var stripped = relativePath.replace(/\/$/g, ''); // Remove trailing /

  return (/^((\.\.)|(\.))($|\/)/.test(stripped) ? stripped : './' + String(stripped));
} /**
   * @fileOverview Ensures that there are no useless path segments
   * @author Thomas Grainger
   */function normalize(fn) {return toRelativePath(_path2['default'].posix.normalize(fn));
}

function countRelativeParents(pathSegments) {
  return pathSegments.reduce(function (sum, pathSegment) {return pathSegment === '..' ? sum + 1 : sum;}, 0);
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid unnecessary path segments in import and require statements.',
      url: (0, _docsUrl2['default'])('no-useless-path-segments') },


    fixable: 'code',

    schema: [
    {
      type: 'object',
      properties: {
        commonjs: { type: 'boolean' },
        noUselessIndex: { type: 'boolean' } },

      additionalProperties: false }] },




  create: function () {function create(context) {
      var currentDir = _path2['default'].dirname(context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
      var options = context.options[0];

      function checkSourceValue(source) {var
        importPath = source.value;

        function reportWithProposedPath(proposedPath) {
          context.report({
            node: source,
            // Note: Using messageIds is not possible due to the support for ESLint 2 and 3
            message: 'Useless path segments for "' + String(importPath) + '", should be "' + String(proposedPath) + '"',
            fix: function () {function fix(fixer) {return proposedPath && fixer.replaceText(source, JSON.stringify(proposedPath));}return fix;}() });

        }

        // Only relative imports are relevant for this rule --> Skip checking
        if (!importPath.startsWith('.')) {
          return;
        }

        // Report rule violation if path is not the shortest possible
        var resolvedPath = (0, _resolve2['default'])(importPath, context);
        var normedPath = normalize(importPath);
        var resolvedNormedPath = (0, _resolve2['default'])(normedPath, context);
        if (normedPath !== importPath && resolvedPath === resolvedNormedPath) {
          return reportWithProposedPath(normedPath);
        }

        var fileExtensions = (0, _ignore.getFileExtensions)(context.settings);
        var regexUnnecessaryIndex = new RegExp('.*\\/index(\\' + String(
        Array.from(fileExtensions).join('|\\')) + ')?$');


        // Check if path contains unnecessary index (including a configured extension)
        if (options && options.noUselessIndex && regexUnnecessaryIndex.test(importPath)) {
          var parentDirectory = _path2['default'].dirname(importPath);

          // Try to find ambiguous imports
          if (parentDirectory !== '.' && parentDirectory !== '..') {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
              for (var _iterator = fileExtensions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var fileExtension = _step.value;
                if ((0, _resolve2['default'])('' + String(parentDirectory) + String(fileExtension), context)) {
                  return reportWithProposedPath(String(parentDirectory) + '/');
                }
              }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
          }

          return reportWithProposedPath(parentDirectory);
        }

        // Path is shortest possible + starts from the current directory --> Return directly
        if (importPath.startsWith('./')) {
          return;
        }

        // Path is not existing --> Return directly (following code requires path to be defined)
        if (resolvedPath === undefined) {
          return;
        }

        var expected = _path2['default'].relative(currentDir, resolvedPath); // Expected import path
        var expectedSplit = expected.split(_path2['default'].sep); // Split by / or \ (depending on OS)
        var importPathSplit = importPath.replace(/^\.\//, '').split('/');
        var countImportPathRelativeParents = countRelativeParents(importPathSplit);
        var countExpectedRelativeParents = countRelativeParents(expectedSplit);
        var diff = countImportPathRelativeParents - countExpectedRelativeParents;

        // Same number of relative parents --> Paths are the same --> Return directly
        if (diff <= 0) {
          return;
        }

        // Report and propose minimal number of required relative parents
        return reportWithProposedPath(
        toRelativePath(
        importPathSplit.
        slice(0, countExpectedRelativeParents).
        concat(importPathSplit.slice(countImportPathRelativeParents + diff)).
        join('/')));


      }

      return (0, _moduleVisitor2['default'])(checkSourceValue, options);
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11c2VsZXNzLXBhdGgtc2VnbWVudHMuanMiXSwibmFtZXMiOlsidG9SZWxhdGl2ZVBhdGgiLCJyZWxhdGl2ZVBhdGgiLCJzdHJpcHBlZCIsInJlcGxhY2UiLCJ0ZXN0Iiwibm9ybWFsaXplIiwiZm4iLCJwYXRoIiwicG9zaXgiLCJjb3VudFJlbGF0aXZlUGFyZW50cyIsInBhdGhTZWdtZW50cyIsInJlZHVjZSIsInN1bSIsInBhdGhTZWdtZW50IiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsImNvbW1vbmpzIiwibm9Vc2VsZXNzSW5kZXgiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsImNvbnRleHQiLCJjdXJyZW50RGlyIiwiZGlybmFtZSIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm9wdGlvbnMiLCJjaGVja1NvdXJjZVZhbHVlIiwic291cmNlIiwiaW1wb3J0UGF0aCIsInZhbHVlIiwicmVwb3J0V2l0aFByb3Bvc2VkUGF0aCIsInByb3Bvc2VkUGF0aCIsInJlcG9ydCIsIm5vZGUiLCJtZXNzYWdlIiwiZml4IiwiZml4ZXIiLCJyZXBsYWNlVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFydHNXaXRoIiwicmVzb2x2ZWRQYXRoIiwibm9ybWVkUGF0aCIsInJlc29sdmVkTm9ybWVkUGF0aCIsImZpbGVFeHRlbnNpb25zIiwic2V0dGluZ3MiLCJyZWdleFVubmVjZXNzYXJ5SW5kZXgiLCJSZWdFeHAiLCJBcnJheSIsImZyb20iLCJqb2luIiwicGFyZW50RGlyZWN0b3J5IiwiZmlsZUV4dGVuc2lvbiIsInVuZGVmaW5lZCIsImV4cGVjdGVkIiwicmVsYXRpdmUiLCJleHBlY3RlZFNwbGl0Iiwic3BsaXQiLCJzZXAiLCJpbXBvcnRQYXRoU3BsaXQiLCJjb3VudEltcG9ydFBhdGhSZWxhdGl2ZVBhcmVudHMiLCJjb3VudEV4cGVjdGVkUmVsYXRpdmVQYXJlbnRzIiwiZGlmZiIsInNsaWNlIiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBO0FBQ0Esa0U7QUFDQSxzRDtBQUNBLDRCO0FBQ0EscUM7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFTQSxjQUFULENBQXdCQyxZQUF4QixFQUFzQztBQUNwQyxNQUFNQyxXQUFXRCxhQUFhRSxPQUFiLENBQXFCLE1BQXJCLEVBQTZCLEVBQTdCLENBQWpCLENBRG9DLENBQ2U7O0FBRW5ELFNBQU8sd0JBQXVCQyxJQUF2QixDQUE0QkYsUUFBNUIsSUFBd0NBLFFBQXhDLGlCQUF3REEsUUFBeEQsQ0FBUDtBQUNELEMsQ0E1QkQ7OztLQThCQSxTQUFTRyxTQUFULENBQW1CQyxFQUFuQixFQUF1QixDQUNyQixPQUFPTixlQUFlTyxrQkFBS0MsS0FBTCxDQUFXSCxTQUFYLENBQXFCQyxFQUFyQixDQUFmLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxvQkFBVCxDQUE4QkMsWUFBOUIsRUFBNEM7QUFDMUMsU0FBT0EsYUFBYUMsTUFBYixDQUFvQixVQUFDQyxHQUFELEVBQU1DLFdBQU4sVUFBc0JBLGdCQUFnQixJQUFoQixHQUF1QkQsTUFBTSxDQUE3QixHQUFpQ0EsR0FBdkQsRUFBcEIsRUFBZ0YsQ0FBaEYsQ0FBUDtBQUNEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsaUJBRE47QUFFSkMsbUJBQWEsb0VBRlQ7QUFHSkMsV0FBSywwQkFBUSwwQkFBUixDQUhELEVBRkY7OztBQVFKQyxhQUFTLE1BUkw7O0FBVUpDLFlBQVE7QUFDTjtBQUNFTixZQUFNLFFBRFI7QUFFRU8sa0JBQVk7QUFDVkMsa0JBQVUsRUFBRVIsTUFBTSxTQUFSLEVBREE7QUFFVlMsd0JBQWdCLEVBQUVULE1BQU0sU0FBUixFQUZOLEVBRmQ7O0FBTUVVLDRCQUFzQixLQU54QixFQURNLENBVkosRUFEUzs7Ozs7QUF1QmZDLFFBdkJlLCtCQXVCUkMsT0F2QlEsRUF1QkM7QUFDZCxVQUFNQyxhQUFhdkIsa0JBQUt3QixPQUFMLENBQWFGLFFBQVFHLG1CQUFSLEdBQThCSCxRQUFRRyxtQkFBUixFQUE5QixHQUE4REgsUUFBUUksV0FBUixFQUEzRSxDQUFuQjtBQUNBLFVBQU1DLFVBQVVMLFFBQVFLLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FBaEI7O0FBRUEsZUFBU0MsZ0JBQVQsQ0FBMEJDLE1BQTFCLEVBQWtDO0FBQ2pCQyxrQkFEaUIsR0FDRkQsTUFERSxDQUN4QkUsS0FEd0I7O0FBR2hDLGlCQUFTQyxzQkFBVCxDQUFnQ0MsWUFBaEMsRUFBOEM7QUFDNUNYLGtCQUFRWSxNQUFSLENBQWU7QUFDYkMsa0JBQU1OLE1BRE87QUFFYjtBQUNBTyw0REFBdUNOLFVBQXZDLDhCQUFrRUcsWUFBbEUsT0FIYTtBQUliSSw4QkFBSyw0QkFBU0osZ0JBQWdCSyxNQUFNQyxXQUFOLENBQWtCVixNQUFsQixFQUEwQlcsS0FBS0MsU0FBTCxDQUFlUixZQUFmLENBQTFCLENBQXpCLEVBQUwsY0FKYSxFQUFmOztBQU1EOztBQUVEO0FBQ0EsWUFBSSxDQUFDSCxXQUFXWSxVQUFYLENBQXNCLEdBQXRCLENBQUwsRUFBaUM7QUFDL0I7QUFDRDs7QUFFRDtBQUNBLFlBQU1DLGVBQWUsMEJBQVFiLFVBQVIsRUFBb0JSLE9BQXBCLENBQXJCO0FBQ0EsWUFBTXNCLGFBQWE5QyxVQUFVZ0MsVUFBVixDQUFuQjtBQUNBLFlBQU1lLHFCQUFxQiwwQkFBUUQsVUFBUixFQUFvQnRCLE9BQXBCLENBQTNCO0FBQ0EsWUFBSXNCLGVBQWVkLFVBQWYsSUFBNkJhLGlCQUFpQkUsa0JBQWxELEVBQXNFO0FBQ3BFLGlCQUFPYix1QkFBdUJZLFVBQXZCLENBQVA7QUFDRDs7QUFFRCxZQUFNRSxpQkFBaUIsK0JBQWtCeEIsUUFBUXlCLFFBQTFCLENBQXZCO0FBQ0EsWUFBTUMsd0JBQXdCLElBQUlDLE1BQUo7QUFDWkMsY0FBTUMsSUFBTixDQUFXTCxjQUFYLEVBQTJCTSxJQUEzQixDQUFnQyxLQUFoQyxDQURZLFVBQTlCOzs7QUFJQTtBQUNBLFlBQUl6QixXQUFXQSxRQUFRUixjQUFuQixJQUFxQzZCLHNCQUFzQm5ELElBQXRCLENBQTJCaUMsVUFBM0IsQ0FBekMsRUFBaUY7QUFDL0UsY0FBTXVCLGtCQUFrQnJELGtCQUFLd0IsT0FBTCxDQUFhTSxVQUFiLENBQXhCOztBQUVBO0FBQ0EsY0FBSXVCLG9CQUFvQixHQUFwQixJQUEyQkEsb0JBQW9CLElBQW5ELEVBQXlEO0FBQ3ZELG1DQUE0QlAsY0FBNUIsOEhBQTRDLEtBQWpDUSxhQUFpQztBQUMxQyxvQkFBSSxzQ0FBV0QsZUFBWCxXQUE2QkMsYUFBN0IsR0FBOENoQyxPQUE5QyxDQUFKLEVBQTREO0FBQzFELHlCQUFPVSw4QkFBMEJxQixlQUExQixRQUFQO0FBQ0Q7QUFDRixlQUxzRDtBQU14RDs7QUFFRCxpQkFBT3JCLHVCQUF1QnFCLGVBQXZCLENBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQUl2QixXQUFXWSxVQUFYLENBQXNCLElBQXRCLENBQUosRUFBaUM7QUFDL0I7QUFDRDs7QUFFRDtBQUNBLFlBQUlDLGlCQUFpQlksU0FBckIsRUFBZ0M7QUFDOUI7QUFDRDs7QUFFRCxZQUFNQyxXQUFXeEQsa0JBQUt5RCxRQUFMLENBQWNsQyxVQUFkLEVBQTBCb0IsWUFBMUIsQ0FBakIsQ0F4RGdDLENBd0QwQjtBQUMxRCxZQUFNZSxnQkFBZ0JGLFNBQVNHLEtBQVQsQ0FBZTNELGtCQUFLNEQsR0FBcEIsQ0FBdEIsQ0F6RGdDLENBeURnQjtBQUNoRCxZQUFNQyxrQkFBa0IvQixXQUFXbEMsT0FBWCxDQUFtQixPQUFuQixFQUE0QixFQUE1QixFQUFnQytELEtBQWhDLENBQXNDLEdBQXRDLENBQXhCO0FBQ0EsWUFBTUcsaUNBQWlDNUQscUJBQXFCMkQsZUFBckIsQ0FBdkM7QUFDQSxZQUFNRSwrQkFBK0I3RCxxQkFBcUJ3RCxhQUFyQixDQUFyQztBQUNBLFlBQU1NLE9BQU9GLGlDQUFpQ0MsNEJBQTlDOztBQUVBO0FBQ0EsWUFBSUMsUUFBUSxDQUFaLEVBQWU7QUFDYjtBQUNEOztBQUVEO0FBQ0EsZUFBT2hDO0FBQ0x2QztBQUNFb0U7QUFDR0ksYUFESCxDQUNTLENBRFQsRUFDWUYsNEJBRFo7QUFFR0csY0FGSCxDQUVVTCxnQkFBZ0JJLEtBQWhCLENBQXNCSCxpQ0FBaUNFLElBQXZELENBRlY7QUFHR1osWUFISCxDQUdRLEdBSFIsQ0FERixDQURLLENBQVA7OztBQVFEOztBQUVELGFBQU8sZ0NBQWN4QixnQkFBZCxFQUFnQ0QsT0FBaEMsQ0FBUDtBQUNELEtBM0djLG1CQUFqQiIsImZpbGUiOiJuby11c2VsZXNzLXBhdGgtc2VnbWVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgRW5zdXJlcyB0aGF0IHRoZXJlIGFyZSBubyB1c2VsZXNzIHBhdGggc2VnbWVudHNcbiAqIEBhdXRob3IgVGhvbWFzIEdyYWluZ2VyXG4gKi9cblxuaW1wb3J0IHsgZ2V0RmlsZUV4dGVuc2lvbnMgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbi8qKlxuICogY29udmVydCBhIHBvdGVudGlhbGx5IHJlbGF0aXZlIHBhdGggZnJvbSBub2RlIHV0aWxzIGludG8gYSB0cnVlXG4gKiByZWxhdGl2ZSBwYXRoLlxuICpcbiAqIC4uLyAtPiAuLlxuICogLi8gLT4gLlxuICogLmZvby9iYXIgLT4gLi8uZm9vL2JhclxuICogLi5mb28vYmFyIC0+IC4vLi5mb28vYmFyXG4gKiBmb28vYmFyIC0+IC4vZm9vL2JhclxuICpcbiAqIEBwYXJhbSByZWxhdGl2ZVBhdGgge3N0cmluZ30gcmVsYXRpdmUgcG9zaXggcGF0aCBwb3RlbnRpYWxseSBtaXNzaW5nIGxlYWRpbmcgJy4vJ1xuICogQHJldHVybnMge3N0cmluZ30gcmVsYXRpdmUgcG9zaXggcGF0aCB0aGF0IGFsd2F5cyBzdGFydHMgd2l0aCBhIC4vXG4gKiovXG5mdW5jdGlvbiB0b1JlbGF0aXZlUGF0aChyZWxhdGl2ZVBhdGgpIHtcbiAgY29uc3Qgc3RyaXBwZWQgPSByZWxhdGl2ZVBhdGgucmVwbGFjZSgvXFwvJC9nLCAnJyk7IC8vIFJlbW92ZSB0cmFpbGluZyAvXG5cbiAgcmV0dXJuIC9eKChcXC5cXC4pfChcXC4pKSgkfFxcLykvLnRlc3Qoc3RyaXBwZWQpID8gc3RyaXBwZWQgOiBgLi8ke3N0cmlwcGVkfWA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShmbikge1xuICByZXR1cm4gdG9SZWxhdGl2ZVBhdGgocGF0aC5wb3NpeC5ub3JtYWxpemUoZm4pKTtcbn1cblxuZnVuY3Rpb24gY291bnRSZWxhdGl2ZVBhcmVudHMocGF0aFNlZ21lbnRzKSB7XG4gIHJldHVybiBwYXRoU2VnbWVudHMucmVkdWNlKChzdW0sIHBhdGhTZWdtZW50KSA9PiBwYXRoU2VnbWVudCA9PT0gJy4uJyA/IHN1bSArIDEgOiBzdW0sIDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0YXRpYyBhbmFseXNpcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCB1bm5lY2Vzc2FyeSBwYXRoIHNlZ21lbnRzIGluIGltcG9ydCBhbmQgcmVxdWlyZSBzdGF0ZW1lbnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLXVzZWxlc3MtcGF0aC1zZWdtZW50cycpLFxuICAgIH0sXG5cbiAgICBmaXhhYmxlOiAnY29kZScsXG5cbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb21tb25qczogeyB0eXBlOiAnYm9vbGVhbicgfSxcbiAgICAgICAgICBub1VzZWxlc3NJbmRleDogeyB0eXBlOiAnYm9vbGVhbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgY3VycmVudERpciA9IHBhdGguZGlybmFtZShjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrU291cmNlVmFsdWUoc291cmNlKSB7XG4gICAgICBjb25zdCB7IHZhbHVlOiBpbXBvcnRQYXRoIH0gPSBzb3VyY2U7XG5cbiAgICAgIGZ1bmN0aW9uIHJlcG9ydFdpdGhQcm9wb3NlZFBhdGgocHJvcG9zZWRQYXRoKSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlOiBzb3VyY2UsXG4gICAgICAgICAgLy8gTm90ZTogVXNpbmcgbWVzc2FnZUlkcyBpcyBub3QgcG9zc2libGUgZHVlIHRvIHRoZSBzdXBwb3J0IGZvciBFU0xpbnQgMiBhbmQgM1xuICAgICAgICAgIG1lc3NhZ2U6IGBVc2VsZXNzIHBhdGggc2VnbWVudHMgZm9yIFwiJHtpbXBvcnRQYXRofVwiLCBzaG91bGQgYmUgXCIke3Byb3Bvc2VkUGF0aH1cImAsXG4gICAgICAgICAgZml4OiBmaXhlciA9PiBwcm9wb3NlZFBhdGggJiYgZml4ZXIucmVwbGFjZVRleHQoc291cmNlLCBKU09OLnN0cmluZ2lmeShwcm9wb3NlZFBhdGgpKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgcmVsYXRpdmUgaW1wb3J0cyBhcmUgcmVsZXZhbnQgZm9yIHRoaXMgcnVsZSAtLT4gU2tpcCBjaGVja2luZ1xuICAgICAgaWYgKCFpbXBvcnRQYXRoLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcG9ydCBydWxlIHZpb2xhdGlvbiBpZiBwYXRoIGlzIG5vdCB0aGUgc2hvcnRlc3QgcG9zc2libGVcbiAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IHJlc29sdmUoaW1wb3J0UGF0aCwgY29udGV4dCk7XG4gICAgICBjb25zdCBub3JtZWRQYXRoID0gbm9ybWFsaXplKGltcG9ydFBhdGgpO1xuICAgICAgY29uc3QgcmVzb2x2ZWROb3JtZWRQYXRoID0gcmVzb2x2ZShub3JtZWRQYXRoLCBjb250ZXh0KTtcbiAgICAgIGlmIChub3JtZWRQYXRoICE9PSBpbXBvcnRQYXRoICYmIHJlc29sdmVkUGF0aCA9PT0gcmVzb2x2ZWROb3JtZWRQYXRoKSB7XG4gICAgICAgIHJldHVybiByZXBvcnRXaXRoUHJvcG9zZWRQYXRoKG5vcm1lZFBhdGgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlRXh0ZW5zaW9ucyA9IGdldEZpbGVFeHRlbnNpb25zKGNvbnRleHQuc2V0dGluZ3MpO1xuICAgICAgY29uc3QgcmVnZXhVbm5lY2Vzc2FyeUluZGV4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgYC4qXFxcXC9pbmRleChcXFxcJHtBcnJheS5mcm9tKGZpbGVFeHRlbnNpb25zKS5qb2luKCd8XFxcXCcpfSk/JGAsXG4gICAgICApO1xuXG4gICAgICAvLyBDaGVjayBpZiBwYXRoIGNvbnRhaW5zIHVubmVjZXNzYXJ5IGluZGV4IChpbmNsdWRpbmcgYSBjb25maWd1cmVkIGV4dGVuc2lvbilcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm9Vc2VsZXNzSW5kZXggJiYgcmVnZXhVbm5lY2Vzc2FyeUluZGV4LnRlc3QoaW1wb3J0UGF0aCkpIHtcbiAgICAgICAgY29uc3QgcGFyZW50RGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGltcG9ydFBhdGgpO1xuXG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGFtYmlndW91cyBpbXBvcnRzXG4gICAgICAgIGlmIChwYXJlbnREaXJlY3RvcnkgIT09ICcuJyAmJiBwYXJlbnREaXJlY3RvcnkgIT09ICcuLicpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGZpbGVFeHRlbnNpb24gb2YgZmlsZUV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgIGlmIChyZXNvbHZlKGAke3BhcmVudERpcmVjdG9yeX0ke2ZpbGVFeHRlbnNpb259YCwgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydFdpdGhQcm9wb3NlZFBhdGgoYCR7cGFyZW50RGlyZWN0b3J5fS9gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVwb3J0V2l0aFByb3Bvc2VkUGF0aChwYXJlbnREaXJlY3RvcnkpO1xuICAgICAgfVxuXG4gICAgICAvLyBQYXRoIGlzIHNob3J0ZXN0IHBvc3NpYmxlICsgc3RhcnRzIGZyb20gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IC0tPiBSZXR1cm4gZGlyZWN0bHlcbiAgICAgIGlmIChpbXBvcnRQYXRoLnN0YXJ0c1dpdGgoJy4vJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQYXRoIGlzIG5vdCBleGlzdGluZyAtLT4gUmV0dXJuIGRpcmVjdGx5IChmb2xsb3dpbmcgY29kZSByZXF1aXJlcyBwYXRoIHRvIGJlIGRlZmluZWQpXG4gICAgICBpZiAocmVzb2x2ZWRQYXRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHBlY3RlZCA9IHBhdGgucmVsYXRpdmUoY3VycmVudERpciwgcmVzb2x2ZWRQYXRoKTsgLy8gRXhwZWN0ZWQgaW1wb3J0IHBhdGhcbiAgICAgIGNvbnN0IGV4cGVjdGVkU3BsaXQgPSBleHBlY3RlZC5zcGxpdChwYXRoLnNlcCk7IC8vIFNwbGl0IGJ5IC8gb3IgXFwgKGRlcGVuZGluZyBvbiBPUylcbiAgICAgIGNvbnN0IGltcG9ydFBhdGhTcGxpdCA9IGltcG9ydFBhdGgucmVwbGFjZSgvXlxcLlxcLy8sICcnKS5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgY291bnRJbXBvcnRQYXRoUmVsYXRpdmVQYXJlbnRzID0gY291bnRSZWxhdGl2ZVBhcmVudHMoaW1wb3J0UGF0aFNwbGl0KTtcbiAgICAgIGNvbnN0IGNvdW50RXhwZWN0ZWRSZWxhdGl2ZVBhcmVudHMgPSBjb3VudFJlbGF0aXZlUGFyZW50cyhleHBlY3RlZFNwbGl0KTtcbiAgICAgIGNvbnN0IGRpZmYgPSBjb3VudEltcG9ydFBhdGhSZWxhdGl2ZVBhcmVudHMgLSBjb3VudEV4cGVjdGVkUmVsYXRpdmVQYXJlbnRzO1xuXG4gICAgICAvLyBTYW1lIG51bWJlciBvZiByZWxhdGl2ZSBwYXJlbnRzIC0tPiBQYXRocyBhcmUgdGhlIHNhbWUgLS0+IFJldHVybiBkaXJlY3RseVxuICAgICAgaWYgKGRpZmYgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcG9ydCBhbmQgcHJvcG9zZSBtaW5pbWFsIG51bWJlciBvZiByZXF1aXJlZCByZWxhdGl2ZSBwYXJlbnRzXG4gICAgICByZXR1cm4gcmVwb3J0V2l0aFByb3Bvc2VkUGF0aChcbiAgICAgICAgdG9SZWxhdGl2ZVBhdGgoXG4gICAgICAgICAgaW1wb3J0UGF0aFNwbGl0XG4gICAgICAgICAgICAuc2xpY2UoMCwgY291bnRFeHBlY3RlZFJlbGF0aXZlUGFyZW50cylcbiAgICAgICAgICAgIC5jb25jYXQoaW1wb3J0UGF0aFNwbGl0LnNsaWNlKGNvdW50SW1wb3J0UGF0aFJlbGF0aXZlUGFyZW50cyArIGRpZmYpKVxuICAgICAgICAgICAgLmpvaW4oJy8nKSxcbiAgICAgICAgKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZHVsZVZpc2l0b3IoY2hlY2tTb3VyY2VWYWx1ZSwgb3B0aW9ucyk7XG4gIH0sXG59O1xuIl19