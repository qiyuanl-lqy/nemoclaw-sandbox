// Sandbox naming and lifecycle helpers shared by the CLI.

export const SANDBOX_NAME_PATTERN = /^[a-z0-9]([a-z0-9-]{0,38}[a-z0-9])?$/;

export function validateSandboxName(name: string): string | null {
  if (!SANDBOX_NAME_PATTERN.test(name)) {
    return `Invalid sandbox name '${name}': use 1-40 lowercase letters, digits or '-'`;
  }
  return null;
}

export type SandboxPhase = 'Pending' | 'Ready' | 'Stopped' | 'Failed' | 'NotFound' | 'Unknown';

export function isRunning(phase: SandboxPhase): boolean {
  return phase === 'Ready';
}
