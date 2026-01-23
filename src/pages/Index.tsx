import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

import { ActionToggle } from '@/components/inventory/ActionToggle';
import { TecidoCombobox } from '@/components/inventory/TecidoCombobox';
import { QuantityStepper } from '@/components/inventory/QuantityStepper';
import { MotivoChips } from '@/components/inventory/MotivoChips';
import { OperadorSelect } from '@/components/inventory/OperadorSelect';

import {
  useTecidos,
  useOperadores,
  useMotivos,
  useCreateMovimentacao,
} from '@/hooks/useInventoryData';

type MovementType = 'Entrada' | 'Saída';

const Index = () => {
  const [tipoMovimentacao, setTipoMovimentacao] = useState<MovementType>('Entrada');
  const [tecido, setTecido] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [operador, setOperador] = useState('');

  const { data: tecidos, isLoading: loadingTecidos } = useTecidos();
  const { data: operadores, isLoading: loadingOperadores } = useOperadores();
  const { data: motivos, isLoading: loadingMotivos } = useMotivos();
  const createMovimentacao = useCreateMovimentacao();

  const isFormValid = tecido && quantidade > 0 && motivo && operador;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    createMovimentacao.mutate(
      {
        tipo_movimentacao: tipoMovimentacao,
        tecido,
        quantidade,
        motivo,
        operador,
      },
      {
        onSuccess: () => {
          // Reset form
          setTecido('');
          setQuantidade(1);
          setMotivo('');
          setOperador('');
        },
      }
    );
  };

  const borderColor = tipoMovimentacao === 'Entrada' ? 'border-entrada' : 'border-saida';

  return (
    <div className="min-h-screen bg-background p-4 pb-32">
      {/* Header */}
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Gestão de Estoque</h1>
          <p className="text-sm text-muted-foreground">Registro de Movimentação</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Action Toggle */}
        <ActionToggle value={tipoMovimentacao} onChange={setTipoMovimentacao} />

        {/* Form Card */}
        <Card className={cn('border-2 transition-colors duration-300', borderColor)}>
          <CardContent className="space-y-6 p-5">
            {/* Tecido */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tecido</label>
              <TecidoCombobox
                tecidos={tecidos || []}
                value={tecido}
                onChange={setTecido}
                isLoading={loadingTecidos}
              />
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantidade</label>
              <QuantityStepper value={quantidade} onChange={setQuantidade} />
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Motivo</label>
              <MotivoChips
                motivos={motivos || []}
                value={motivo}
                onChange={setMotivo}
                isLoading={loadingMotivos}
              />
            </div>

            {/* Operador */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Operador</label>
              <OperadorSelect
                operadores={operadores || []}
                value={operador}
                onChange={setOperador}
                isLoading={loadingOperadores}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button - Fixed at bottom on mobile */}
        <div className="fixed inset-x-0 bottom-0 border-t bg-background p-4 shadow-lg">
          <Button
            type="submit"
            disabled={!isFormValid || createMovimentacao.isPending}
            className={cn(
              'h-14 w-full rounded-xl text-lg font-bold uppercase tracking-wide',
              'transition-all active:scale-[0.98]',
              tipoMovimentacao === 'Entrada'
                ? 'bg-entrada hover:bg-entrada/90'
                : 'bg-saida hover:bg-saida/90'
            )}
          >
            {createMovimentacao.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Salvando...
              </>
            ) : (
              'Confirmar Registro'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Index;
