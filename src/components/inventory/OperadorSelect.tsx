import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OperadorSelectProps {
  operadores: { id: number; nome: string }[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function OperadorSelect({ operadores, value, onChange, isLoading }: OperadorSelectProps) {
  if (isLoading) {
    return <Skeleton className="h-14 w-full rounded-2xl" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label="Selecionar operador"
        className={cn(
          'h-14 w-full rounded-2xl border-2 px-5 text-base font-medium',
          'transition-all duration-200 active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
          'touch-manipulation',
          !value && 'text-muted-foreground'
        )}
      >
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 shrink-0 opacity-60" />
          <SelectValue placeholder="Selecione o operador..." />
        </div>
      </SelectTrigger>
      <SelectContent>
        {operadores?.map((op) => (
          <SelectItem 
            key={op.id} 
            value={op.nome} 
            className="h-14 text-base min-h-[56px] touch-manipulation"
          >
            {op.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
