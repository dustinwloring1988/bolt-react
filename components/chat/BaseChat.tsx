"use client"
import type { UIMessage } from 'ai';
import React, { type RefCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Messages } from './Messages';
import { ChatInput } from './ChatInput';
import { ChatIntro } from './ChatIntro';
import { ChatExamples } from './ChatExamples';
import { Workbench } from '@/components/workbench/Workbench';
import ChatAlert from './ChatAlert';
import { ActionAlert } from '@/types/actions';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: any;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string, imagePreview?: { imageUrl?: string | null, imageName?: string | null, imageSize?: number | null } | null | undefined) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
      onVoiceInput,
      isListening,
      actionAlert,
      clearAlert,
    },
    ref,
  ) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      if (isStreaming) {
        scrollToBottom();
      }
    }, [messages, isStreaming]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-full min-h-full w-full overflow-hidden max-w-full'
        )}
        data-chat-visible={showChat}
      >
        <div className="flex flex-1 w-full h-full">
          {showChat ? (
            <div
              ref={scrollRef}
              className="flex flex-1 overflow-y-auto w-full h-full justify-center elegant-scrollbar"
            >
              <div className="flex flex-col flex-grow h-full w-full">
                {!chatStarted && <ChatIntro />}
                <div className={cn({ 'h-full flex flex-col': chatStarted })}>
                  {chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-2xl px-4 pb-6 mx-auto"
                      messages={messages || []}
                      isStreaming={isStreaming}
                    />
                  ) : null}
                  <div
                    className={cn(
                      'relative w-full max-w-2xl mx-auto',
                      { 'sticky bottom-0': chatStarted }
                    )}
                  >
                    <div className="mb-2">
                      {actionAlert && (
                        <ChatAlert
                          alert={actionAlert}
                          clearAlert={() => clearAlert?.()}
                          postMessage={(message) => {
                            sendMessage?.({} as any, message);
                            clearAlert?.();
                          }}
                        />
                      )}
                    </div>
                    <ChatInput
                      textareaRef={textareaRef}
                      input={input}
                      handleInputChange={handleInputChange}
                      sendMessage={(event: React.UIEvent<Element, UIEvent>, imagePreview: { imageUrl?: string | null, imageName?: string | null, imageSize?: number | null } | null | undefined) => sendMessage?.(event, input, imagePreview)}
                      isStreaming={isStreaming}
                      handleStop={handleStop}
                      enhancingPrompt={enhancingPrompt}
                      promptEnhanced={promptEnhanced}
                      enhancePrompt={enhancePrompt}
                      onVoiceInput={onVoiceInput}
                      isListening={isListening}
                    />
                    <div ref={messagesEndRef}/>
                  </div>
                </div>
                {!chatStarted && (
                  <ChatExamples sendMessage={sendMessage} />
                )}
              </div>
            </div>
          ) : null}
          <Workbench chatStarted={chatStarted} isStreaming={isStreaming} className={cn("h-full", {
            'w-full flex-grow': !showChat,
          })} />
        </div>
      </div>
    );
  },
);

BaseChat.displayName = 'BaseChat';
