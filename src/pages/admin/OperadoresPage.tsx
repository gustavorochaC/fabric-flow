import { useState } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { People, Add, Delete, ChevronLeft } from '@mui/icons-material';
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
import { useOperadores, useCreateOperador, useDeleteOperador } from '@/hooks/useInventoryData';
import { validateAndSanitizeName } from '@/lib/sanitize';

const OperadoresPage = () => {
  const [newOperador, setNewOperador] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operadorToDelete, setOperadorToDelete] = useState<{ id: number; nome: string } | null>(null);

  const { data: operadores, isLoading: loadingOperadores } = useOperadores();
  const createOperador = useCreateOperador();
  const deleteOperador = useDeleteOperador();

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

  const handleAddOperador = () => {
    const sanitized = validateAndSanitizeName(newOperador);
    if (sanitized) {
      createOperador.mutate(sanitized, {
        onSuccess: () => {
          setNewOperador('');
        },
      });
    }
  };

  const handleDeleteClick = (operador: { id: number; nome: string }) => {
    setOperadorToDelete(operador);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (operadorToDelete) {
      deleteOperador.mutate(operadorToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setOperadorToDelete(null);
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
                <h1 className="text-lg font-semibold leading-none">Gerenciar Operadores</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* Statistics Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Operadores Cadastrados
              </CardTitle>
              <People className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loadingOperadores ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{operadores?.length || 0}</div>
              )}
            </CardContent>
          </Card>

          {/* Add Operador Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Add className="h-4 w-4" />
                Adicionar Novo Operador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do operador..."
                  value={newOperador}
                  onChange={(e) => setNewOperador(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOperador()}
                  className="flex-1"
                  disabled={createOperador.isPending}
                />
                <Button
                  onClick={handleAddOperador}
                  disabled={createOperador.isPending || !newOperador.trim()}
                >
                  {createOperador.isPending ? (
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

          {/* Operadores List Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <People className="h-4 w-4" />
                Lista de Operadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOperadores ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : operadores?.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  Nenhum operador cadastrado. Adicione um novo operador acima.
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
                      {operadores?.map((operador) => (
                        <TableRow key={operador.id}>
                          <TableCell className="font-medium">{operador.nome}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(operador)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={deleteOperador.isPending}
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
                Tem certeza que deseja remover o operador <strong>{operadorToDelete?.nome}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteOperador.isPending}
              >
                {deleteOperador.isPending ? (
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

export default OperadoresPage;
