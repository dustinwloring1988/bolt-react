# AGENTS.md

This file documents the AI agents and their configurations for this project.

## Project Overview

- **Name**: nextjs-bolt
- **Type**: Next.js AI Chat Application
- **Framework**: Next.js 15.5.12 + React 19
- **AI SDK**: Vercel AI SDK 6.0.86

## Supported AI Providers

### Google
- Models: `gemini-2.0-flash-exp`, `gemini-2.0-flash-thinking-exp-1219`, `gemini-2.5-flash-preview-04-17`

### Anthropic
- Models: `claude-3-opus-20240229`, `claude-3.5-sonnet-20241022`, `claude-3.5-haiku-20241022`

### TogetherAI
- Models: `meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo`, `meta-llama/Llama-3.3-70B-Instruct-Turbo`, `meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo`, `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`, `Qwen/Qwen2.5-Coder-32B-Instruct`, `Qwen/QwQ-32B-Preview`

### xAI
- Models: `grok-2-latest`

### Ollama (Community Provider)
- Package: `ollama-ai-provider-v2`
- Models: `gpt-oss:120b`, `gpt-oss:latest`, `qwen3-coder:latest`, `granite3.2-vision:latest`, `qwen3-vl:4b`, `qwen3-vl:latest`

## Provider Configuration

### Environment Variables
- `ANTHROPIC_API_KEY` - For Anthropic models
- `TOGETHER_API_KEY` - For TogetherAI models
- Ollama runs locally on `http://localhost:11434`

### Adding New Providers

1. Add provider type to `lib/stores/provider.ts`:
   - Add to `ProviderType` enum
   - Add model type definition
   - Add model array with available models

2. Update `lib/llm/stream-text.ts`:
   - Import provider from `@ai-sdk/*` or community package
   - Add case in switch statement

3. Update UI components:
   - `components/chat/ProviderSelector.tsx` - Dropdown menu
   - `components/sidebar/app-sidebar.tsx` - Sidebar model list

## API Routes

### `/api/chat`
- Method: POST
- Body: `{ messages: UIMessage[], provider: Provider }`
- Returns: Streamed text response
- Runtime: Edge

## Key Dependencies

```json
{
  "ai": "^6.0.0",
  "@ai-sdk/react": "^3.0.0",
  "@ai-sdk/anthropic": "^3.0.0",
  "@ai-sdk/google": "^3.0.0",
  "@ai-sdk/openai": "^3.0.0",
  "ollama-ai-provider-v2": "^3.3.0",
  "ai-sdk-ollama": "^3.7.0",
  "zod": "^4.1.8"
}
```

## AI SDK v6 Migration Notes

### useChat API Changes
- Use `DefaultChatTransport` for HTTP transport
- `sendMessage({ text: '...' })` instead of `append({ role: 'user', content: '...' })`
- Check loading state via `status === 'streaming'`

### streamText API
- Use `maxOutputTokens` instead of `maxTokens`
- Use `result.toTextStreamResponse().body` for streaming responses

### Message Types
- Use `UIMessage` from 'ai' for client-side messages
- Access content via `(message as any).content` (content is derived from parts in v6)
