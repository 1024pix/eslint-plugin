'use strict';

const rule = require('./no-column-migration-without-comment.js'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
});

ruleTester.run('no-column-migration-without-comment', rule, {
  valid: [
    // createTable
    {
      name: 'With comment',
      code: `
      const up = function (knex) {
          return knex.schema.createTable(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).comment('This is a comment');
          });
        };
      `,
    },

    {
      name: 'Without using table callback',
      code: `
      const up = function (knex) {
          return knex.schema.createTable(TABLE_NAME, (table) => {
            toto.maFunction();
          });
        };
      `,
    },

    // alterTable
    {
      name: 'With comment',
      code: `
      const up = function (knex) {
          return knex.schema.alterTable(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).comment('This is a comment');
          });
        };
      `,
    },

    {
      name: 'Without using table callback',
      code: `
      const up = function (knex) {
          return knex.schema.alterTable(TABLE_NAME, (table) => {
            toto.maFunction();
          });
        };
      `,
    },

    // table

    {
      name: 'With comment',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).comment('This is a comment');
          });
        };
      `,
    },

    {
      name: 'Without using table callback',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            toto.maFunction();
          });
        };
      `,
    },


    {
      name: 'With down function',
      code: `
      const down = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.boolean('toto').comment('This is a comment');
          });
        };
      `,
    },


    {
      name: 'With dropColumn',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.dropColumn('toto');
          });
        };
      `,
    },

    {
      name: 'With foreign',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.foreign('toto');
          });
        };
      `,
    },

    {
      name: 'With unique',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.unique('toto');
          });
        };
      `,
    },

    {
      name: 'With index',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.index('toto');
          });
        };
      `,
    },

    {
      name: 'With dropUnique',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.dropUnique('toto');
          });
        };
      `,
    },

    {
      name: 'With dropIndex',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.dropIndex('toto');
          });
        };
      `,
    },

    {
      name: 'With oneliner',
      code: `
      const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => table.boolean('toto').comment('comment'));
        };
      `,
    },

    {
      name: 'With await',
      code: `
      const up = async function (knex) {
        return knex.schema.alterTable(TABLE_NAME, async (table) => {
           await table.decimal(COLUMN, 5, 2).notNullable().alter().comment('toto');
        });
      };
      `,
    },
  ],

  invalid: [

    // CreateTable

    {
      name: 'Create column without comment - function',
      code: `
        const up = function (knex) {
          return knex.schema.createTable(TABLE_NAME, function (table) {
            table.boolean(COLUMN_NAME).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'Create column without comment - arrow function',
      code: `
        const up = function (knex) {
          return knex.schema.createTable(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'Create column without comment',
      code: `
        const up = function (knex) {
          return knex.schema.createTable(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).defaultTo(false).comment('toto');
            table.boolean(COLUMN_NAME_2).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },

    // AlterTable

    {
      name: 'Create column without comment',
      code: `
        const up = function (knex) {
          return knex.schema.alterTable(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'Create column without comment',
      code: `
        const up = function (knex) {
          return knex.schema.alterTable(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).defaultTo(false).comment('toto');
            table.boolean(COLUMN_NAME_2).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },

    // table
    {
      name: 'Create column without comment',
      code: `
        const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },
    {
      name: 'Create column without comment',
      code: `
        const up = function (knex) {
          return knex.schema.table(TABLE_NAME, (table) => {
            table.boolean(COLUMN_NAME).defaultTo(false).comment('toto');
            table.boolean(COLUMN_NAME_2).defaultTo(false);
          });
        };
      `,
      errors: [{ messageId: 'chainError' }],
    },
  ],
});
