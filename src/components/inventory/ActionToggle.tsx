import { cn } from '@/lib/utils';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

type MovementType = 'Entrada' | 'Saída';

interface ActionToggleProps {
  value: MovementType;
  onChange: (value: MovementType) => void;
}

export function ActionToggle({ value, onChange }: ActionToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange('Entrada')}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
          'min-h-[80px] text-lg font-bold uppercase tracking-wide',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          value === 'Entrada'
            ? 'border-entrada bg-entrada text-entrada-foreground shadow-lg scale-[1.02]'
            : 'border-border bg-card text-muted-foreground hover:border-entrada/50 hover:bg-entrada/5'
        )}
      >
        <ArrowDownToLine className="h-7 w-7" />
        <span>Entrada</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('Saída')}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
          'min-h-[80px] text-lg font-bold uppercase tracking-wide',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          value === 'Saída'
            ? 'border-saida bg-saida text-saida-foreground shadow-lg scale-[1.02]'
            : 'border-border bg-card text-muted-foreground hover:border-saida/50 hover:bg-saida/5'
        )}
      >
        <ArrowUpFromLine className="h-7 w-7" />
        <span>Saída</span>
      </button>
    </div>
  );
}
