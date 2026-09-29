#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { version } = require('../package.json');
const registry = require('./lib/registry');
const { onboard } = require('./lib/onboard');
const runner = require('./lib/runner');

const GLOBAL_COMMANDS = {
  onboard: { summary: 'Create a sandbox with the onboarding wizard', run: (args) => onboard(args) },
  list: { summary: 'List sandboxes', run: () => listSandboxes() },
};

const SANDBOX_COMMANDS = {
  connect: { summary: 'Open a shell in the sandbox', run: (name) => runner.openshell(['sandbox', 'connect', name]) },
  status: { summary: 'Show sandbox state', run: (name) => showStatus(name) },
  destroy: { summary: 'Delete the sandbox', run: (name) => destroySandbox(name) },
};

// Extra commands: bin/commands/<command>.js exporting { name, scope, summary, run }.
function loadPluginCommands() {
  const dir = path.join(__dirname, 'commands');
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
    const command = require(path.join(dir, file));
    const table = command.scope === 'sandbox' ? SANDBOX_COMMANDS : GLOBAL_COMMANDS;
    table[command.name] = command;
  }
}

function usage() {
  const lines = ['Usage: nemoclaw <command> [options]', '       nemoclaw <sandbox> <command> [options]', '', 'Commands:'];
  for (const [name, command] of Object.entries(GLOBAL_COMMANDS)) lines.push(`  ${name.padEnd(22)}${command.summary}`);
  for (const [name, command] of Object.entries(SANDBOX_COMMANDS)) lines.push(`  <sandbox> ${name.padEnd(12)}${command.summary}`);
  return lines.join('\n');
}

function listSandboxes() {
  const sandboxes = registry.load();
  if (sandboxes.length === 0) {
    console.log('No sandboxes. Run `nemoclaw onboard` to create one.');
    return 0;
  }
  console.log('NAME'.padEnd(24) + 'PROVIDER'.padEnd(16) + 'MODEL');
  for (const s of sandboxes) console.log(s.name.padEnd(24) + s.provider.padEnd(16) + s.model + (s.default ? ' (default)' : ''));
  return 0;
}

function showStatus(name) {
  const state = runner.sandboxState(name);
  console.log(`Sandbox: ${name}\nState:   ${state}`);
  return state === 'Ready' ? 0 : 1;
}

function destroySandbox(name) {
  runner.openshell(['sandbox', 'delete', name]);
  registry.remove(name);
  console.log(`Sandbox '${name}' destroyed`);
  return 0;
}

function main(argv) {
  loadPluginCommands();
  const [first, second, ...rest] = argv;
  if (!first || first === '--help' || first === '-h') {
    console.log(usage());
    return 0;
  }
  if (first === '--version' || first === '-v') {
    console.log(`nemoclaw ${version}`);
    return 0;
  }
  if (first.startsWith('-')) {
    console.error(`Unknown option: ${first}\n\n${usage()}`);
    return 2;
  }
  if (GLOBAL_COMMANDS[first]) return GLOBAL_COMMANDS[first].run([second, ...rest].filter(Boolean));
  if (!registry.find(first)) {
    console.error(`Sandbox '${first}' not found. Run \`nemoclaw list\` to see sandboxes.`);
    return 1;
  }
  const command = SANDBOX_COMMANDS[second || 'status'];
  if (!command) {
    console.error(`Unknown sandbox command: ${second}\n\n${usage()}`);
    return 2;
  }
  return command.run(first, rest);
}

if (require.main === module) {
  Promise.resolve(main(process.argv.slice(2))).then((code) => process.exit(code ?? 0));
}

module.exports = { main, usage };
