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
    <div className="min-h-dvh bg-background pb-24 safe-area-inset-bottom">
      <div className="mx-auto max-w-md px-4 py-6">
        {/* Header - Mobile Optimized */}
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-md">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground leading-tight">Gestão de Estoque</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Registro de Movimentação</p>
          </div>
        </header>

        <form id="movement-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Action Toggle - Mobile Optimized */}
          <ActionToggle value={tipoMovimentacao} onChange={setTipoMovimentacao} />

          {/* Form Card - Mobile Optimized */}
          <Card className={cn('border-2 transition-all duration-200 shadow-lg', borderColor)}>
            <CardContent className="space-y-5 p-6">
              {/* Tecido */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-foreground block">
                  Tecido
                </label>
                <TecidoCombobox
                  tecidos={tecidos || []}
                  value={tecido}
                  onChange={setTecido}
                  isLoading={loadingTecidos}
                />
              </div>

              {/* Quantidade */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-foreground block">
                  Quantidade
                </label>
                <QuantityStepper value={quantidade} onChange={setQuantidade} />
              </div>

              {/* Motivo */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-foreground block">
                  Motivo
                </label>
                <MotivoChips
                  motivos={motivos || []}
                  value={motivo}
                  onChange={setMotivo}
                  isLoading={loadingMotivos}
                />
              </div>

              {/* Operador */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-foreground block">
                  Operador
                </label>
                <OperadorSelect
                  operadores={operadores || []}
                  value={operador}
                  onChange={setOperador}
                  isLoading={loadingOperadores}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Submit Button - Fixed at bottom with safe area */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur-sm shadow-2xl safe-area-inset-bottom">
        <div className="mx-auto max-w-md px-4 py-3">
          <Button
            type="submit"
            form="movement-form"
            disabled={!isFormValid || createMovimentacao.isPending}
            className={cn(
              'h-14 w-full rounded-2xl text-lg font-bold uppercase tracking-wide',
              'transition-all duration-200 active:scale-[0.97] shadow-lg',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              tipoMovimentacao === 'Entrada'
                ? 'bg-entrada hover:bg-entrada/90 focus-visible:ring-entrada'
                : 'bg-saida hover:bg-saida/90 focus-visible:ring-saida',
              (!isFormValid || createMovimentacao.isPending) && 'opacity-60 cursor-not-allowed'
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
      </div>
    </div>
  );
};

export default Index;
