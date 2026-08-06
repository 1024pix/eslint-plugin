import test from 'ava';
import { ESLint } from 'eslint';

import config from './config.js';

async function reportedRuleIds({ code, filePath }) {
    const eslint = new ESLint({ overrideConfig: config, overrideConfigFile: true });
    const [result] = await eslint.lintText(code, { filePath });

    return result.messages.map((message) => message.ruleId);
}

const cases = [
    {
        name: 'Unsorted imports and console call',
        code: "import b from 'b';\nimport a from 'a';\nconsole.log(a, b);\n",
        filePath: 'sample.js',
        errors: ['simple-import-sort/imports', 'no-console'],
    },
    {
        name: 'Sinon stub with args one liner',
        code: "import sinon from 'sinon';\nconst stub = sinon.stub().withArgs('hello').returns('world');\n",
        filePath: 'sample.js',
        errors: ['@1024pix/no-sinon-stub-with-args-oneliner'],
    },
    {
        name: 'Double quoted YAML value with extra spacing',
        code: 'key:   "value"\n',
        filePath: 'sample.yml',
        errors: ['yml/quotes', 'yml/key-spacing'],
    },
];

test('Config is loadable', (t) => {
    t.true(Array.isArray(config));
    t.true(config.length > 0);
});

for (const { name, code, filePath, errors } of cases) {
    test(name, async (t) => {
        const ruleIds = await reportedRuleIds({ code, filePath });

        for (const error of errors) {
            t.true(ruleIds.includes(error), `${error} should be reported`);
        }
    });
}
