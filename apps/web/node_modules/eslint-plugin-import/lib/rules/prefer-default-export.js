'use strict';

var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var SINGLE_EXPORT_ERROR_MESSAGE = 'Prefer default export on a file with single export.';
var ANY_EXPORT_ERROR_MESSAGE = 'Prefer default export to be present on every file that has export.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Prefer a default export if module exports a single name or multiple names.',
      url: (0, _docsUrl2['default'])('prefer-default-export') },

    schema: [{
      type: 'object',
      properties: {
        target: {
          type: 'string',
          'enum': ['single', 'any'],
          'default': 'single' } },


      additionalProperties: false }] },



  create: function () {function create(context) {
      var specifierExportCount = 0;
      var hasDefaultExport = false;
      var hasStarExport = false;
      var hasTypeExport = false;
      var namedExportNode = null;
      // get options. by default we look into files with single export
      var _ref = context.options[0] || {},_ref$target = _ref.target,target = _ref$target === undefined ? 'single' : _ref$target;
      function captureDeclaration(identifierOrPattern) {
        if (identifierOrPattern && identifierOrPattern.type === 'ObjectPattern') {
          // recursively capture
          identifierOrPattern.properties.
          forEach(function (property) {
            captureDeclaration(property.value);
          });
        } else if (identifierOrPattern && identifierOrPattern.type === 'ArrayPattern') {
          identifierOrPattern.elements.
          forEach(captureDeclaration);
        } else {
          // assume it's a single standard identifier
          specifierExportCount++;
        }
      }

      return {
        'ExportDefaultSpecifier': function () {function ExportDefaultSpecifier() {
            hasDefaultExport = true;
          }return ExportDefaultSpecifier;}(),

        'ExportSpecifier': function () {function ExportSpecifier(node) {
            if ((node.exported.name || node.exported.value) === 'default') {
              hasDefaultExport = true;
            } else {
              specifierExportCount++;
              namedExportNode = node;
            }
          }return ExportSpecifier;}(),

        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            // if there are specifiers, node.declaration should be null
            if (!node.declaration) return;var

            type = node.declaration.type;

            if (
            type === 'TSTypeAliasDeclaration' ||
            type === 'TypeAlias' ||
            type === 'TSInterfaceDeclaration' ||
            type === 'InterfaceDeclaration')
            {
              specifierExportCount++;
              hasTypeExport = true;
              return;
            }

            if (node.declaration.declarations) {
              node.declaration.declarations.forEach(function (declaration) {
                captureDeclaration(declaration.id);
              });
            } else {
              // captures 'export function foo() {}' syntax
              specifierExportCount++;
            }

            namedExportNode = node;
          }return ExportNamedDeclaration;}(),

        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration() {
            hasDefaultExport = true;
          }return ExportDefaultDeclaration;}(),

        'ExportAllDeclaration': function () {function ExportAllDeclaration() {
            hasStarExport = true;
          }return ExportAllDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {
            if (hasDefaultExport || hasStarExport || hasTypeExport) {
              return;
            }
            if (target === 'single' && specifierExportCount === 1) {
              context.report(namedExportNode, SINGLE_EXPORT_ERROR_MESSAGE);
            } else if (target === 'any' && specifierExportCount > 0) {
              context.report(namedExportNode, ANY_EXPORT_ERROR_MESSAGE);
            }
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9wcmVmZXItZGVmYXVsdC1leHBvcnQuanMiXSwibmFtZXMiOlsiU0lOR0xFX0VYUE9SVF9FUlJPUl9NRVNTQUdFIiwiQU5ZX0VYUE9SVF9FUlJPUl9NRVNTQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwidGFyZ2V0IiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb250ZXh0Iiwic3BlY2lmaWVyRXhwb3J0Q291bnQiLCJoYXNEZWZhdWx0RXhwb3J0IiwiaGFzU3RhckV4cG9ydCIsImhhc1R5cGVFeHBvcnQiLCJuYW1lZEV4cG9ydE5vZGUiLCJvcHRpb25zIiwiY2FwdHVyZURlY2xhcmF0aW9uIiwiaWRlbnRpZmllck9yUGF0dGVybiIsImZvckVhY2giLCJwcm9wZXJ0eSIsInZhbHVlIiwiZWxlbWVudHMiLCJub2RlIiwiZXhwb3J0ZWQiLCJuYW1lIiwiZGVjbGFyYXRpb24iLCJkZWNsYXJhdGlvbnMiLCJpZCIsInJlcG9ydCJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEscUM7O0FBRUEsSUFBTUEsOEJBQThCLHFEQUFwQztBQUNBLElBQU1DLDJCQUEyQixvRUFBakM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxhQUROO0FBRUpDLG1CQUFhLDRFQUZUO0FBR0pDLFdBQUssMEJBQVEsdUJBQVIsQ0FIRCxFQUZGOztBQU9KQyxZQUFRLENBQUM7QUFDUEwsWUFBTSxRQURDO0FBRVBNLGtCQUFXO0FBQ1RDLGdCQUFRO0FBQ05QLGdCQUFNLFFBREE7QUFFTixrQkFBTSxDQUFDLFFBQUQsRUFBVyxLQUFYLENBRkE7QUFHTixxQkFBUyxRQUhILEVBREMsRUFGSjs7O0FBU1BRLDRCQUFzQixLQVRmLEVBQUQs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OlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuY29uc3QgU0lOR0xFX0VYUE9SVF9FUlJPUl9NRVNTQUdFID0gJ1ByZWZlciBkZWZhdWx0IGV4cG9ydCBvbiBhIGZpbGUgd2l0aCBzaW5nbGUgZXhwb3J0Lic7XG5jb25zdCBBTllfRVhQT1JUX0VSUk9SX01FU1NBR0UgPSAnUHJlZmVyIGRlZmF1bHQgZXhwb3J0IHRvIGJlIHByZXNlbnQgb24gZXZlcnkgZmlsZSB0aGF0IGhhcyBleHBvcnQuJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZWZlciBhIGRlZmF1bHQgZXhwb3J0IGlmIG1vZHVsZSBleHBvcnRzIGEgc2luZ2xlIG5hbWUgb3IgbXVsdGlwbGUgbmFtZXMuJyxcbiAgICAgIHVybDogZG9jc1VybCgncHJlZmVyLWRlZmF1bHQtZXhwb3J0JyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFt7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6e1xuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ3NpbmdsZScsICdhbnknXSxcbiAgICAgICAgICBkZWZhdWx0OiAnc2luZ2xlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgfV0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBsZXQgc3BlY2lmaWVyRXhwb3J0Q291bnQgPSAwO1xuICAgIGxldCBoYXNEZWZhdWx0RXhwb3J0ID0gZmFsc2U7XG4gICAgbGV0IGhhc1N0YXJFeHBvcnQgPSBmYWxzZTtcbiAgICBsZXQgaGFzVHlwZUV4cG9ydCA9IGZhbHNlO1xuICAgIGxldCBuYW1lZEV4cG9ydE5vZGUgPSBudWxsO1xuICAgIC8vIGdldCBvcHRpb25zLiBieSBkZWZhdWx0IHdlIGxvb2sgaW50byBmaWxlcyB3aXRoIHNpbmdsZSBleHBvcnRcbiAgICBjb25zdCB7IHRhcmdldCA9ICdzaW5nbGUnIH0gPSAgY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGZ1bmN0aW9uIGNhcHR1cmVEZWNsYXJhdGlvbihpZGVudGlmaWVyT3JQYXR0ZXJuKSB7XG4gICAgICBpZiAoaWRlbnRpZmllck9yUGF0dGVybiAmJiBpZGVudGlmaWVyT3JQYXR0ZXJuLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJykge1xuICAgICAgICAvLyByZWN1cnNpdmVseSBjYXB0dXJlXG4gICAgICAgIGlkZW50aWZpZXJPclBhdHRlcm4ucHJvcGVydGllc1xuICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgY2FwdHVyZURlY2xhcmF0aW9uKHByb3BlcnR5LnZhbHVlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaWRlbnRpZmllck9yUGF0dGVybiAmJiBpZGVudGlmaWVyT3JQYXR0ZXJuLnR5cGUgPT09ICdBcnJheVBhdHRlcm4nKSB7XG4gICAgICAgIGlkZW50aWZpZXJPclBhdHRlcm4uZWxlbWVudHNcbiAgICAgICAgICAuZm9yRWFjaChjYXB0dXJlRGVjbGFyYXRpb24pO1xuICAgICAgfSBlbHNlICB7XG4gICAgICAvLyBhc3N1bWUgaXQncyBhIHNpbmdsZSBzdGFuZGFyZCBpZGVudGlmaWVyXG4gICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICdFeHBvcnREZWZhdWx0U3BlY2lmaWVyJzogZnVuY3Rpb24gKCkge1xuICAgICAgICBoYXNEZWZhdWx0RXhwb3J0ID0gdHJ1ZTtcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnRTcGVjaWZpZXInOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAoKG5vZGUuZXhwb3J0ZWQubmFtZSB8fCBub2RlLmV4cG9ydGVkLnZhbHVlKSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgaGFzRGVmYXVsdEV4cG9ydCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BlY2lmaWVyRXhwb3J0Q291bnQrKztcbiAgICAgICAgICBuYW1lZEV4cG9ydE5vZGUgPSBub2RlO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBzcGVjaWZpZXJzLCBub2RlLmRlY2xhcmF0aW9uIHNob3VsZCBiZSBudWxsXG4gICAgICAgIGlmICghbm9kZS5kZWNsYXJhdGlvbikgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gbm9kZS5kZWNsYXJhdGlvbjtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZSA9PT0gJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nIHx8XG4gICAgICAgICAgdHlwZSA9PT0gJ1R5cGVBbGlhcycgfHxcbiAgICAgICAgICB0eXBlID09PSAnVFNJbnRlcmZhY2VEZWNsYXJhdGlvbicgfHxcbiAgICAgICAgICB0eXBlID09PSAnSW50ZXJmYWNlRGVjbGFyYXRpb24nXG4gICAgICAgICkge1xuICAgICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50Kys7XG4gICAgICAgICAgaGFzVHlwZUV4cG9ydCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIGNhcHR1cmVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5pZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2FwdHVyZXMgJ2V4cG9ydCBmdW5jdGlvbiBmb28oKSB7fScgc3ludGF4XG4gICAgICAgICAgc3BlY2lmaWVyRXhwb3J0Q291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVkRXhwb3J0Tm9kZSA9IG5vZGU7XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJzogZnVuY3Rpb24gKCkge1xuICAgICAgICBoYXNEZWZhdWx0RXhwb3J0ID0gdHJ1ZTtcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnRBbGxEZWNsYXJhdGlvbic6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFzU3RhckV4cG9ydCA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaGFzRGVmYXVsdEV4cG9ydCB8fCBoYXNTdGFyRXhwb3J0IHx8IGhhc1R5cGVFeHBvcnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldCA9PT0gJ3NpbmdsZScgJiYgc3BlY2lmaWVyRXhwb3J0Q291bnQgPT09IDEpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChuYW1lZEV4cG9ydE5vZGUsIFNJTkdMRV9FWFBPUlRfRVJST1JfTUVTU0FHRSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09PSAnYW55JyAmJiBzcGVjaWZpZXJFeHBvcnRDb3VudCA+IDApIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChuYW1lZEV4cG9ydE5vZGUsIEFOWV9FWFBPUlRfRVJST1JfTUVTU0FHRSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=