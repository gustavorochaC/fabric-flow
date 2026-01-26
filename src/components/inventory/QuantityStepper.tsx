import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  step = 1,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className={cn(
          'h-14 w-14 min-h-[56px] min-w-[56px] rounded-2xl border-2',
          'transition-all duration-200 active:scale-[0.95]',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
          'touch-manipulation',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Minus className="h-6 w-6" />
      </Button>

      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        aria-label="Quantidade"
        className={cn(
          'h-16 w-32 text-center text-3xl font-bold',
          'rounded-2xl border-2 bg-card',
          'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary',
          'touch-manipulation'
        )}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className={cn(
          'h-14 w-14 min-h-[56px] min-w-[56px] rounded-2xl border-2',
          'transition-all duration-200 active:scale-[0.95]',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
          'touch-manipulation',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
