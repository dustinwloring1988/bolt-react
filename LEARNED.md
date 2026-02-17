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

---

## Session Learnings (2026-02-16) - Theme Updates

### Corrections Applied
- [0.90] CodeMirror: Hardcoded purple theme colors (#27212e) need to be replaced with CSS variables matching the app's dark theme
- [0.85] Terminal (xterm): Background color was hardcoded to purple, needs to match editor theme
- [0.80] FileTree: Using Tailwind's `text-muted` class results in low contrast on dark backgrounds - use semantic color variables like `text-sidebar-foreground/70`
- [0.75] FileBreadcrumb dropdown: Background was `bg-white/5` which appears too light - use `bg-sidebar` with backdrop blur

### Successful Patterns
- [0.95] Color consistency: Use HSL values from the design system (hsl(220 25% 8%), hsl(38 70% 58%)) instead of arbitrary hex colors
- [0.90] Text contrast: Use opacity modifiers like `/70` or `/80` on foreground colors for better readability
- [0.85] Hover states: Pair color changes with background opacity changes for better visual feedback

### Anti-Patterns Identified
- [0.85] Avoid: Hardcoding colors in editor/terminal themes - use CSS variables or theme-consistent values
- [0.80] Avoid: Using generic Tailwind colors like `text-muted` in workbench components - they don't match the sidebar aesthetic

### Environment Details
- Tailwind CSS for styling
- Shadcn UI component library
- CodeMirror 6 for code editor
- xterm.js for terminal emulation
- Phosphor Icons for iconography

---

## Session Learnings (2026-02-17)

### Corrections Applied
- [0.90] IndexedDB: Cache both the promise AND the database instance to prevent race conditions
- [0.85] IndexedDB: When database version changes, handle VersionError by clearing old database
- [0.80] React: When using state in async callbacks, use local variables instead of state (setState is async)
- [0.75] Dialog accessibility: Radix DialogContent requires DialogTitle for screen readers
- [0.75] Dialog accessibility: Radix DialogContent needs aria-describedby or DialogDescription

### Successful Patterns
- [0.90] File locking: Use nanostores map for state management with localStorage persistence
- [0.85] File locking: Check locks in action-runner BEFORE writing files
- [0.80] History refresh: Subscribe to chatId atom to trigger reload when new chat is created

### Anti-Patterns Identified
- [0.90] Avoid: Nested button elements - use span with role="button" instead
- [0.85] Avoid: Using React state immediately after setState call (race condition)
- [0.80] Avoid: Opening IndexedDB without caching the promise (causes multiple simultaneous opens)

### Environment Details
- IndexedDB for chat persistence
- Radix UI for dialogs
- localStorage for file lock persistence

---

## Pattern: IndexedDB Database Caching

```typescript
// CORRECT - cache both promise and instance
let dbOpenPromise: Promise<IDBDatabase | undefined> | undefined;
let dbInstance: IDBDatabase | undefined;

export async function openDatabase(): Promise<IDBDatabase | undefined> {
  if (dbOpenPromise) {
    return dbOpenPromise;
  }

  dbOpenPromise = new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };
    request.onerror = () => {
      dbOpenPromise = undefined;
      resolve(undefined);
    };
  });
  return dbOpenPromise;
}
```

**Status**: ESTABLISHED  
**Confidence**: 0.90  
**Applied**: 1 time in this session

---

## Pattern: React State in Async Callbacks

```typescript
// CORRECT - use local variables
storeMessageHistory: async (messages: UIMessage[]) => {
  let currentUrlId = urlId; // copy state to local var
  
  if (!currentUrlId && firstArtifact?.id) {
    currentUrlId = await getUrlId(db, firstArtifact.id); // update local var
    setUrlId(currentUrlId); // update state for UI
  }
  
  await setMessages(db, currentChatId, messages, currentUrlId, ...); // use local var
}

// WRONG - using state immediately after setState
if (!urlId && firstArtifact?.id) {
  const newUrlId = await getUrlId(...);
  setUrlId(newUrlId);
  await setMessages(db, ..., urlId, ...); // urlId still has OLD value!
}
```

**Status**: ESTABLISHED  
**Confidence**: 0.85  
**Applied**: 1 time in this session

---

## Pattern: Dialog Accessibility

```typescript
// CORRECT - add hidden title and description
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

<DialogContent>
  <DialogTitle className="sr-only">Command Menu</DialogTitle>
  {children}
</DialogContent>

// OR use auto-generated IDs
const descriptionId = React.useId();
<DialogPrimitive.Content aria-describedby={descriptionId}>
  <DialogDescription id={descriptionId} className="sr-only">
    Dialog description
  </DialogDescription>
</DialogPrimitive.Content>
```

**Status**: ESTABLISHED  
**Confidence**: 0.90  
**Applied**: 3 times in this session
