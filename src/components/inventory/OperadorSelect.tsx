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
    return <Skeleton className="h-14 w-full rounded-xl" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'h-14 w-full rounded-xl border-2 px-4 text-base',
          !value && 'text-muted-foreground'
        )}
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 shrink-0 opacity-50" />
          <SelectValue placeholder="Selecione o operador..." />
        </div>
      </SelectTrigger>
      <SelectContent>
        {operadores?.map((op) => (
          <SelectItem key={op.id} value={op.nome} className="h-12 text-base">
            {op.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
