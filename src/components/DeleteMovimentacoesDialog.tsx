import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Delete, Warning } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDeleteMovimentacao, type Movimentacao } from '@/hooks/useInventoryData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DeleteMovimentacoesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movimentacoes: Movimentacao[];
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function DeleteMovimentacoesDialog({
  open,
  onOpenChange,
  movimentacoes,
  selectedIds,
  onSuccess,
}: DeleteMovimentacoesDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMovimentacao = useDeleteMovimentacao();

  const movimentacoesToDelete = movimentacoes.filter((mov) => selectedIds.has(mov.id));

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Deletar todas as movimentações selecionadas
      for (const mov of movimentacoesToDelete) {
        try {
          await deleteMovimentacao.mutateAsync(mov.id);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Erro ao excluir movimentação ${mov.id}:`, error);
        }
      }

      // Mostrar toast de resultado
      if (errorCount === 0) {
        toast.success('Movimentações excluídas', {
          description: `${successCount} movimentação(ões) excluída(s) com sucesso.`,
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('Exclusão parcial', {
          description: `${successCount} movimentação(ões) excluída(s). ${errorCount} erro(s) ocorreram.`,
        });
        onSuccess(); // Ainda invalida queries para atualizar dados
      }
    } catch (error) {
      toast.error('Erro ao excluir', {
        description: 'Ocorreu um erro ao excluir as movimentações. Tente novamente.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Warning className="h-5 w-5 text-destructive" />
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </div>
          <DialogDescription>
            Você está prestes a excluir <strong>{movimentacoesToDelete.length}</strong> movimentação(ões).
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto space-y-2 py-4">
          {movimentacoesToDelete.map((mov) => (
            <div
              key={mov.id}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-medium text-xs',
                      mov.tipo_movimentacao === 'Entrada'
                        ? 'border-green-200 text-green-700 bg-green-50'
                        : 'border-red-200 text-red-700 bg-red-50'
                    )}
                  >
                    {mov.tipo_movimentacao}
                  </Badge>
                  <span className="font-medium text-sm">{mov.tecido}</span>
                  <span className="text-sm text-muted-foreground">x{mov.quantidade}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(mov.created_at)} • {mov.operador} • {mov.motivo}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <span className="animate-spin">⏳</span>
                Excluindo...
              </>
            ) : (
              <>
                <Delete className="h-4 w-4" />
                Excluir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
