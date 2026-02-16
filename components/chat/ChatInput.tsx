import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SendButton } from './SendButton';
import { IconButton } from '@/components/ui/IconButton';
import { ProviderSelector } from './ProviderSelector';
import { CircleNotch, Image as ImageIcon, MagicWand, Microphone, X } from '@phosphor-icons/react';

interface ChatInputProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null> | undefined;
  input?: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage?: (event: React.UIEvent, imagePreview?: { imageUrl?: string | null, imageName?: string | null, imageSize?: number | null } | null | undefined) => void;
  isStreaming?: boolean;
  handleStop?: () => void;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  enhancePrompt?: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
}

const TEXTAREA_MIN_HEIGHT = 80;
const TEXTAREA_MAX_HEIGHT = 400;

export const ChatInput: React.FC<ChatInputProps> = ({
  textareaRef,
  input = '',
  handleInputChange,
  sendMessage,
  isStreaming,
  handleStop,
  enhancingPrompt,
  promptEnhanced,
  enhancePrompt,
  onVoiceInput,
  isListening,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [isImageDragging, setIsImageDragging] = useState(false);

  const handleImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImageName(file.name);
      setImageSize(file.size);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleImage(file);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = Array.from(event.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;
    event.preventDefault();
    const file = imageItem.getAsFile();
    if (!file) return;
    handleImage(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    handleImage(file);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.types.includes('Files')) {
      setIsImageDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragging(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const handleSendMessage = (event: React.UIEvent) => {
    sendMessage?.(event, {
      imageUrl: imagePreview,
      imageName: imageName,
      imageSize: imageSize,
    });
    setImagePreview(null);
    setImageName(null);
    setImageSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        'luxury-card rounded-xl overflow-hidden transition-all duration-300',
        isImageDragging && 'ring-2 ring-primary/50'
      )}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      {/* Image Preview */}
      {imagePreview && (
        <div className="w-full border-b border-border/50 bg-secondary/30 p-3">
          <div className="relative max-w-xs bg-background/50 rounded-lg p-2 flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="absolute inset-0 w-full h-full object-cover rounded-md"
              />
            </div>
            <div className='flex flex-col gap-0.5 items-start justify-center min-w-0'>
              {imageName && <span className="text-sm text-foreground truncate font-medium">{imageName}</span>}
              {imageSize && <span className="text-xs text-muted-foreground">{formatBytes(imageSize)}</span>}
            </div>
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-1 right-1 p-1 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className='flex items-start justify-between w-full px-4 pt-4'>
        <textarea
          ref={textareaRef}
          className="w-full pr-4 sm:pr-6 focus:outline-none resize-none 
                    text-base text-foreground placeholder:text-muted-foreground/60
                    bg-transparent font-body leading-relaxed"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) return;
              event.preventDefault();
              handleSendMessage(event);
            }
          }}
          value={input}
          onChange={(event) => handleInputChange?.(event)}
          style={{
            minHeight: TEXTAREA_MIN_HEIGHT,
            maxHeight: TEXTAREA_MAX_HEIGHT,
          }}
          placeholder="What shall we create today?"
          translate="no"
        />
        <SendButton
          show={!!(input.length > 0 || isStreaming || imagePreview)}
          isStreaming={isStreaming}
          onClick={(event) => {
            if (isStreaming) {
              handleStop?.();
              return;
            }
            handleSendMessage(event);
          }}
        />
      </div>
      
      {/* Toolbar */}
      <div className="flex justify-between items-center text-sm p-3 pt-2">
        <div className="flex gap-1 items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
          <IconButton
            title="Attach an image"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className='text-lg' />
          </IconButton>
          <IconButton
            title="Voice input"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onVoiceInput?.()}
          >
            {isListening ? (
              <>
                <CircleNotch className='animate-spin text-lg text-primary' />
                <span className="text-xs text-primary">Listening...</span>
              </>
            ) : (
              <Microphone className='text-lg' />
            )}
          </IconButton>
          <IconButton
            title="Enhance prompt"
            disabled={input.length === 0 || enhancingPrompt}
            className={cn('text-muted-foreground hover:text-foreground transition-colors', {
              'text-primary': promptEnhanced,
            })}
            onClick={() => enhancePrompt?.()}
          >
            {enhancingPrompt ? (
              <CircleNotch className='animate-spin text-lg' />
            ) : (
              <MagicWand className='text-lg' />
            )}
          </IconButton>
          <ProviderSelector />
        </div>
        
        {input.length > 3 && (
          <div className="hidden sm:block text-xs text-muted-foreground/60">
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-secondary rounded">Shift</kbd>
            <span className="mx-1">+</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-secondary rounded">Return</kbd>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
