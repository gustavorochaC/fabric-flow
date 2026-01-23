import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  ChevronLeft,
  Package,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  useMovimentacoes,
  useTodaySummary,
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

function ManageListDialog({
  title,
  items,
  isLoading,
  onCreate,
  onDelete,
  isCreating,
}: {
  title: string;
  items: { id: number; nome: string }[] | undefined;
  isLoading: boolean;
  onCreate: (nome: string) => void;
  onDelete: (id: number) => void;
  isCreating: boolean;
}) {
  const [newItem, setNewItem] = useState('');

  const handleCreate = () => {
    if (newItem.trim()) {
      onCreate(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Gerenciar
        </Button>
      </DialogTrigger>
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
              <Plus className="h-4 w-4" />
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
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="secondary">Fechar</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const AdminPage = () => {
  const [filters, setFilters] = useState<{
    tecido?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const { data: summary, isLoading: loadingSummary } = useTodaySummary();
  const { data: movimentacoes, isLoading: loadingMovimentacoes } = useMovimentacoes(filters);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">Gestão de Estoque</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Entradas (Hoje)
              </CardTitle>
              <ArrowDownToLine className="h-5 w-5 text-entrada" />
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-3xl font-bold text-entrada">{summary?.entradas || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Saídas (Hoje)
              </CardTitle>
              <ArrowUpFromLine className="h-5 w-5 text-saida" />
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-3xl font-bold text-saida">{summary?.saidas || 0}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciar Opções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tecidos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tecidos">Tecidos</TabsTrigger>
                <TabsTrigger value="operadores">Operadores</TabsTrigger>
                <TabsTrigger value="motivos">Motivos</TabsTrigger>
              </TabsList>
              <TabsContent value="tecidos" className="mt-4">
                <ManageListDialog
                  title="Tecidos"
                  items={tecidos}
                  isLoading={loadingTecidos}
                  onCreate={(nome) => createTecido.mutate(nome)}
                  onDelete={(id) => deleteTecido.mutate(id)}
                  isCreating={createTecido.isPending}
                />
              </TabsContent>
              <TabsContent value="operadores" className="mt-4">
                <ManageListDialog
                  title="Operadores"
                  items={operadores}
                  isLoading={loadingOperadores}
                  onCreate={(nome) => createOperador.mutate(nome)}
                  onDelete={(id) => deleteOperador.mutate(id)}
                  isCreating={createOperador.isPending}
                />
              </TabsContent>
              <TabsContent value="motivos" className="mt-4">
                <ManageListDialog
                  title="Motivos"
                  items={motivos}
                  isLoading={loadingMotivos}
                  onCreate={(nome) => createMotivo.mutate(nome)}
                  onDelete={(id) => deleteMotivo.mutate(id)}
                  isCreating={createMotivo.isPending}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground">Tecido</label>
                <Select
                  value={filters.tecido || 'all'}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      tecido: value === 'all' ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
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
                <label className="text-sm font-medium text-muted-foreground">Data Início</label>
                <Input
                  type="date"
                  className="mt-1"
                  value={filters.dateFrom || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateFrom: e.target.value || undefined }))
                  }
                />
              </div>
              <div className="min-w-[150px]">
                <label className="text-sm font-medium text-muted-foreground">Data Fim</label>
                <Input
                  type="date"
                  className="mt-1"
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

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMovimentacoes ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : movimentacoes?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma movimentação encontrada.
              </p>
            ) : (
              <div className="overflow-x-auto">
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
                        <TableCell className="whitespace-nowrap font-mono text-sm">
                          {formatDate(mov.created_at)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              'font-medium',
                              mov.tipo_movimentacao === 'Entrada'
                                ? 'bg-entrada text-entrada-foreground'
                                : 'bg-saida text-saida-foreground'
                            )}
                          >
                            {mov.tipo_movimentacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{mov.tecido}</TableCell>
                        <TableCell className="text-right font-bold">{mov.quantidade}</TableCell>
                        <TableCell>{mov.motivo}</TableCell>
                        <TableCell>{mov.operador}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;
