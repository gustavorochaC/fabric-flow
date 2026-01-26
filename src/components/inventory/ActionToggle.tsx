import { cn } from '@/lib/utils';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

type MovementType = 'Entrada' | 'Saída';

interface ActionToggleProps {
  value: MovementType;
  onChange: (value: MovementType) => void;
}

export function ActionToggle({ value, onChange }: ActionToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onChange('Entrada')}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5',
          'min-h-[100px] text-lg font-bold uppercase tracking-wide',
          'transition-all duration-200 active:scale-[0.97]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-entrada',
          'touch-manipulation',
          value === 'Entrada'
            ? 'border-entrada bg-entrada text-entrada-foreground shadow-xl scale-[1.01]'
            : 'border-border bg-card text-muted-foreground active:bg-entrada/10'
        )}
        aria-label="Selecionar Entrada"
        aria-pressed={value === 'Entrada'}
      >
        <ArrowDownToLine className="h-8 w-8" />
        <span>Entrada</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('Saída')}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5',
          'min-h-[100px] text-lg font-bold uppercase tracking-wide',
          'transition-all duration-200 active:scale-[0.97]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-saida',
          'touch-manipulation',
          value === 'Saída'
            ? 'border-saida bg-saida text-saida-foreground shadow-xl scale-[1.01]'
            : 'border-border bg-card text-muted-foreground active:bg-saida/10'
        )}
        aria-label="Selecionar Saída"
        aria-pressed={value === 'Saída'}
      >
        <ArrowUpFromLine className="h-8 w-8" />
        <span>Saída</span>
      </button>
    </div>
  );
}
