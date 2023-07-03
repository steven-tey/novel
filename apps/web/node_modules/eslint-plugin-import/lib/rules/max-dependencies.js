'use strict';var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var DEFAULT_MAX = 10;
var DEFAULT_IGNORE_TYPE_IMPORTS = false;
var TYPE_IMPORT = 'type';

var countDependencies = function countDependencies(dependencies, lastNode, context) {var _ref =
  context.options[0] || { max: DEFAULT_MAX },max = _ref.max;

  if (dependencies.size > max) {
    context.report(lastNode, 'Maximum number of dependencies (' + String(max) + ') exceeded.');
  }
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce the maximum number of dependencies a module can have.',
      url: (0, _docsUrl2['default'])('max-dependencies') },


    schema: [
    {
      'type': 'object',
      'properties': {
        'max': { 'type': 'number' },
        'ignoreTypeImports': { 'type': 'boolean' } },

      'additionalProperties': false }] },




  create: function () {function create(context) {var _ref2 =


      context.options[0] || {},_ref2$ignoreTypeImpor = _ref2.ignoreTypeImports,ignoreTypeImports = _ref2$ignoreTypeImpor === undefined ? DEFAULT_IGNORE_TYPE_IMPORTS : _ref2$ignoreTypeImpor;

      var dependencies = new Set(); // keep track of dependencies
      var lastNode = void 0; // keep track of the last node to report on

      return Object.assign({
        'Program:exit': function () {function ProgramExit() {
            countDependencies(dependencies, lastNode, context);
          }return ProgramExit;}() },
      (0, _moduleVisitor2['default'])(function (source, _ref3) {var importKind = _ref3.importKind;
        if (importKind !== TYPE_IMPORT || !ignoreTypeImports) {
          dependencies.add(source.value);
        }
        lastNode = source;
      }, { commonjs: true }));
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9tYXgtZGVwZW5kZW5jaWVzLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfTUFYIiwiREVGQVVMVF9JR05PUkVfVFlQRV9JTVBPUlRTIiwiVFlQRV9JTVBPUlQiLCJjb3VudERlcGVuZGVuY2llcyIsImRlcGVuZGVuY2llcyIsImxhc3ROb2RlIiwiY29udGV4dCIsIm9wdGlvbnMiLCJtYXgiLCJzaXplIiwicmVwb3J0IiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJpZ25vcmVUeXBlSW1wb3J0cyIsIlNldCIsIk9iamVjdCIsImFzc2lnbiIsInNvdXJjZSIsImltcG9ydEtpbmQiLCJhZGQiLCJ2YWx1ZSIsImNvbW1vbmpzIl0sIm1hcHBpbmdzIjoiYUFBQSxrRTtBQUNBLHFDOztBQUVBLElBQU1BLGNBQWMsRUFBcEI7QUFDQSxJQUFNQyw4QkFBOEIsS0FBcEM7QUFDQSxJQUFNQyxjQUFjLE1BQXBCOztBQUVBLElBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNDLFlBQUQsRUFBZUMsUUFBZixFQUF5QkMsT0FBekIsRUFBcUM7QUFDN0NBLFVBQVFDLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFBRUMsS0FBS1IsV0FBUCxFQUR1QixDQUNyRFEsR0FEcUQsUUFDckRBLEdBRHFEOztBQUc3RCxNQUFJSixhQUFhSyxJQUFiLEdBQW9CRCxHQUF4QixFQUE2QjtBQUMzQkYsWUFBUUksTUFBUixDQUFlTCxRQUFmLDhDQUE0REcsR0FBNUQ7QUFDRDtBQUNGLENBTkQ7O0FBUUFHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxhQUROO0FBRUpDLG1CQUFhLCtEQUZUO0FBR0pDLFdBQUssMEJBQVEsa0JBQVIsQ0FIRCxFQUZGOzs7QUFRSkMsWUFBUTtBQUNOO0FBQ0UsY0FBUSxRQURWO0FBRUUsb0JBQWM7QUFDWixlQUFPLEVBQUUsUUFBUSxRQUFWLEVBREs7QUFFWiw2QkFBcUIsRUFBRSxRQUFRLFNBQVYsRUFGVCxFQUZoQjs7QUFNRSw4QkFBd0IsS0FOMUIsRUFETSxDQVJKLEVBRFM7Ozs7O0FBcUJmQyx1QkFBUSx5QkFBVzs7O0FBR2JkLGNBQVFDLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFIVCwrQkFFZmMsaUJBRmUsQ0FFZkEsaUJBRmUseUNBRUtwQiwyQkFGTDs7QUFLakIsVUFBTUcsZUFBZSxJQUFJa0IsR0FBSixFQUFyQixDQUxpQixDQUtlO0FBQ2hDLFVBQUlqQixpQkFBSixDQU5pQixDQU1IOztBQUVkLGFBQU9rQixPQUFPQyxNQUFQLENBQWM7QUFDbkIscUNBQWdCLHVCQUFZO0FBQzFCckIsOEJBQWtCQyxZQUFsQixFQUFnQ0MsUUFBaEMsRUFBMENDLE9BQTFDO0FBQ0QsV0FGRCxzQkFEbUIsRUFBZDtBQUlKLHNDQUFjLFVBQUNtQixNQUFELFNBQTRCLEtBQWpCQyxVQUFpQixTQUFqQkEsVUFBaUI7QUFDM0MsWUFBSUEsZUFBZXhCLFdBQWYsSUFBOEIsQ0FBQ21CLGlCQUFuQyxFQUFzRDtBQUNwRGpCLHVCQUFhdUIsR0FBYixDQUFpQkYsT0FBT0csS0FBeEI7QUFDRDtBQUNEdkIsbUJBQVdvQixNQUFYO0FBQ0QsT0FMRSxFQUtBLEVBQUVJLFVBQVUsSUFBWixFQUxBLENBSkksQ0FBUDtBQVVELEtBbEJELGlCQXJCZSxFQUFqQiIsImZpbGUiOiJtYXgtZGVwZW5kZW5jaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vZHVsZVZpc2l0b3IgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9tb2R1bGVWaXNpdG9yJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5jb25zdCBERUZBVUxUX01BWCA9IDEwO1xuY29uc3QgREVGQVVMVF9JR05PUkVfVFlQRV9JTVBPUlRTID0gZmFsc2U7XG5jb25zdCBUWVBFX0lNUE9SVCA9ICd0eXBlJztcblxuY29uc3QgY291bnREZXBlbmRlbmNpZXMgPSAoZGVwZW5kZW5jaWVzLCBsYXN0Tm9kZSwgY29udGV4dCkgPT4ge1xuICBjb25zdCB7IG1heCB9ID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHsgbWF4OiBERUZBVUxUX01BWCB9O1xuXG4gIGlmIChkZXBlbmRlbmNpZXMuc2l6ZSA+IG1heCkge1xuICAgIGNvbnRleHQucmVwb3J0KGxhc3ROb2RlLCBgTWF4aW11bSBudW1iZXIgb2YgZGVwZW5kZW5jaWVzICgke21heH0pIGV4Y2VlZGVkLmApO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0eWxlIGd1aWRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5mb3JjZSB0aGUgbWF4aW11bSBudW1iZXIgb2YgZGVwZW5kZW5jaWVzIGEgbW9kdWxlIGNhbiBoYXZlLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ21heC1kZXBlbmRlbmNpZXMnKSxcbiAgICB9LFxuXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgICd0eXBlJzogJ29iamVjdCcsXG4gICAgICAgICdwcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdtYXgnOiB7ICd0eXBlJzogJ251bWJlcicgfSxcbiAgICAgICAgICAnaWdub3JlVHlwZUltcG9ydHMnOiB7ICd0eXBlJzogJ2Jvb2xlYW4nIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcyc6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogY29udGV4dCA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgaWdub3JlVHlwZUltcG9ydHMgPSBERUZBVUxUX0lHTk9SRV9UWVBFX0lNUE9SVFMsXG4gICAgfSA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTsgLy8ga2VlcCB0cmFjayBvZiBkZXBlbmRlbmNpZXNcbiAgICBsZXQgbGFzdE5vZGU7IC8vIGtlZXAgdHJhY2sgb2YgdGhlIGxhc3Qgbm9kZSB0byByZXBvcnQgb25cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvdW50RGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llcywgbGFzdE5vZGUsIGNvbnRleHQpO1xuICAgICAgfSxcbiAgICB9LCBtb2R1bGVWaXNpdG9yKChzb3VyY2UsIHsgaW1wb3J0S2luZCB9KSA9PiB7XG4gICAgICBpZiAoaW1wb3J0S2luZCAhPT0gVFlQRV9JTVBPUlQgfHwgIWlnbm9yZVR5cGVJbXBvcnRzKSB7XG4gICAgICAgIGRlcGVuZGVuY2llcy5hZGQoc291cmNlLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGxhc3ROb2RlID0gc291cmNlO1xuICAgIH0sIHsgY29tbW9uanM6IHRydWUgfSkpO1xuICB9LFxufTtcbiJdfQ==