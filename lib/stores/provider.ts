import { atom } from 'nanostores';

export type AnthropicModel = {
  id: 'claude-3-opus-20240229' | 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022';
  displayName: string;
};
export type GoogleModel = {
  id: 'gemini-2.0-flash-exp' | 'gemini-2.0-flash-thinking-exp-1219' | 'gemini-2.5-flash-preview-04-17';
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

export const providerStore = atom<Provider>({ type: ProviderType.GOOGLE, model: { id: 'gemini-2.0-flash-thinking-exp-1219', displayName: 'Gemini Flash Thinking' } });

export function setProvider(provider: Provider) {
  console.log('setProvider called with:', provider);
  providerStore.set(provider);
}


export const anthropicModels: AnthropicModel[] = [
  { id: 'claude-3-opus-20240229', displayName: 'Claude Opus Latest' },
  { id: 'claude-3-5-sonnet-20241022', displayName: 'Claude Sonnet 3.5' },
  { id: 'claude-3-5-haiku-20241022', displayName: 'Claude Haiku Latest' },
];

export const googleModels: GoogleModel[] = [
  { id: 'gemini-2.0-flash-exp', displayName: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-thinking-exp-1219', displayName: 'Gemini 2.0 Flash Thinking' },
  { id: 'gemini-2.5-flash-preview-04-17', displayName: 'Gemini 2.5 Preview'},
];


export const ollamaModels: OllamaModel[] = [
  { id: 'gpt-oss:120b', displayName: 'GPT-OSS 120B' },
  { id: 'gpt-oss:latest', displayName: 'GPT-OSS Latest' },
  { id: 'qwen3-coder:latest', displayName: 'Qwen3 Coder' },
  { id: 'granite3.2-vision:latest', displayName: 'Granite 3.2 Vision' },
  { id: 'qwen3-vl:4b', displayName: 'Qwen3 VL 4B' },
  { id: 'qwen3-vl:latest', displayName: 'Qwen3 VL Latest' },
];