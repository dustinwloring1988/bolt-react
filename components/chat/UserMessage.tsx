import { modificationsRegex } from '@/utils/diff';
import { Markdown } from './Markdown';

interface UserMessageProps {
  content: string;
  data?: {
    url?: string;
    size?: number;
    name?: string;
  } | string | null;
}

export function UserMessage({ content, data }: UserMessageProps) {
  let imageUrl: string | null = null;
  let imageSize: number | null = null;
  let imageName: string | null = null;

  if (data && typeof data === 'object' && 'url' in data) {
    imageUrl = data.url ?? null;
    imageSize = data.size ?? null;
    imageName = data.name ?? null;
  } else if (typeof data === 'string' && data.startsWith('data:image')) {
      imageUrl = data;
      imageSize = data.length;
      imageName = 'User uploaded image';
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
  
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
    const i = Math.floor(Math.log(bytes) / Math.log(k))
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }


  return (
    <div className="overflow-hidden flex gap-2 items-start justify-between">
      <Markdown limitedMarkdown>{sanitizeUserMessage(content)}</Markdown>
      {imageUrl && (
        <div className="relative min-w-44 max-w-44 bg-background opacity-70 border rounded-lg p-2 flex items-center gap-2 overflow-hidden">
          <div className="relative min-w-8 h-8">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover rounded-md"
            />
          </div>
          <div className='flex flex-col gap-1 items-start justify-center'>
            <span className="text-xs text-accent truncate">{imageName}</span>
            <span className="text-xs text-muted truncate">{imageSize !== null ? formatBytes(imageSize) : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function sanitizeUserMessage(content: string) {
  return content.replace(modificationsRegex, '').trim();
}