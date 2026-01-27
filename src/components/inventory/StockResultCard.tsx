import { Inventory, Close } from '@mui/icons-material';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StockResultCardProps {
  tecido: string;
  quantidade: number | undefined;
  isLoading?: boolean;
  onClear: () => void;
}

export function StockResultCard({ tecido, quantidade, isLoading, onClear }: StockResultCardProps) {
  if (isLoading) {
    return (
      <Card className="border-2">
        <CardContent className="p-4">
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (quantidade === undefined) {
    return null;
  }

  const isPositive = quantidade > 0;
  const isNegative = quantidade < 0;
  const isZero = quantidade === 0;

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-200',
        isPositive && 'border-green-200 bg-green-50/50',
        isNegative && 'border-red-200 bg-red-50/50',
        isZero && 'border-yellow-200 bg-yellow-50/50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              isPositive && 'bg-green-100 text-green-700',
              isNegative && 'bg-red-100 text-red-700',
              isZero && 'bg-yellow-100 text-yellow-700'
            )}>
              <Inventory className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {tecido}
              </div>
              <div className={cn(
                'text-lg font-bold',
                isPositive && 'text-green-700',
                isNegative && 'text-red-700',
                isZero && 'text-yellow-700'
              )}>
                Quantidade Total: {quantidade}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 shrink-0"
            aria-label="Limpar consulta"
          >
            <Close className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
