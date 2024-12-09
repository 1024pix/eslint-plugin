'use strict';
const noSinonStubWithArgsOneliner = require('./rules/no-sinon-stub-with-args-oneliner.js');
const noColumnMigrationWithoutComment = require('./rules/no-column-migration-without-comment.js');

module.exports = {
  rules: { 'no-sinon-stub-with-args-oneliner': noSinonStubWithArgsOneliner, 'no-column-migration-without-comment': noColumnMigrationWithoutComment },
};
