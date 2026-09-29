'use strict';

// Sandbox registry persisted at ~/.nemoclaw/sandboxes.json.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REGISTRY = process.env.NEMOCLAW_REGISTRY || path.join(os.homedir(), '.nemoclaw', 'sandboxes.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY, 'utf8')).sandboxes || [];
  } catch {
    return [];
  }
}

function save(sandboxes) {
  fs.mkdirSync(path.dirname(REGISTRY), { recursive: true });
  fs.writeFileSync(REGISTRY, JSON.stringify({ sandboxes }, null, 2) + '\n', { mode: 0o600 });
}

function find(name) {
  return load().find((s) => s.name === name) || null;
}

function add(entry) {
  const sandboxes = load().filter((s) => s.name !== entry.name);
  sandboxes.push({ ...entry, default: sandboxes.length === 0 });
  save(sandboxes);
}

function remove(name) {
  save(load().filter((s) => s.name !== name));
}

module.exports = { REGISTRY, load, save, find, add, remove };
