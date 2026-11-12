import noLinearLookupInLoop from './rules/no-linear-lookup-in-loop.js';
import noSinonStubWithArgsOneliner from './rules/no-sinon-stub-with-args-oneliner.js';

export default {
  rules: {
    'no-linear-lookup-in-loop': noLinearLookupInLoop,
    'no-sinon-stub-with-args-oneliner': noSinonStubWithArgsOneliner,
  },
};
