'use strict';

function report(context, node) {
  context.report({
    node: node,
    messageId: 'chainError',
  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Do not chain `sinon.stub()` with the `withArgs()` method in a one-liner',
    },
    messages: {
      chainError:
        '`sinon.stub()` should not be chained with the `withArgs` method.',
    },
  },
  create: function (context) {
    return {
      'VariableDeclarator > CallExpression > MemberExpression[property.name="returns"] > CallExpression > MemberExpression[property.name="withArgs"] > CallExpression > MemberExpression[property.name="stub"][object.name="sinon"]':
        function (node) {
          report(context, node);
        },
      'VariableDeclarator > CallExpression > MemberExpression[property.name="throws"] > CallExpression > MemberExpression[property.name="withArgs"] > CallExpression > MemberExpression[property.name="stub"][object.name="sinon"]':
        function (node) {
          report(context, node);
        },
      'VariableDeclarator > CallExpression > MemberExpression[property.name="resolves"] > CallExpression > MemberExpression[property.name="withArgs"] > CallExpression > MemberExpression[property.name="stub"][object.name="sinon"]':
        function (node) {
          report(context, node);
        },
      'VariableDeclarator > CallExpression > MemberExpression[property.name="rejects"] > CallExpression > MemberExpression[property.name="withArgs"] > CallExpression > MemberExpression[property.name="stub"][object.name="sinon"]':
        function (node) {
          report(context, node);
        },
    };
  },
};
