import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { workbenchStore } from '@/lib/stores/workbench';
import { PortDropdown } from './PortDropdown';
import { ArrowClockwise, CaretDown, DeviceMobile, DeviceTablet, Monitor, ArrowsOut } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ViewportSize {
  name: string;
  width: number;
  height: number;
  frameType: 'mobile' | 'tablet' | 'desktop';
  icon: React.ReactNode;
}

const VIEWPORT_SIZES: ViewportSize[] = [
  { name: 'Responsive', width: 0, height: 0, frameType: 'desktop', icon: <ArrowsOut /> },
  { name: 'Mobile', width: 375, height: 667, frameType: 'mobile', icon: <DeviceMobile /> },
  { name: 'Tablet', width: 768, height: 1024, frameType: 'tablet', icon: <DeviceTablet /> },
  { name: 'Desktop', width: 1280, height: 800, frameType: 'desktop', icon: <Monitor /> },
];

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPortDropdownOpen, setIsPortDropdownOpen] = useState(false);
  const [isViewportDropdownOpen, setIsViewportDropdownOpen] = useState(false);
  const [selectedViewport, setSelectedViewport] = useState<ViewportSize>(VIEWPORT_SIZES[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const hasSelectedPreview = useRef(false);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!activePreview) {
      setUrl('');
      setIframeUrl(undefined);

      return;
    }

    const { baseUrl } = activePreview;

    setUrl(baseUrl);
    setIframeUrl(baseUrl);
  }, [activePreview, iframeUrl]);

  const validateUrl = useCallback(
    (value: string) => {
      if (!activePreview) {
        return false;
      }

      const { baseUrl } = activePreview;

      if (value === baseUrl) {
        return true;
      } else if (value.startsWith(baseUrl)) {
        return ['/', '?', '#'].includes(value.charAt(baseUrl.length));
      }

      return false;
    },
    [activePreview],
  );

  const findMinPortIndex = useCallback(
    (minIndex: number, preview: { port: number }, index: number, array: { port: number }[]) => {
      return preview.port < array[minIndex].port ? index : minIndex;
    },
    [],
  );

  useEffect(() => {
    if (previews.length > 1 && !hasSelectedPreview.current) {
      const minPortIndex = previews.reduce(findMinPortIndex, 0);

      setActivePreviewIndex(minPortIndex);
    }
  }, [previews]);

  const reloadPreview = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      iframeRef.current.src = currentSrc;
    }
  };

  const handleViewportChange = (viewport: ViewportSize) => {
    setSelectedViewport(viewport);
    setIsViewportDropdownOpen(false);
  };

  const toggleOrientation = () => {
    setIsLandscape(!isLandscape);
  };

  const getViewportDimensions = () => {
    if (selectedViewport.width === 0) {
      return { width: '100%', height: '100%' };
    }

    const width = isLandscape ? selectedViewport.height : selectedViewport.width;
    const height = isLandscape ? selectedViewport.width : selectedViewport.height;

    return { width: `${width}px`, height: `${height}px` };
  };

  const renderDeviceFrame = () => {
    const dims = getViewportDimensions();
    const frameType = selectedViewport.frameType;

    if (selectedViewport.width === 0) {
      return (
        <iframe
          ref={iframeRef}
          className="border-none w-full h-full bg-white"
          src={iframeUrl}
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      );
    }

    return (
      <div
        className={cn(
          'mx-auto bg-black rounded-lg overflow-hidden shadow-2xl',
          frameType === 'mobile' && 'rounded-[2.5rem] p-3 pb-6',
          frameType === 'tablet' && 'rounded-[1.5rem] p-4 pb-8',
          frameType === 'desktop' && 'rounded-lg p-1',
        )}
        style={{ width: dims.width, maxWidth: '100%' }}
      >
        {frameType === 'mobile' && (
          <div className="relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full" />
            <iframe
              ref={iframeRef}
              className="border-none w-full bg-white rounded-[1.75rem]"
              style={{ height: dims.height }}
              src={iframeUrl}
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        )}
        {frameType === 'tablet' && (
          <div className="relative">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/30 rounded-full" />
            <iframe
              ref={iframeRef}
              className="border-none w-full bg-white rounded-[1rem]"
              style={{ height: dims.height }}
              src={iframeUrl}
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        )}
        {frameType === 'desktop' && (
          <div className="bg-zinc-800 rounded-t-md p-2 pb-0">
            <div className="flex gap-1.5 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <iframe
              ref={iframeRef}
              className="border-none w-full bg-white rounded-b-md"
              style={{ height: dims.height }}
              src={iframeUrl}
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {(isPortDropdownOpen || isViewportDropdownOpen) && (
        <div className="z-iframe-overlay w-full h-full absolute" onClick={() => { setIsPortDropdownOpen(false); setIsViewportDropdownOpen(false); }} />
      )}
      <div className="bg-white/5 p-2 flex items-center gap-1.5">
        <ArrowClockwise className="hover:text-accent cursor-pointer" onClick={reloadPreview} />
        <div
          className="flex items-center gap-1 flex-grow border text-accent rounded-full px-3 py-1 text-sm hover:bg-secondary hover:focus-within:bg-secondary focus-within:bg-muted-foreground
        focus-within-border-primary focus-within:text-foreground"
        >
          <input
            ref={inputRef}
            className="w-full bg-transparent outline-none"
            type="text"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && validateUrl(url)) {
                setIframeUrl(url);

                if (inputRef.current) {
                  inputRef.current.blur();
                }
              }
            }}
          />
        </div>
        
        <div className="relative">
          <button
            className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-white/10 rounded"
            onClick={() => setIsViewportDropdownOpen(!isViewportDropdownOpen)}
          >
            {selectedViewport.icon}
            <span className="hidden sm:inline">{selectedViewport.name}</span>
            <CaretDown className="w-3 h-3" />
          </button>
          
          {isViewportDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-zinc-800 rounded-lg shadow-xl z-50 py-1 min-w-[140px]">
              {VIEWPORT_SIZES.map((viewport) => (
                <button
                  key={viewport.name}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10',
                    selectedViewport.name === viewport.name && 'text-accent',
                  )}
                  onClick={() => handleViewportChange(viewport)}
                >
                  {viewport.icon}
                  {viewport.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedViewport.width > 0 && (
          <button
            className="p-1 hover:bg-white/10 rounded text-sm"
            onClick={toggleOrientation}
            title={isLandscape ? 'Portrait' : 'Landscape'}
          >
            <ArrowsOut className={cn(isLandscape && 'rotate-90')} />
          </button>
        )}

        {previews.length > 1 && (
          <PortDropdown
            activePreviewIndex={activePreviewIndex}
            setActivePreviewIndex={setActivePreviewIndex}
            isDropdownOpen={isPortDropdownOpen}
            setHasSelectedPreview={(value) => (hasSelectedPreview.current = value)}
            setIsDropdownOpen={setIsPortDropdownOpen}
            previews={previews}
          />
        )}
      </div>
      <div ref={containerRef} className="flex-1 border-t border-white/10 overflow-auto p-4 bg-zinc-900">
        {activePreview ? (
          renderDeviceFrame()
        ) : (
          <div className="flex w-full h-full justify-center items-center bg-white">No preview available</div>
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
