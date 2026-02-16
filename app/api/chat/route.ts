import { type NextRequest, NextResponse } from 'next/server';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '@/lib/llm/constants';
import { CONTINUE_PROMPT } from '@/lib/llm/prompts';
import { streamText, type StreamingOptions } from '@/lib/llm/stream-text';
import SwitchableStream from '@/lib/llm/switchable-stream';
import { type Provider } from '@/lib/stores/provider';
import { type UIMessage } from 'ai';

export const runtime = "edge";

export async function POST(request: NextRequest) {
  return chatAction(request);
}

async function chatAction(request: NextRequest) {
  const json = await request.json();
  const messages = json.messages as UIMessage[];
  const provider = json.provider as Provider;

  const stream = new SwitchableStream();
  const startTime = Date.now();

  try {
    const options: StreamingOptions = {
      toolChoice: 'none',
      onFinish: async ({ text: content, finishReason }) => {
        if (finishReason !== 'length') {
          return stream.close();
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw Error('Cannot continue message: Maximum segments reached');
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

        // @ts-expect-error AI SDK v6 message format
        messages.push({ role: 'assistant', content });
        // @ts-expect-error AI SDK v6 message format
        messages.push({ role: 'user', content: CONTINUE_PROMPT });

        const result = await streamText({ messages, provider, ...options });
        const response = result.toUIMessageStreamResponse();
        const body = response.body;
        if (!body) {
          throw new Error('No stream body');
        }
        return stream.switchSource(body);
      },
    };

    const result = await streamText({ messages, provider, ...options });
    const response = result.toUIMessageStreamResponse();
    const body = response.body;
    if (!body) {
      throw new Error('No stream body');
    }
    stream.switchSource(body);

    const endTime = Date.now();
        const executionTime = endTime - startTime;
        console.log(`API execution time: ${executionTime}ms`);

    return new NextResponse(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: unknown) {
    console.error(error);

    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}