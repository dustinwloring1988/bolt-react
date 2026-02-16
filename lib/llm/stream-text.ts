import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { ollama } from 'ollama-ai-provider-v2';
import { streamText as _streamText, convertToModelMessages, type UIMessage } from 'ai';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from '@/lib/llm/prompts';
import { type Provider, ProviderType } from '@/lib/stores/provider';

export interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model' | 'messages' | 'prompt'>;


export async function streamText({ messages, provider, ...options }: { messages: UIMessage[], provider: Provider } & StreamingOptions) {
  let model: any;

  switch (provider.type) {
    case ProviderType.ANTHROPIC:
      model = anthropic(provider.model.id);
      break;
    case ProviderType.GOOGLE:
      model = google(provider.model.id);
      break;
    case ProviderType.OLLAMA:
      model = ollama(provider.model.id);
      break;
    default:
      model = google("gemini-2.0-flash-thinking-exp-1219");
  }

  // Convert UIMessages to ModelMessages for AI SDK v6
  const modelMessages = await convertToModelMessages(messages);

  return _streamText({
    model,
    system: getSystemPrompt(),
    maxOutputTokens: MAX_TOKENS,
    messages: modelMessages,
    ...options,
  });
}