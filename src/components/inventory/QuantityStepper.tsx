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
    <div className="flex items-center justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(
          'h-14 w-14 rounded-xl border-2 text-2xl font-bold',
          'transition-all active:scale-95',
          'disabled:opacity-40'
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
        className={cn(
          'h-16 w-28 text-center text-3xl font-bold',
          'rounded-xl border-2 bg-card',
          'focus:border-primary focus:ring-primary'
        )}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(
          'h-14 w-14 rounded-xl border-2 text-2xl font-bold',
          'transition-all active:scale-95',
          'disabled:opacity-40'
        )}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
