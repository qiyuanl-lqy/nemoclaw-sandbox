// Inference providers supported by the onboarding wizard.

export const PROVIDERS = ['nvidia', 'openai', 'anthropic', 'ollama'] as const;
export type Provider = (typeof PROVIDERS)[number];

const DEFAULT_MODELS: Record<Provider, string> = {
  nvidia: 'nvidia/nemotron-3-super-120b-a12b',
  openai: 'gpt-5.5',
  anthropic: 'claude-sonnet-5-5',
  ollama: 'llama4:scout',
};

export function defaultModel(provider: Provider): string {
  return DEFAULT_MODELS[provider];
}
