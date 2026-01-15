import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintPluginYml from 'eslint-plugin-yml';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pixPlugin from './index.js';

export default [
  js.configs.recommended,
  ...eslintPluginYml.configs['flat/standard'],
  comments.recommended,
  {
    plugins: {
      '@1024pix': pixPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': 'error',
      '@eslint-community/eslint-comments/no-unused-disable': ['error'],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'NewExpression[callee.name=Date][arguments.length=1][arguments.0.type=Literal]:not([arguments.0.value=/^[12][0-9]{3}-(0[0-9]|1[0-2])-([0-2][0-9]|3[01])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]Z)?$/])',
          message: "Use only ISO8601 UTC syntax ('2019-03-12T01:02:03Z') in Date constructor",
        },
        {
          selector:
            "CallExpression[callee.object.object.name='faker'][callee.object.property.name='internet'][callee.property.name='email']",
          message: 'Use only faker.internet.exampleEmail()',
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_',
        },
      ],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'yml/quotes': [
        'error',
        {
          prefer: 'single',
          avoidEscape: true,
        },
      ],
      '@1024pix/no-sinon-stub-with-args-oneliner': 'error',
    },
  },
];
