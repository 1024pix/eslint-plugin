'use strict';

function report(context, node) {
  context.report({
    node: node,
    messageId: 'chainError',
  });
}


function getIdentifierName(node, stackName = []) {
  switch (node.type) {
    case 'Identifier':
      return { identifier: node.name, callStack: stackName };
    case 'MemberExpression':
      return getIdentifierName(node.object, [...stackName, node.property.name])
    case 'CallExpression':
      return getIdentifierName(node.callee, stackName);
    case 'AwaitExpression':
      return getIdentifierName(node.argument, stackName);
  }
}

const VALID_MEMBER_EXPRESSIONS = ['dropColumn', 'foreign', 'unique', 'index', 'dropUnique', 'dropIndex'];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'All columns should have a comment explaining their purpose',
    },
    messages: {
      chainError:
        '`table.column()` should have a comment explaining its purpose',
    },
  },
  create: function(context) {
    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          callee.type === 'MemberExpression' &&
          callee.object &&
          callee.object.object &&
          callee.object.object.name === 'knex' &&
          callee.object.property &&
          callee.object.property.name === 'schema' &&
          ['alterTable', 'createTable', 'table'].includes(callee.property.name)
        ) {
          const callback = node.arguments[1];

          if (callback && (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression')) {
            const tableParam = callback.params[0];

            if (tableParam && tableParam.type === 'Identifier') {

              const body = callback.body.body ?? [{ expression: callback.body }];

              body.forEach(statement => {
                const columnExpression = statement.expression;

                const { identifier: identifierName, callStack } = getIdentifierName(columnExpression);

                if (!callStack.some((call) => VALID_MEMBER_EXPRESSIONS.includes(call))) {
                  if (identifierName === tableParam.name) {
                    const hasComment = callStack.includes('comment');

                    if (!hasComment) {
                      report(context, node);
                    }
                  }
                }

              });
            }
          }
        }
      }
    };
  }
};