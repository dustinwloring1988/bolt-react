import { atom } from 'nanostores';

export type AnthropicModel = {
  id: 'claude-opus-4-6-20250205' | 'claude-sonnet-4-5-20251120' | 'claude-haiku-4-5-20251120';
  displayName: string;
};
export type GoogleModel = {
  id: 'gemini-3-pro' | 'gemini-3-flash';
  displayName: string;
};

export type OllamaModel = {
  id: 'gpt-oss:120b' | 'gpt-oss:latest' | 'qwen3-coder:latest' | 'granite3.2-vision:latest' | 'qwen3-vl:4b' | 'qwen3-vl:latest';
  displayName: string;
};

export enum ProviderType {
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  OLLAMA = 'ollama',
}

export type Provider =
  | { type: ProviderType.ANTHROPIC; model: AnthropicModel }
  | { type: ProviderType.GOOGLE; model: GoogleModel }
  | { type: ProviderType.OLLAMA; model: OllamaModel };

export const providerStore = atom<Provider>({ type: ProviderType.GOOGLE, model: { id: 'gemini-3-flash', displayName: 'Gemini 3 Flash' } });

export function setProvider(provider: Provider) {
  console.log('setProvider called with:', provider);
  providerStore.set(provider);
}


export const anthropicModels: AnthropicModel[] = [
  { id: 'claude-opus-4-6-20250205', displayName: 'Claude Opus 4.6' },
  { id: 'claude-sonnet-4-5-20251120', displayName: 'Claude Sonnet 4.5' },
  { id: 'claude-haiku-4-5-20251120', displayName: 'Claude Haiku 4.5' },
];

export const googleModels: GoogleModel[] = [
  { id: 'gemini-3-pro', displayName: 'Gemini 3 Pro' },
  { id: 'gemini-3-flash', displayName: 'Gemini 3 Flash' },
];


export const ollamaModels: OllamaModel[] = [
  { id: 'gpt-oss:120b', displayName: 'GPT-OSS 120B' },
  { id: 'gpt-oss:latest', displayName: 'GPT-OSS Latest' },
  { id: 'qwen3-coder:latest', displayName: 'Qwen3 Coder' },
  { id: 'granite3.2-vision:latest', displayName: 'Granite 3.2 Vision' },
  { id: 'qwen3-vl:4b', displayName: 'Qwen3 VL 4B' },
  { id: 'qwen3-vl:latest', displayName: 'Qwen3 VL Latest' },
];