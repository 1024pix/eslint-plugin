const ITERATION_METHODS = new Set(['map', 'forEach', 'flatMap', 'reduce', 'filter', 'some', 'every']);
const LOOKUP_METHODS = new Set(['filter', 'find', 'findIndex', 'findLast', 'findLastIndex', 'some', 'every']);
const LOOP_STATEMENTS = new Set([
  'ForStatement',
  'ForOfStatement',
  'ForInStatement',
  'WhileStatement',
  'DoWhileStatement',
]);

const isWithin = (inner, outer) => inner.range[0] >= outer.range[0] && inner.range[1] <= outer.range[1];

const calledMethodName = (node) =>
  node.type === 'CallExpression' &&
  node.callee.type === 'MemberExpression' &&
  !node.callee.computed &&
  node.callee.property.type === 'Identifier'
    ? node.callee.property.name
    : undefined;

const isIterationCallback = (node) =>
  (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') &&
  node.parent.type === 'CallExpression' &&
  node.parent.arguments.includes(node) &&
  ITERATION_METHODS.has(calledMethodName(node.parent));

const isLoop = (node) => LOOP_STATEMENTS.has(node.type) || isIterationCallback(node);

const enclosingLoops = (node) =>
  node.parent ? [...(isLoop(node.parent) ? [node.parent] : []), ...enclosingLoops(node.parent)] : [];

const returnedExpression = (callback) => {
  if (callback?.type !== 'ArrowFunctionExpression' && callback?.type !== 'FunctionExpression') return undefined;

  if (callback.body.type !== 'BlockStatement') return callback.body;

  const [onlyStatement] = callback.body.body;

  return callback.body.body.length === 1 && onlyStatement.type === 'ReturnStatement'
    ? onlyStatement.argument
    : undefined;
};

const isDeclaredIn = (variable, loops, lookup) =>
  variable?.defs.some(
    (definition) => loops.some((loop) => isWithin(definition.name, loop)) && !isWithin(definition.name, lookup),
  ) ?? false;

/**
 * Reports an equality lookup nested in a loop when it compares against a variable of that loop:
 * `ids.map((id) => rows.find((row) => row.id === id))`. Such a join costs O(n × m): build a `Map`,
 * a `Set` or a `Map.groupBy` once before the loop and read it inside.
 */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow equality lookups against a loop variable inside that loop',
    },
    messages: {
      linearLookupInLoop:
        'Linear lookup on a loop variable is O(n × m): index the collection with a Map, a Set or Map.groupBy before the loop.',
    },
    schema: [],
  },
  create: (context) => ({
    CallExpression: (node) => {
      if (!LOOKUP_METHODS.has(calledMethodName(node))) return;

      const equality = returnedExpression(node.arguments[0]);
      if (equality?.type !== 'BinaryExpression' || equality.operator !== '===') return;

      const loops = enclosingLoops(node);
      if (loops.length === 0) return;

      const comparesLoopVariable = context.sourceCode
        .getScope(equality)
        .references.filter((reference) => isWithin(reference.identifier, equality))
        .some((reference) => isDeclaredIn(reference.resolved, loops, node));

      if (comparesLoopVariable) context.report({ node, messageId: 'linearLookupInLoop' });
    },
  }),
};
