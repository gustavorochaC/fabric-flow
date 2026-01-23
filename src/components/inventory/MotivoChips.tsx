import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MotivoChipsProps {
  motivos: { id: number; nome: string }[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function MotivoChips({ motivos, value, onChange, isLoading }: MotivoChipsProps) {
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
    <div className="flex flex-wrap gap-2">
      {motivos.map((motivo) => (
        <button
          key={motivo.id}
          type="button"
          onClick={() => onChange(motivo.nome)}
          className={cn(
            'rounded-full px-5 py-3 text-sm font-medium transition-all',
            'min-h-[48px] border-2',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            value === motivo.nome
              ? 'border-primary bg-primary text-primary-foreground shadow-md'
              : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent'
          )}
        >
          {motivo.nome}
        </button>
      ))}
    </div>
  );
}
