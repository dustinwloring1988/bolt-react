"use client"
import type { UIMessage } from 'ai';
import React from 'react';
import { cn } from '@/lib/utils';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { motion } from 'framer-motion';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: UIMessage[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const role = message.role;
            const messageWithContent = message as UIMessage & { content: string };
            const content = messageWithContent.content;
            const data = 'data' in message ? (message as { data?: { url?: string; size?: number; name?: string; } | string | null }).data : undefined;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.05 
                }}
                className={cn(
                  'flex gap-4 p-5 w-full rounded-xl',
                  isUserMessage 
                    ? 'bg-secondary/40 border border-border/30' 
                    : 'bg-transparent',
                  {
                    'mt-3': !isFirst,
                  }
                )}
              >
                {/* Avatar/Indicator */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div 
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                      isUserMessage 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-accent/20 text-accent border border-accent/30'
                    )}
                  >
                    {isUserMessage ? 'You' : 'AI'}
                  </div>
                  {/* Subtle connecting line */}
                  {!isLast && (
                    <div className="w-px flex-1 bg-border/20 min-h-[20px]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-xs text-muted-foreground/70 mb-2 font-medium tracking-wide uppercase">
                    {isUserMessage ? 'Your Prompt' : 'Assistant'}
                  </div>
                  {isUserMessage ? (
                    <UserMessage content={content} data={data} />
                  ) : (
                    <AssistantMessage content={content} />
                  )}
                </div>
              </motion.div>
            );
          })
        : null}
      
      {/* Streaming Indicator */}
      {isStreaming && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-5 py-3"
        >
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="text-accent text-xs">AI</span>
          </div>
          <div className="flex gap-1">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
});

Messages.displayName = 'Messages';
