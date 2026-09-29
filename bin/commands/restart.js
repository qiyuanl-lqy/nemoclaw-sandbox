'use strict';

// nemoclaw <name> restart: stop, start and wait for Ready (revision 1).
const runner = require('../lib/runner');

const READY_TIMEOUT_MS = 60_000;

module.exports = {
  name: 'restart',
  scope: 'sandbox',
  summary: 'Stop and start the sandbox',
  run(name) {
    runner.openshell(['sandbox', 'stop', name]);
    runner.openshell(['sandbox', 'start', name]);
    const deadline = Date.now() + READY_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (runner.sandboxState(name) === 'Ready') {
        console.log(`Sandbox '${name}' restarted`);
        return 0;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
    }
    console.error(`Sandbox '${name}' did not become Ready within ${READY_TIMEOUT_MS / 1000}s`);
    return 1;
  },
};
