import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inventory, CheckCircle, AdminPanelSettings } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AdminLoginDialog } from '@/components/AdminLoginDialog';

import { ActionToggle } from '@/components/inventory/ActionToggle';
import { TecidoCombobox } from '@/components/inventory/TecidoCombobox';
import { QuantityStepper } from '@/components/inventory/QuantityStepper';
import { MotivoChips } from '@/components/inventory/MotivoChips';
import { OperadorSelect } from '@/components/inventory/OperadorSelect';
import { TecidoStockSearch } from '@/components/inventory/TecidoStockSearch';
import { StockResultCard } from '@/components/inventory/StockResultCard';

import {
  useTecidos,
  useOperadores,
  useMotivos,
  useCreateMovimentacao,
  useTecidoStock,
} from '@/hooks/useInventoryData';
import { validateNonEmptyString, validateQuantity } from '@/lib/sanitize';

type MovementType = 'Entrada' | 'Saída';

const Index = () => {
  const [tipoMovimentacao, setTipoMovimentacao] = useState<MovementType>('Entrada');
  const [tecido, setTecido] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [operador, setOperador] = useState('');
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [stockSearchTecido, setStockSearchTecido] = useState<string>('');

  const { toast } = useToast();
  const { data: tecidos, isLoading: loadingTecidos } = useTecidos();
  const { data: operadores, isLoading: loadingOperadores } = useOperadores();
  const { data: motivos, isLoading: loadingMotivos } = useMotivos();
  const createMovimentacao = useCreateMovimentacao();
  
  // Consulta de estoque
  const { data: stockData, isLoading: loadingStock } = useTecidoStock(
    stockSearchTecido,
    !!stockSearchTecido
  );

  const isFormValid = useMemo(
    () => tecido && quantidade > 0 && motivo && operador,
    [tecido, quantidade, motivo, operador]
  );

  const resetForm = useCallback(() => {
    setTecido('');
    setQuantidade(1);
    setMotivo('');
    setOperador('');
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
        toast({
          title: 'Formulário incompleto',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }

      // Sanitizar e validar dados antes de enviar
      const sanitizedTecido = validateNonEmptyString(tecido, 100);
      const sanitizedMotivo = validateNonEmptyString(motivo, 100);
      const sanitizedOperador = validateNonEmptyString(operador, 100);
      const validatedQuantity = validateQuantity(quantidade);

      if (!sanitizedTecido || !sanitizedMotivo || !sanitizedOperador || !validatedQuantity) {
        toast({
          title: 'Dados inválidos',
          description: 'Por favor, verifique os dados informados.',
          variant: 'destructive',
        });
        return;
      }

      createMovimentacao.mutate(
        {
          tipo_movimentacao: tipoMovimentacao,
          tecido: sanitizedTecido,
          quantidade: validatedQuantity,
          motivo: sanitizedMotivo,
          operador: sanitizedOperador,
        },
        {
          onSuccess: () => {
            resetForm();
            toast({
              title: 'Movimentação registrada!',
              description: `${tipoMovimentacao} de ${quantidade} unidade(s) de ${tecido} registrada com sucesso.`,
              duration: 4000,
            });
          },
          onError: (error: Error) => {
            toast({
              title: 'Erro ao registrar',
              description: error.message || 'Não foi possível registrar a movimentação. Tente novamente.',
              variant: 'destructive',
              duration: 5000,
            });
          },
        }
      );
    },
    [isFormValid, tipoMovimentacao, tecido, quantidade, motivo, operador, createMovimentacao, resetForm, toast]
  );

  const borderColor = useMemo(
    () => (tipoMovimentacao === 'Entrada' ? 'border-entrada' : 'border-saida'),
    [tipoMovimentacao]
  );

  const handleTipoChange = useCallback((value: MovementType) => {
    setTipoMovimentacao(value);
  }, []);

  return (
    <div className="min-h-dvh bg-background pb-24 safe-area-inset-bottom">
      <div className="mx-auto max-w-md px-4 py-6">
        {/* Header - Mobile Optimized */}
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-md">
            <Inventory className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground leading-tight">Gestão de Estoque</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Registro de Movimentação</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => setIsAdminDialogOpen(true)}
            aria-label="Acessar painel administrativo"
            title="Acessar painel administrativo"
          >
            <AdminPanelSettings className="h-5 w-5" />
          </Button>
        </header>

        <form 
          id="movement-form" 
          onSubmit={handleSubmit} 
          className="space-y-5"
          aria-label="Formulário de registro de movimentação de estoque"
        >
          {/* Action Toggle - Mobile Optimized */}
          <ActionToggle value={tipoMovimentacao} onChange={handleTipoChange} />

          {/* Form Card - Mobile Optimized */}
          <Card className={cn('border-2 transition-all duration-200 shadow-lg', borderColor)}>
            <CardContent className="space-y-5 p-6">
              {/* Tecido */}
              <div className="space-y-3" role="group" aria-labelledby="tecido-label">
                <label 
                  id="tecido-label"
                  htmlFor="tecido-combobox"
                  className="text-base font-semibold text-foreground block"
                >
                  Tecido <span className="text-destructive" aria-label="obrigatório">*</span>
                </label>
                <TecidoCombobox
                  tecidos={tecidos || []}
                  value={tecido}
                  onChange={setTecido}
                  isLoading={loadingTecidos}
                />
              </div>

              {/* Quantidade */}
              <div className="space-y-3" role="group" aria-labelledby="quantidade-label">
                <label 
                  id="quantidade-label"
                  htmlFor="quantidade-input"
                  className="text-base font-semibold text-foreground block"
                >
                  Quantidade <span className="text-destructive" aria-label="obrigatório">*</span>
                </label>
                <QuantityStepper value={quantidade} onChange={setQuantidade} />
              </div>

              {/* Motivo */}
              <div className="space-y-3" role="group" aria-labelledby="motivo-label">
                <label 
                  id="motivo-label"
                  className="text-base font-semibold text-foreground block"
                >
                  Motivo <span className="text-destructive" aria-label="obrigatório">*</span>
                </label>
                <MotivoChips
                  motivos={motivos || []}
                  value={motivo}
                  onChange={setMotivo}
                  isLoading={loadingMotivos}
                />
              </div>

              {/* Operador */}
              <div className="space-y-3" role="group" aria-labelledby="operador-label">
                <label 
                  id="operador-label"
                  htmlFor="operador-select"
                  className="text-base font-semibold text-foreground block"
                >
                  Operador <span className="text-destructive" aria-label="obrigatório">*</span>
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

          {/* Consulta de Estoque - Card Separado */}
          <Card className="border-2 transition-all duration-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Consultar Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TecidoStockSearch
                tecidos={tecidos || []}
                value={stockSearchTecido}
                onChange={setStockSearchTecido}
                isLoading={loadingTecidos}
              />
              {stockSearchTecido && (
                <StockResultCard
                  tecido={stockData?.tecido || stockSearchTecido}
                  quantidade={stockData?.quantidade}
                  isLoading={loadingStock}
                  onClear={() => setStockSearchTecido('')}
                />
              )}
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
                <CircularProgress size={20} className="mr-2" sx={{ color: 'currentColor' }} aria-hidden="true" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                <span>Confirmar Registro</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Admin Login Dialog */}
      <AdminLoginDialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen} />
    </div>
  );
};

export default Index;
