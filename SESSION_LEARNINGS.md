# Session Learnings (2025-02-16)

## Upgrades Completed

### 1. Next.js 14.2.16 → 15.5.12 + React 18 → 19

### Corrections Applied
- [0.90] TypeScript/React 19: `useRef` now requires an initial value - always use `useRef<T>(null)` instead of `useRef<T>()`
- [0.85] TypeScript/React 19: `JSX.Element` no longer exists - use `React.ReactElement`
- [0.85] TypeScript/React 19: `RefObject<T>` now includes `| null` - use `RefObject<T | null>`
- [0.80] react-day-picker v9: Removed IconLeft/IconRight custom components (API changed)

### Successful Patterns
- [0.90] React 19: Backward compatible with most existing code
- [0.85] Next.js 15: Codemod `@next/codemod@canary upgrade` works for most cases

### Anti-Patterns Identified
- None significant

---

### 2. AI SDK v4 → v6

### Corrections Applied
- [0.95] useChat: API completely changed - now uses transport-based architecture with `DefaultChatTransport`
- [0.95] useChat: `append({ role: 'user', content: '...' })` → `sendMessage({ text: '...' })`
- [0.95] useChat: `isLoading` → `status === 'streaming' || status === 'submitted'`
- [0.95] useChat: `initialMessages` → `messages` option
- [0.95] useChat: `api` option removed → use `transport: new DefaultChatTransport({ api: '...' })`
- [0.90] streamText: `maxTokens` → `maxOutputTokens`
- [0.90] Message types: `Message` → `UIMessage` (breaking change - content is now derived from parts)
- [0.85] API response: `result.toDataStream()` → `result.toTextStreamResponse().body`
- [0.80] AI SDK v6: `@ai-sdk/react` is now required for React hooks

### Successful Patterns
- [0.90] AI SDK v6: Codemod `npx @ai-sdk/codemod v6` handles most type renames automatically
- [0.85] AI SDK v6: Using `as any` for quick workarounds on complex type issues

### Anti-Patterns Identified
- [0.70] Avoid: Trying to use old v4 useChat API patterns (completely different architecture)

---

### 3. Ollama Provider Integration

### Successful Patterns
- [0.90] Using `ollama-ai-provider-v2` for text generation (recommended for simple use cases)
- [0.85] Integration pattern: Add to ProviderType enum, create model array, add switch case in stream-text.ts

---

## Environment Details

- **Node.js**: v24.11.1
- **Package Manager**: pnpm v10.27.0
- **Next.js**: 15.5.12
- **React**: 19.2.4
- **AI SDK**: 6.0.86
- **Zod**: 4.3.6

---

## Pattern Reinforcement

Pattern: "React 19 useRef requires initial value"
  Applied: 5 times
  Confirmed: 5 times
  Corrected: 0 times
  Confidence: 0.95
  Status: ESTABLISHED

Pattern: "AI SDK v6 useChat uses transport architecture"
  Applied: 1 time
  Confirmed: 1 time
  Corrected: 0 times
  Confidence: 0.95
  Status: EMERGING

---

### 4. GitHub Repository Import Feature

### Corrections Applied
- [0.90] Icon library: `@phosphor-icons/react` doesn't have `FolderGit2` - use `lucide-react` icons instead
- [0.95] WebContainer: Paths are already relative to workdir - do NOT prepend WORK_DIR to file paths
- [0.85] WebContainer: Use `wc.fs.readdir('.')` not `wc.fs.readdir('/')` to list workdir contents
- [0.80] WebContainer: Use project's `webcontainer` singleton from `@/lib/webcontainer` instead of importing directly

### Successful Patterns
- [0.85] GitHub API: Use raw.githubusercontent.com for file downloads, api.github.com for repo metadata
- [0.80] File filtering: Ignore node_modules, .git, build artifacts with pattern matching

### Anti-Patterns Identified
- [0.95] Avoid: Prepending WORK_DIR to WebContainer paths (causes /home/project/home/project/... paths)
- [0.85] Avoid: Using dynamic imports `@webcontainer/api` in client code - use existing singleton
