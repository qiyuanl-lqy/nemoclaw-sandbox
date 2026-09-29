'use strict';

// nemoclaw export [--output FILE]: print the sandbox registry as JSON (revision 1).
const fs = require('node:fs');
const registry = require('../lib/registry');

module.exports = {
  name: 'export',
  scope: 'global',
  summary: 'Print sandboxes as JSON',
  run(args) {
    const sandboxes = registry.load().map(({ name, provider, model, default: isDefault }) => ({
      name,
      provider,
      model,
      default: Boolean(isDefault),
    }));
    const json = JSON.stringify(sandboxes, null, 2);
    const index = args.indexOf('--output');
    if (index === -1) {
      console.log(json);
      return 0;
    }
    const file = args[index + 1];
    if (!file) {
      console.error('--output requires a file path');
      return 2;
    }
    fs.writeFileSync(file, json + '\n', { mode: 0o600 });
    console.log(`Exported ${sandboxes.length} sandbox(es) to ${file}`);
    return 0;
  },
};
