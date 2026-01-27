import * as React from 'react';
import { UnfoldMore, Search } from '@mui/icons-material';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

interface TecidoStockSearchProps {
  tecidos: { id: number; nome: string }[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const TecidoStockSearch = React.memo(function TecidoStockSearch({ 
  tecidos, 
  value, 
  onChange, 
  isLoading 
}: TecidoStockSearchProps) {
  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return <Skeleton className="h-12 w-full rounded-xl" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Buscar tecido para consultar estoque"
          className={cn(
            'h-12 w-full justify-between rounded-xl border-2 px-4 text-sm font-medium',
            'transition-all duration-200 active:scale-[0.98]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
            'touch-manipulation',
            !value && 'text-muted-foreground'
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0 opacity-60" />
            <span className="truncate">{value || 'Buscar tecido...'}</span>
          </div>
          <UnfoldMore className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Buscar tecido..." 
            className="h-12 text-sm" 
          />
          <CommandList>
            <CommandEmpty>Nenhum tecido encontrado.</CommandEmpty>
            <CommandGroup>
              {tecidos?.map((tecido) => (
                <CommandItem
                  key={tecido.id}
                  value={tecido.nome}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className="h-12 text-sm min-h-[48px] touch-manipulation"
                >
                  {tecido.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
