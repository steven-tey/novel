/**
 * @fileoverview Forbid certain propTypes
 */

'use strict';

const variableUtil = require('../util/variable');
const propsUtil = require('../util/props');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const propWrapperUtil = require('../util/propWrapper');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DEFAULTS = ['any', 'array', 'object'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  forbiddenPropType: 'Prop type "{{target}}" is forbidden',
};

module.exports = {
  meta: {
    docs: {
      description: 'Disallow certain propTypes',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('forbid-prop-types'),
    },

    messages,

    schema: [{
      type: 'object',
      properties: {
        forbid: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        checkContextTypes: {
          type: 'boolean',
        },
        checkChildContextTypes: {
          type: 'boolean',
        },
      },
      additionalProperties: true,
    }],
  },

  create(context) {
    const configuration = context.options[0] || {};
    const checkContextTypes = configuration.checkContextTypes || false;
    const checkChildContextTypes = configuration.checkChildContextTypes || false;
    let propTypesPackageName = null;
    let reactPackageName = null;
    let isForeignPropTypesPackage = false;

    function isPropTypesPackage(node) {
      return (
        node.type === 'Identifier'
        && (
          node.name === null
          || node.name === propTypesPackageName
          || !isForeignPropTypesPackage
        )
      ) || (
        node.type === 'MemberExpression'
        && (
          node.object.name === null
          || node.object.name === reactPackageName
          || !isForeignPropTypesPackage
        )
      );
    }

    function isForbidden(type) {
      const forbid = configuration.forbid || DEFAULTS;
      return forbid.indexOf(type) >= 0;
    }

    function reportIfForbidden(type, declaration, target) {
      if (isForbidden(type)) {
        report(context, messages.forbiddenPropType, 'forbiddenPropType', {
          node: declaration,
          data: {
            target,
          },
        });
      }
    }

    function shouldCheckContextTypes(node) {
      if (checkContextTypes && propsUtil.isContextTypesDeclaration(node)) {
        return true;
      }
      return false;
    }

    function shouldCheckChildContextTypes(node) {
      if (checkChildContextTypes && propsUtil.isChildContextTypesDeclaration(node)) {
        return true;
      }
      return false;
    }

    /**
     * Checks if propTypes declarations are forbidden
     * @param {Array} declarations The array of AST nodes being checked.
     * @returns {void}
     */
    function checkProperties(declarations) {
      if (declarations) {
        declarations.forEach((declaration) => {
          if (declaration.type !== 'Property') {
            return;
          }
          let target;
          let value = declaration.value;
          if (
            value.type === 'MemberExpression'
            && value.property
            && value.property.name
            && value.property.name === 'isRequired'
          ) {
            value = value.object;
          }
          if (value.type === 'CallExpression') {
            if (!isPropTypesPackage(value.callee)) {
              return;
            }
            value.arguments.forEach((arg) => {
              const name = arg.type === 'MemberExpression' ? arg.property.name : arg.name;
              reportIfForbidden(name, declaration, name);
            });
            value = value.callee;
          }
          if (!isPropTypesPackage(value)) {
            return;
          }
          if (value.property) {
            target = value.property.name;
          } else if (value.type === 'Identifier') {
            target = value.name;
          }
          reportIfForbidden(target, declaration, target);
        });
      }
    }

    function checkNode(node) {
      switch (node && node.type) {
        case 'ObjectExpression':
          checkProperties(node.properties);
          break;
        case 'Identifier': {
          const propTypesObject = variableUtil.findVariableByName(context, node.name);
          if (propTypesObject && propTypesObject.properties) {
            checkProperties(propTypesObject.properties);
          }
          break;
        }
        case 'CallExpression': {
          const innerNode = node.arguments && node.arguments[0];
          if (
            propWrapperUtil.isPropWrapperFunction(context, context.getSourceCode().getText(node.callee))
            && innerNode
          ) {
            checkNode(innerNode);
          }
          break;
        }
        default:
          break;
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value === 'prop-types') { // import PropType from "prop-types"
          if (node.specifiers.length > 0) {
            propTypesPackageName = node.specifiers[0].local.name;
          }
        } else if (node.source && node.source.value === 'react') { // import { PropTypes } from "react"
          if (node.specifiers.length > 0) {
            reactPackageName = node.specifiers[0].local.name; // guard against accidental anonymous `import "react"`
          }
          if (node.specifiers.length >= 1) {
            const propTypesSpecifier = node.specifiers.find((specifier) => (
              specifier.imported && specifier.imported.name === 'PropTypes'
            ));
            if (propTypesSpecifier) {
              propTypesPackageName = propTypesSpecifier.local.name;
            }
          }
        } else { // package is not imported from "react" or "prop-types"
          // eslint-disable-next-line no-lonely-if
          if (node.specifiers.some((x) => x.local.name === 'PropTypes')) { // assert: node.specifiers.length > 1
            isForeignPropTypesPackage = true;
          }
        }
      },

      'ClassProperty, PropertyDefinition'(node) {
        if (
          !propsUtil.isPropTypesDeclaration(node)
          && !isPropTypesPackage(node)
          && !shouldCheckContextTypes(node)
          && !shouldCheckChildContextTypes(node)
        ) {
          return;
        }
        checkNode(node.value);
      },

      MemberExpression(node) {
        if (
          !propsUtil.isPropTypesDeclaration(node)
          && !isPropTypesPackage(node)
          && !shouldCheckContextTypes(node)
          && !shouldCheckChildContextTypes(node)
        ) {
          return;
        }

        checkNode(node.parent.right);
      },

      CallExpression(node) {
        if (
          node.callee.object
          && !isPropTypesPackage(node.callee.object)
          && !propsUtil.isPropTypesDeclaration(node.callee)
        ) {
          return;
        }

        if (
          node.arguments.length > 0
          && (node.callee.name === 'shape' || astUtil.getPropertyName(node.callee) === 'shape')
        ) {
          checkProperties(node.arguments[0].properties);
        }
      },

      MethodDefinition(node) {
        if (
          !propsUtil.isPropTypesDeclaration(node)
          && !isPropTypesPackage(node)
          && !shouldCheckContextTypes(node)
          && !shouldCheckChildContextTypes(node)
        ) {
          return;
        }

        const returnStatement = astUtil.findReturnStatement(node);

        if (returnStatement && returnStatement.argument) {
          checkNode(returnStatement.argument);
        }
      },

      ObjectExpression(node) {
        node.properties.forEach((property) => {
          if (!property.key) {
            return;
          }

          if (
            !propsUtil.isPropTypesDeclaration(property)
            && !isPropTypesPackage(property)
            && !shouldCheckContextTypes(property)
            && !shouldCheckChildContextTypes(property)
          ) {
            return;
          }
          if (property.value.type === 'ObjectExpression') {
            checkProperties(property.value.properties);
          }
        });
      },

    };
  },
};
