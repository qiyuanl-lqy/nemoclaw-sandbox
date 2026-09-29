'use strict';

const test = require('node:test');
const assert = require('node:assert');
const exportCommand = require('../bin/commands/export');

test('export requires a path after --output', () => {
  assert.strictEqual(exportCommand.run(['--output']), 2);
});
