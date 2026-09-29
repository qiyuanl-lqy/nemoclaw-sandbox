// Network policy presets applied to a sandbox at creation time.

export interface PolicyPreset {
  name: string;
  description: string;
  egress: string[];
}

export const PRESETS: PolicyPreset[] = [
  { name: 'default', description: 'Inference endpoint only', egress: ['inference.local:443'] },
  { name: 'github', description: 'GitHub API and git over HTTPS', egress: ['api.github.com:443', 'github.com:443'] },
  { name: 'pypi', description: 'Python package index', egress: ['pypi.org:443', 'files.pythonhosted.org:443'] },
];

export function findPreset(name: string): PolicyPreset | undefined {
  return PRESETS.find((preset) => preset.name === name);
}
