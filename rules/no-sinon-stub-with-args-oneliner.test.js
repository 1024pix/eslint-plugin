'use strict';

const rule = require('./no-sinon-stub-with-args-oneliner.js'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
});

ruleTester.run('no-sinon-stub-with-args-oneliner', rule, {
  valid: [
    {
      name: 'Only stub',
      code: 'sinon.stub()',
    },
    {
      name: 'Sinon import then two liners',
      code: "const stub = sinon.stub(); stub.withArgs('hello').returns('world')",
    },
    {
      name: 'Sinon import then object definition',
      code: "import sinon from 'sinon'; const stub = { hello: sinon.stub().withArgs('hello').returns('world') }",
    },
    {
      name: 'Stub import then two liners',
      code: "import { stub } from 'sinon'; const myStub = stub(); myStub.withArgs('hello').returns('world')",
    },

    // Not handled yet
    {
      name: 'Sinon import then onCall one liner',
      code: "import sinon from 'sinon'; const myStub = sinon.stub().withArgs('hello').onCall(0).returns('world')",
    },
    {
      name: 'Stub import then one liner',
      code: "import { stub } from 'sinon'; const myStub = stub().withArgs('hello').returns('world')",
    },
  ],

  invalid: [
    {
      name: 'One liner variable assignment with sinon import and returns',
      code: `import sinon from 'sinon'; const stub = sinon.stub().withArgs('hello').returns('world')`,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'One liner variable assignment with sinon import and throws',
      code: `import sinon from 'sinon'; const stub = sinon.stub().withArgs('hello').throws('world')`,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'One liner variable assignment with sinon import and resolves',
      code: `import sinon from 'sinon'; const stub = sinon.stub().withArgs('hello').resolves('world')`,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'One liner variable assignment with sinon import and rejects',
      code: `import sinon from 'sinon'; const stub = sinon.stub().withArgs('hello').rejects('world')`,
      errors: [{ messageId: 'chainError' }],
    },
  ],
});
