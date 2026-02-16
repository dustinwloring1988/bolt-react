[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
[![AI SDK](https://img.shields.io/badge/AI%20SDK-v6-000000?style=flat)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)

# nextjs-bolt

A Next.js 15 AI Chat Application powered by Vercel AI SDK with multi-provider support.

## Features

- **Multi-Provider AI Support**: Google Gemini, Anthropic Claude, TogetherAI, xAI Grok, and Ollama
- **Real-time Streaming**: Powered by Vercel AI SDK v6
- **Code Execution**: Integrated WebContainer for sandboxed code running
- **Rich Code Editor**: CodeMirror 6 with syntax highlighting for multiple languages
- **Terminal**: xterm.js for interactive terminal output
- **Modern UI**: Built with Radix UI components, Tailwind CSS, and Framer Motion

## Providers

| Provider | Models |
|----------|--------|
| Google | gemini-3-pro, gemini-3-flash |
| Anthropic | claude-opus-4-6, claude-sonnet-4-5, claude-haiku-4-5 |
| Ollama | gpt-oss, qwen3-coder, granite3.2-vision, qwen3-vl |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_key
TOGETHER_API_KEY=your_together_key
```

Ollama runs locally on `http://localhost:11434`.

## Tech Stack

- **Framework**: Next.js 15.5.12 + React 19
- **AI SDK**: Vercel AI SDK 6.0.86
- **Styling**: Tailwind CSS + Radix UI
- **State**: Zustand + Nanostores
- **Editor**: CodeMirror 6
