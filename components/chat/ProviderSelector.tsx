import React from 'react';
import { useStore } from '@nanostores/react';
import {
  providerStore,
  setProvider,
  type Provider,
  ProviderType,
  anthropicModels,
  googleModels,
  ollamaModels,
} from '@/lib/stores/provider';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';

export function ProviderSelector() {
  const currentProvider = useStore(providerStore);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = React.useState(false);

  const handleProviderChange = (value: Provider) => {
    setProvider(value);
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsProviderMenuOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex justify-between p-1.5 ml-2 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center max-w-[180px] truncate text-sm text-foreground/90">
            <span className="text-primary mr-2">●</span>
            {currentProvider.model.displayName}
          </div>
          {isProviderMenuOpen ? (
            <ChevronUpIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border/30 w-[280px] max-h-[50vh] overflow-y-auto">
        <DropdownMenuRadioGroup
          value={JSON.stringify(currentProvider)}
          onValueChange={(value) => handleProviderChange(JSON.parse(value))}
        >
          <div className="px-2 py-2">
            <DropdownMenuLabel className='px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium'>
              Anthropic
            </DropdownMenuLabel>
            {anthropicModels.map((model) => (
              <DropdownMenuRadioItem
                key={model.id}
                value={JSON.stringify({ type: ProviderType.ANTHROPIC, model })}
                className="text-sm py-1.5 cursor-pointer focus:bg-secondary/50 focus:text-foreground rounded-md"
              >
                {model.displayName}
              </DropdownMenuRadioItem>
            ))}
          </div>
          
          <div className="px-2 py-2 border-t border-border/20">
            <DropdownMenuLabel className='px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium'>
              Google
            </DropdownMenuLabel>
            {googleModels.map((model) => (
              <DropdownMenuRadioItem
                key={model.id}
                value={JSON.stringify({ type: ProviderType.GOOGLE, model })}
                className="text-sm py-1.5 cursor-pointer focus:bg-secondary/50 focus:text-foreground rounded-md"
              >
                {model.displayName}
              </DropdownMenuRadioItem>
            ))}
          </div>
          
          <div className="px-2 py-2 border-t border-border/20">
            <DropdownMenuLabel className='px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium'>
              Ollama
            </DropdownMenuLabel>
            {ollamaModels.map((model) => (
              <DropdownMenuRadioItem
                key={model.id}
                value={JSON.stringify({ type: ProviderType.OLLAMA, model })}
                className="text-sm py-1.5 cursor-pointer focus:bg-secondary/50 focus:text-foreground rounded-md"
              >
                {model.displayName}
              </DropdownMenuRadioItem>
            ))}
          </div>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
