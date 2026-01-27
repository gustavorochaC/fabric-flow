
import { useState } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowDownward,
  ArrowUpward,
  CalendarToday,
  ChevronLeft,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AdminSidebar } from '@/components/AdminSidebar';
import { ManageListDialog } from '@/components/inventory/ManageListDialog';

import {
  useMovimentacoes,
  useTodaySummary,
  useTecidosSummary,
  useTecidos,
  useOperadores,
  useMotivos,
  useCreateTecido,
  useDeleteTecido,
  useCreateOperador,
  useDeleteOperador,
  useCreateMotivo,
  useDeleteMotivo,
} from '@/hooks/useInventoryData';
import { cn } from '@/lib/utils';

const AdminPage = () => {
  const [filters, setFilters] = useState<{
    tecido?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const [manageDialog, setManageDialog] = useState<'tecidos' | 'operadores' | 'motivos' | null>(null);

  const { data: summary, isLoading: loadingSummary } = useTodaySummary();
  const { data: movimentacoes, isLoading: loadingMovimentacoes } = useMovimentacoes(filters);
  const { data: tecidosSummary, isLoading: loadingTecidosSummary } = useTecidosSummary(filters);
  const { data: tecidos, isLoading: loadingTecidos } = useTecidos();
  const { data: operadores, isLoading: loadingOperadores } = useOperadores();
  const { data: motivos, isLoading: loadingMotivos } = useMotivos();

  const createTecido = useCreateTecido();
  const deleteTecido = useDeleteTecido();
  const createOperador = useCreateOperador();
  const deleteOperador = useDeleteOperador();
  const createMotivo = useCreateMotivo();
  const deleteMotivo = useDeleteMotivo();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM HH:mm", { locale: ptBR });
  };

  // Sidebar colapsada por padrão em telas grandes (lg-xl = 1024px+)
  const [defaultSidebarOpen, setDefaultSidebarOpen] = useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkScreenSize = () => {
      // lg breakpoint = 1024px
      const isLargeScreen = window.innerWidth >= 1024;
      // Colapsada por padrão em telas grandes
      setDefaultSidebarOpen(!isLargeScreen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen ?? false}>
      <AdminSidebar 
        onManageTecidos={() => setManageDialog('tecidos')}
        onManageOperadores={() => setManageDialog('operadores')}
        onManageMotivos={() => setManageDialog('motivos')}
      />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-6 w-[1px] bg-border mr-2" />
              <div>
                <h1 className="text-lg font-semibold leading-none">Painel Administrativo</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Entradas (Hoje)
                </CardTitle>
                <ArrowDownward className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold text-green-600">{summary?.entradas || 0}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Saídas (Hoje)
                </CardTitle>
                <ArrowUpward className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold text-red-600">{summary?.saidas || 0}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FilterListIcon className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Tecido</label>
                  <Select
                    value={filters.tecido || 'all'}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        tecido: value === 'all' ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tecidos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tecidos</SelectItem>
                      {tecidos?.map((t) => (
                        <SelectItem key={t.id} value={t.nome}>
                          {t.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[150px]">
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Data Início</label>
                  <Input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, dateFrom: e.target.value || undefined }))
                    }
                  />
                </div>
                <div className="min-w-[150px]">
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Data Fim</label>
                  <Input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, dateTo: e.target.value || undefined }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({})}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tecidos Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <InventoryIcon className="h-4 w-4" />
                Quantidade Total por Tecido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTecidosSummary ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : tecidosSummary && tecidosSummary.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tecidosSummary.map((item) => (
                    <div
                      key={item.tecido}
                      className={cn(
                        'rounded-lg border p-4 transition-colors',
                        item.quantidade > 0
                          ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
                          : item.quantidade < 0
                            ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900'
                            : 'bg-card'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.tecido}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Quantidade total</p>
                        </div>
                        <Badge
                          variant={item.quantidade > 0 ? 'default' : item.quantidade < 0 ? 'destructive' : 'secondary'}
                          className={cn(
                            'text-base font-bold px-2.5 py-0.5',
                            item.quantidade > 0 && 'bg-green-600 hover:bg-green-700',
                            item.quantidade < 0 && 'bg-red-600 hover:bg-red-700'
                          )}
                        >
                          {item.quantidade > 0 ? '+' : ''}
                          {item.quantidade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  Nenhum tecido encontrado no histórico.
                </p>
              )}
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarToday className="h-4 w-4" />
                Histórico de Movimentações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMovimentacoes ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : movimentacoes?.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  Nenhuma movimentação encontrada.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Tecido</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Operador</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimentacoes?.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell className="whitespace-nowrap font-mono text-xs">
                            {formatDate(mov.created_at)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'font-medium',
                                mov.tipo_movimentacao === 'Entrada'
                                  ? 'border-green-200 text-green-700 bg-green-50'
                                  : 'border-red-200 text-red-700 bg-red-50'
                              )}
                            >
                              {mov.tipo_movimentacao}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-sm">{mov.tecido}</TableCell>
                          <TableCell className="text-right font-bold text-sm">{mov.quantidade}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{mov.motivo}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{mov.operador}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        
        {/* Management Dialogs */}
        <ManageListDialog
            title="Tecidos"
            items={tecidos}
            isLoading={loadingTecidos}
            onCreate={(nome) => createTecido.mutate(nome)}
            onDelete={(id) => deleteTecido.mutate(id)}
            isCreating={createTecido.isPending}
            open={manageDialog === 'tecidos'}
            onOpenChange={(open) => !open && setManageDialog(null)}
        />
        <ManageListDialog
            title="Operadores"
            items={operadores}
            isLoading={loadingOperadores}
            onCreate={(nome) => createOperador.mutate(nome)}
            onDelete={(id) => deleteOperador.mutate(id)}
            isCreating={createOperador.isPending}
            open={manageDialog === 'operadores'}
            onOpenChange={(open) => !open && setManageDialog(null)}
        />
        <ManageListDialog
            title="Motivos"
            items={motivos}
            isLoading={loadingMotivos}
            onCreate={(nome) => createMotivo.mutate(nome)}
            onDelete={(id) => deleteMotivo.mutate(id)}
            isCreating={createMotivo.isPending}
            open={manageDialog === 'motivos'}
            onOpenChange={(open) => !open && setManageDialog(null)}
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminPage;
