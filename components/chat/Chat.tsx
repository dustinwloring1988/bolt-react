import { useStore } from '@nanostores/react';
import type { UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { cssTransition, ToastContainer } from 'react-toastify';
import { useMessageParser, usePromptEnhancer, useShortcuts, useSnapScroll } from '@/hooks';
import { useChatHistory } from '@/persistance';
import { chatStore } from '@/lib/stores/chat';
import { workbenchStore } from '@/lib/stores/workbench';
import { fileModificationsToHTML } from '@/utils/diff';
import { providerStore } from '@/lib/stores/provider';
import { createScopedLogger, renderLogger } from '@/utils/logger';
import { BaseChat } from '@/components/chat/BaseChat';
import { useParams } from 'next/navigation';
import { debounce } from '@/utils/debounce';
import { useToast } from '@/hooks/use-toast';
import { Check, WarningCircle } from '@phosphor-icons/react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

const logger = createScopedLogger('Chat');

export default function Chat() {
  renderLogger.trace('Chat');
  const { id } = useParams();
  const parsedId = Array.isArray(id) ? id[0] : id;
  const { ready, initialMessages, storeMessageHistory } = useChatHistory(parsedId);

  return (
    <>
      {ready && <ChatImpl initialMessages={initialMessages} storeMessageHistory={storeMessageHistory} />}
      <ToastContainer
        closeButton={({ closeToast }) => {
          return (
            <button className="Toastify__close-button" onClick={closeToast}>
              <div className="i-ph:x text-lg" />
            </button>
          );
        }}
        icon={({ type }) => {
          /**
           * @todo Handle more types if we need them. This may require extra color palettes.
           */
          switch (type) {
            case 'success': {
              return <Check className="text-green-500 text-2xl" />;
            }
            case 'error': {
              return <WarningCircle className="text-destructive text-2xl" />;
            }
          }

          return undefined;
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
      />
    </>
  );
}

interface ChatProps {
  initialMessages: UIMessage[];
  storeMessageHistory: (messages: UIMessage[]) => Promise<void>;
}

export const ChatImpl = memo(({ initialMessages, storeMessageHistory }: ChatProps) => {
  useShortcuts();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actionAlert = useStore(workbenchStore.alert);
  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
  const { showChat } = useStore(chatStore);
  const { toast } = useToast();

  const [input, setInput] = useState('');

  const { messages, status, sendMessage: handleSend, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
        const currentProvider = providerStore.get();
        return {
          body: {
            messages,
            trigger,
            messageId,
            provider: currentProvider,
          },
        };
      },
    }),
    messages: initialMessages,
    onError: (error) => {
      logger.error('Request failed\n\n', error);
      toast({
        variant: 'destructive',
        title: 'There was an error processing your request',
        description: error.message,
      });
    },
    onFinish: () => {
      logger.debug('Finished streaming');
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer();
  const { parsedMessages, parseMessages } = useMessageParser();

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

   
   
  const debouncedParseMessages = useCallback(
    debounce((messages, isLoading) => {
      parseMessages(messages, isLoading);
    }, 300),
    []
  );

  const previousMessages = useRef<UIMessage[]>(initialMessages);

  useEffect(() => {
    debouncedParseMessages(messages, isLoading);

    if (
      messages.length > initialMessages.length &&
      JSON.stringify(messages) !== JSON.stringify(previousMessages.current)
    ) {
      storeMessageHistory(messages).catch((error) =>
        toast({
          variant: 'destructive',
          title: error.message,
        })
      );
      previousMessages.current = messages;
    }
  }, [messages, isLoading, storeMessageHistory]);

  const scrollTextArea = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const abort = () => {
    stop();
    chatStore.setKey('aborted', true);
    workbenchStore.abortAllActions();
  };

   
  const debouncedSetTextareaHeight = useCallback(
    debounce(() => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.style.height = 'auto';

        const scrollHeight = textarea.scrollHeight;

        textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
        textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
      }
    }, 100),
    [textareaRef, TEXTAREA_MAX_HEIGHT]
  );

  useEffect(() => {
    debouncedSetTextareaHeight();
  }, [input, debouncedSetTextareaHeight]);

  const runAnimation = async () => {
    if (chatStarted) {
      return;
    }

    // TODO: fix or remove this
    const _introElement = document.querySelector('#intro');
    const _examplesElement = document.querySelector('#examples');

    {/*if (!introElement || !examplesElement) {
      return;
    }*/}

    chatStore.setKey('started', true);

    setChatStarted(true);
  };

  const sendMessage = async (
    _event: React.UIEvent,
    messageInput?: string,
    _imagePreview?: { imageUrl?: string | null; imageName?: string | null; imageSize?: number | null } | null | undefined
  ) => {
    const _input = messageInput || input;

    if (_input.length === 0 || isLoading) {
      return;
    }

    /**
     * @note (delm) Usually saving files shouldn't take long but it may take longer if there
     * many unsaved files. In that case we need to block user input and show an indicator
     * of some kind so the user is aware that something is happening. But I consider the
     * happy case to be no unsaved files and I would expect users to save their changes
     * before they send another message.
     */
    await workbenchStore.saveAllFiles();

    const fileModifications = workbenchStore.getFileModifcations();

    chatStore.setKey('aborted', false);

    runAnimation();

    if (fileModifications !== undefined) {
      const diff = fileModificationsToHTML(fileModifications);

      /**
       * If we have file modifications we sendMessage a new user message manually since we have to prefix
       * the user input with the file modifications and we don't want the new user input to appear
       * in the prompt. Using `handleSend` is almost the same as `handleSubmit` except that we have to
       * manually reset the input and we'd have to manually pass in file attachments. However, those
       * aren't relevant here.
       */
      handleSend({
        text: `${diff}\n\n${_input}`,
      });

      /**
       * After sending a new message we reset all modifications since the model
       * should now be aware of all the changes.
       */
      workbenchStore.resetAllFileModifications();
    } else {
      handleSend({ text: _input });
    }

    setInput('');

    resetEnhancer();

    textareaRef.current?.blur();
  };

  const [messageRef, scrollRef] = useSnapScroll();

  const { isListening, startListening, stopListening } = useSpeechRecognition();

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInput(transcript);
      });
    }
  }, [isListening, startListening, stopListening, setInput]);

  return (
    <BaseChat
      textareaRef={textareaRef}
      input={input}
      showChat={showChat}
      chatStarted={chatStarted}
      isStreaming={isLoading}
      enhancingPrompt={enhancingPrompt}
      promptEnhanced={promptEnhanced}
      sendMessage={sendMessage}
      messageRef={messageRef}
      scrollRef={scrollRef}
      handleInputChange={handleInputChange}
      isListening={isListening}
      onVoiceInput={handleVoiceInput}
      handleStop={abort}
      messages={messages.map((message, i) => {
        if (message.role === 'user') {
          const content = message.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('');
          return {
            ...message,
            content: content || '',
          };
        }

        return {
          ...message,
          content: (parsedMessages[i] || '') as string,
        };
      })}
      enhancePrompt={() => {
        enhancePrompt(input, (input: SetStateAction<string>) => {
          setInput(input);
          scrollTextArea();
        });
      }}
      actionAlert={actionAlert}
      clearAlert={() => workbenchStore.clearAlert()}
    />
  );
});

ChatImpl.displayName = 'ChatImpl';