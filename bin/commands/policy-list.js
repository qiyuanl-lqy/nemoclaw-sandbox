'use strict';

// nemoclaw <name> policy-list: show available and applied network presets (revision 1).
const fs = require('node:fs');
const path = require('node:path');

const PRESETS = [
  { name: 'default', description: 'Inference endpoint only' },
  { name: 'github', description: 'GitHub API and git over HTTPS' },
  { name: 'pypi', description: 'Python package index' },
];

function appliedPresets() {
  const file = path.join(__dirname, '..', '..', 'nemoclaw-blueprint', 'policies', 'openclaw-sandbox.yaml');
  const text = fs.readFileSync(file, 'utf8');
  const applied = new Set(['default']);
  for (const match of text.matchAll(/^\s+-\s+([a-z0-9-]+)\s*$/gm)) applied.add(match[1]);
  return applied;
}

module.exports = {
  name: 'policy-list',
  scope: 'sandbox',
  summary: 'Show network policy presets',
  run() {
    const applied = appliedPresets();
    for (const preset of PRESETS) {
      console.log(`${applied.has(preset.name) ? '*' : ' '} ${preset.name.padEnd(9)}${preset.description}`);
    }
    return 0;
  },
};
