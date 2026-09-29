'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { main, usage } = require('../bin/nemoclaw');

test('usage lists the core commands', () => {
  for (const command of ['onboard', 'list', 'connect', 'status', 'destroy']) {
    assert.match(usage(), new RegExp(command));
  }
});

test('unknown option exits 2', () => {
  assert.strictEqual(main(['--no-such-flag']), 2);
});
