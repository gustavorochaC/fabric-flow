import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MotivoChipsProps {
  motivos: { id: number; nome: string }[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const MotivoChips = React.memo(function MotivoChips({ motivos, value, onChange, isLoading }: MotivoChipsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  if (!motivos?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum motivo cadastrado. Adicione no painel admin.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {motivos.map((motivo) => (
        <button
          key={motivo.id}
          type="button"
          onClick={() => onChange(motivo.nome)}
          aria-label={`Selecionar motivo: ${motivo.nome}`}
          aria-pressed={value === motivo.nome}
          className={cn(
            'rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-200',
            'min-h-[56px] min-w-[56px] border-2',
            'active:scale-[0.97] touch-manipulation',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
            value === motivo.nome
              ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]'
              : 'border-border bg-card text-foreground active:bg-accent'
          )}
        >
          {motivo.nome}
        </button>
      ))}
    </div>
  );
});
