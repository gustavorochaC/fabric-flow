
import { useState } from 'react';
import { Add, Delete, Settings } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ManageListDialogProps {
  title: string;
  items: { id: number; nome: string }[] | undefined;
  isLoading: boolean;
  onCreate: (nome: string) => void;
  onDelete: (id: number) => void;
  isCreating: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageListDialog({
  title,
  items,
  isLoading,
  onCreate,
  onDelete,
  isCreating,
  open,
  onOpenChange,
}: ManageListDialogProps) {
  const [newItem, setNewItem] = useState('');

  const handleCreate = () => {
    if (newItem.trim()) {
      onCreate(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar {title}</DialogTitle>
          <DialogDescription>
            Adicione ou remova itens da lista de {title.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Novo ${title.toLowerCase()}...`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={isCreating || !newItem.trim()}>
              <Add className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : items?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum item cadastrado.
              </p>
            ) : (
              items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span>{item.nome}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Delete className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
