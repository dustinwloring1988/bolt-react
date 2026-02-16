# Project Learnings

## Session Learnings (2026-02-16)

### Corrections Applied
- [0.85] AI SDK v6: Use `message.parts` instead of `message.content` for extracting message text
- [0.80] React/Next.js: When using nanostores with useChat, use `store.get()` inside prepareSendMessagesRequest to get fresh value instead of captured closure variable
- [0.75] Shadcn UI Sidebar: Add `defaultOpen={true}` to SidebarProvider if sidebar should be visible by default

### Successful Patterns
- [0.90] AI SDK v6: Convert UIMessage to text using `message.parts.filter(p => p.type === 'text').map(p => p.text).join('')`
- [0.85] AI SDK v6 stream response: Use `result.toUIMessageStreamResponse()` for proper message streaming

### Anti-Patterns Identified
- [0.90] Avoid: Using `(message as any).content` with AI SDK v6 - it breaks because v6 uses `parts` not `content`
- [0.80] Avoid: Capturing nanostore value in closure for useChat transport - it captures stale state

### Environment Details
- Next.js 15.5.12
- React 19
- AI SDK v6.0.86 (@ai-sdk/react 3.0.88)
- nanostores (@nanostores/react) for state management
- ollama-ai-provider-v2 for Ollama support
- Vercel AI SDK providers: anthropic, google

---

## Pattern: AI SDK v6 Message Content Extraction

```typescript
// AI SDK v6 - CORRECT
const content = message.parts
  .filter(part => part.type === 'text')
  .map(part => part.text)
  .join('');

// AI SDK v6 - WRONG (causes undefined error)
const content = (message as any).content;
```

**Status**: ESTABLISHED  
**Confidence**: 0.90  
**Applied**: 2 times in this session (useMessageParser.ts, Chat.tsx)

---

## Pattern: Reading Fresh State in useChat Transport

```typescript
// CORRECT - get fresh value at request time
prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
  const currentProvider = providerStore.get(); // Fresh read
  return { body: { messages, trigger, messageId, provider: currentProvider } };
}

// WRONG - captures stale closure value
prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
  return { body: { messages, trigger, messageId, provider } }; // stale!
}
```

**Status**: GROWING  
**Confidence**: 0.80  
**Applied**: 1 time in this session
