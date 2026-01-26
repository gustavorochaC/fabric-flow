import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
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

interface TecidoComboboxProps {
  tecidos: { id: number; nome: string }[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function TecidoCombobox({ tecidos, value, onChange, isLoading }: TecidoComboboxProps) {
  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return <Skeleton className="h-14 w-full rounded-2xl" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecionar tecido"
          className={cn(
            'h-14 w-full justify-between rounded-2xl border-2 px-5 text-base font-medium',
            'transition-all duration-200 active:scale-[0.98]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
            'touch-manipulation',
            !value && 'text-muted-foreground'
          )}
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 shrink-0 opacity-60" />
            <span className="truncate">{value || 'Selecione um tecido...'}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Buscar tecido..." 
            className="h-14 text-base" 
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
                  className="h-14 text-base min-h-[56px] touch-manipulation"
                >
                  <Check
                    className={cn(
                      'mr-3 h-5 w-5',
                      value === tecido.nome ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {tecido.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
