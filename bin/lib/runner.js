'use strict';

const { spawnSync } = require('node:child_process');

// Thin wrapper around the OpenShell CLI.
function openshell(args, options = {}) {
  const result = spawnSync('openshell', args, { stdio: options.capture ? 'pipe' : 'inherit', encoding: 'utf8' });
  if (result.error) throw new Error(`openshell is not installed or not on PATH (${result.error.code})`);
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`openshell ${args.join(' ')} exited ${result.status}`);
  }
  return result;
}

function sandboxState(name) {
  const result = openshell(['sandbox', 'get', name, '--output', 'json'], { capture: true, allowFailure: true });
  if (result.status !== 0) return 'NotFound';
  try {
    return JSON.parse(result.stdout).status?.phase || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

module.exports = { openshell, sandboxState };
