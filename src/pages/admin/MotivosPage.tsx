import { useState } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Warning, Add, Delete, ChevronLeft } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AdminSidebar } from '@/components/AdminSidebar';
import { useMotivos, useCreateMotivo, useDeleteMotivo } from '@/hooks/useInventoryData';
import { validateAndSanitizeName } from '@/lib/sanitize';

const MotivosPage = () => {
  const [newMotivo, setNewMotivo] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [motivoToDelete, setMotivoToDelete] = useState<{ id: number; nome: string } | null>(null);

  const { data: motivos, isLoading: loadingMotivos } = useMotivos();
  const createMotivo = useCreateMotivo();
  const deleteMotivo = useDeleteMotivo();

  // Sidebar colapsada por padrão em telas grandes (lg-xl = 1024px+)
  const [defaultSidebarOpen, setDefaultSidebarOpen] = useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setDefaultSidebarOpen(!isLargeScreen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleAddMotivo = () => {
    const sanitized = validateAndSanitizeName(newMotivo);
    if (sanitized) {
      createMotivo.mutate(sanitized, {
        onSuccess: () => {
          setNewMotivo('');
        },
      });
    }
  };

  const handleDeleteClick = (motivo: { id: number; nome: string }) => {
    setMotivoToDelete(motivo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (motivoToDelete) {
      deleteMotivo.mutate(motivoToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setMotivoToDelete(null);
        },
      });
    }
  };

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen ?? false}>
      <AdminSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-6 w-[1px] bg-border mr-2" />
              <div>
                <h1 className="text-lg font-semibold leading-none">Gerenciar Motivos</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* Statistics Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Motivos Cadastrados
              </CardTitle>
              <Warning className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loadingMotivos ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{motivos?.length || 0}</div>
              )}
            </CardContent>
          </Card>

          {/* Add Motivo Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Add className="h-4 w-4" />
                Adicionar Novo Motivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do motivo..."
                  value={newMotivo}
                  onChange={(e) => setNewMotivo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMotivo()}
                  className="flex-1"
                  disabled={createMotivo.isPending}
                />
                <Button
                  onClick={handleAddMotivo}
                  disabled={createMotivo.isPending || !newMotivo.trim()}
                >
                  {createMotivo.isPending ? (
                    <CircularProgress size={16} sx={{ color: 'currentColor' }} />
                  ) : (
                    <>
                      <Add className="h-4 w-4 mr-2" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Motivos List Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Warning className="h-4 w-4" />
                Lista de Motivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMotivos ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : motivos?.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  Nenhum motivo cadastrado. Adicione um novo motivo acima.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {motivos?.map((motivo) => (
                        <TableRow key={motivo.id}>
                          <TableCell className="font-medium">{motivo.nome}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(motivo)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={deleteMotivo.isPending}
                            >
                              <Delete className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover o motivo <strong>{motivoToDelete?.nome}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMotivo.isPending}
              >
                {deleteMotivo.isPending ? (
                  <CircularProgress size={16} sx={{ color: 'currentColor' }} />
                ) : (
                  'Excluir'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MotivosPage;
