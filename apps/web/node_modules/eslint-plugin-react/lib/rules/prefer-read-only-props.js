/**
 * @fileoverview Require component props to be typed as read-only.
 * @author Luke Zapart
 */

'use strict';

const flatMap = require('array.prototype.flatmap');
const values = require('object.values');

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

function isFlowPropertyType(node) {
  return node.type === 'ObjectTypeProperty';
}

function isCovariant(node) {
  return (node.variance && node.variance.kind === 'plus')
    || (
      node.parent
      && node.parent.parent
      && node.parent.parent.parent
      && node.parent.parent.parent.id
      && node.parent.parent.parent.id.name === '$ReadOnly'
    );
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  readOnlyProp: 'Prop \'{{name}}\' should be read-only.',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce that props are read-only',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('prefer-read-only-props'),
    },
    fixable: 'code',

    messages,

    schema: [],
  },

  create: Components.detect((context, components) => ({
    'Program:exit'() {
      flatMap(
        values(components.list()),
        (component) => component.declaredPropTypes || []
      ).forEach((declaredPropTypes) => {
        Object.keys(declaredPropTypes).forEach((propName) => {
          const prop = declaredPropTypes[propName];

          if (!prop.node || !isFlowPropertyType(prop.node)) {
            return;
          }

          if (!isCovariant(prop.node)) {
            report(context, messages.readOnlyProp, 'readOnlyProp', {
              node: prop.node,
              data: {
                name: propName,
              },
              fix: (fixer) => {
                if (!prop.node.variance) {
                  // Insert covariance
                  return fixer.insertTextBefore(prop.node, '+');
                }

                // Replace contravariance with covariance
                return fixer.replaceText(prop.node.variance, '+');
              },
            });
          }
        });
      });
    },
  })),
};
