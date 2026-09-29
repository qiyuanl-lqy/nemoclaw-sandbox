'use strict';

const readline = require('node:readline/promises');
const registry = require('./registry');
const runner = require('./runner');
const { validateSandboxName } = require('../../src/lib/sandbox');
const { PROVIDERS, defaultModel } = require('../../src/lib/inference-config');

async function onboard() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const provider = (await rl.question(`Inference provider [${PROVIDERS.join('/')}]: `)).trim() || PROVIDERS[0];
    if (!PROVIDERS.includes(provider)) {
      console.error(`Unsupported provider: ${provider}`);
      return 1;
    }
    const model = (await rl.question(`Model [${defaultModel(provider)}]: `)).trim() || defaultModel(provider);
    const name = (await rl.question('Sandbox name [my-assistant]: ')).trim() || 'my-assistant';
    const error = validateSandboxName(name);
    if (error) {
      console.error(error);
      return 1;
    }
    runner.openshell(['sandbox', 'create', name, '--blueprint', 'nemoclaw-blueprint/blueprint.yaml']);
    registry.add({ name, provider, model });
    console.log(`Sandbox '${name}' is ready. Connect with: nemoclaw ${name} connect`);
    return 0;
  } finally {
    rl.close();
  }
}

module.exports = { onboard };
