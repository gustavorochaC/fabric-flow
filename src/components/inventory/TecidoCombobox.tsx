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
    return <Skeleton className="h-14 w-full rounded-xl" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-14 w-full justify-between rounded-xl border-2 px-4 text-base',
            !value && 'text-muted-foreground'
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            {value || 'Selecione um tecido...'}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar tecido..." className="h-12" />
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
                  className="h-12 text-base"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
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
