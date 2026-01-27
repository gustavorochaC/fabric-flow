import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Tecido {
  id: number;
  nome: string;
}

export interface Operador {
  id: number;
  nome: string;
}

export interface Motivo {
  id: number;
  nome: string;
}

export interface Movimentacao {
  id: string;
  created_at: string;
  tipo_movimentacao: string;
  tecido: string;
  quantidade: number;
  motivo: string;
  operador: string;
}

export interface MovimentacaoInsert {
  tipo_movimentacao: string;
  tecido: string;
  quantidade: number;
  motivo: string;
  operador: string;
}

export interface TecidoSummary {
  tecido: string;
  quantidade: number;
}

// Fetch lists
export function useTecidos() {
  return useQuery({
    queryKey: ['tecidos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('est_tecidos')
        .select('*')
        .order('nome');
      
      if (error) {
        // Melhorar mensagem de erro para casos comuns
        if (error.message?.includes('fetch') || error.message?.includes('network') || error.code === 'PGRST116') {
          const configError = new Error(
            'Não foi possível conectar ao Supabase. Verifique se as variáveis de ambiente estão configuradas no arquivo .env.local'
          );
          configError.name = 'SupabaseConfigError';
          throw configError;
        }
        
        throw error;
      }
      
      return data as Tecido[];
    },
  });
}

export function useOperadores() {
  return useQuery({
    queryKey: ['operadores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('est_operadores')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data as Operador[];
    },
  });
}

export function useMotivos() {
  return useQuery({
    queryKey: ['motivos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('est_motivos')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data as Motivo[];
    },
  });
}

// Movimentações
export function useMovimentacoes(filters?: { tecido?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ['movimentacoes', filters],
    queryFn: async () => {
      let query = supabase
        .from('est_movimentacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.tecido) {
        query = query.eq('tecido', filters.tecido);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo + 'T23:59:59');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Movimentacao[];
    },
  });
}

export function useTodaySummary() {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['summary', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('est_movimentacoes')
        .select('tipo_movimentacao, quantidade')
        .gte('created_at', today + 'T00:00:00')
        .lte('created_at', today + 'T23:59:59');

      if (error) throw error;

      const typedData = data as { tipo_movimentacao: string; quantidade: number }[];
      
      const entradas = typedData
        ?.filter(m => m.tipo_movimentacao === 'Entrada')
        .reduce((sum, m) => sum + m.quantidade, 0) || 0;
      
      const saidas = typedData
        ?.filter(m => m.tipo_movimentacao === 'Saída')
        .reduce((sum, m) => sum + m.quantidade, 0) || 0;

      return { entradas, saidas };
    },
  });
}

export function useTecidosSummary(filters?: { tecido?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ['tecidos-summary', filters],
    queryFn: async () => {
      let query = supabase
        .from('est_movimentacoes')
        .select('tecido, tipo_movimentacao, quantidade');

      if (filters?.tecido) {
        query = query.eq('tecido', filters.tecido);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo + 'T23:59:59');
      }

      const { data, error } = await query;
      if (error) throw error;

      const typedData = data as { tecido: string; tipo_movimentacao: string; quantidade: number }[];
      
      // Agrupar por tecido e calcular total (entradas - saídas)
      const summary = typedData.reduce((acc, mov) => {
        const tecido = mov.tecido;
        if (!acc[tecido]) {
          acc[tecido] = 0;
        }
        if (mov.tipo_movimentacao === 'Entrada') {
          acc[tecido] += mov.quantidade;
        } else {
          acc[tecido] -= mov.quantidade;
        }
        return acc;
      }, {} as Record<string, number>);

      // Converter para array e ordenar por quantidade (maior primeiro)
      const result: TecidoSummary[] = Object.entries(summary)
        .map(([tecido, quantidade]) => ({ tecido, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade);

      return result;
    },
  });
}

export function useCreateMovimentacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movimentacao: MovimentacaoInsert) => {
      const { data, error } = await supabase
        .from('est_movimentacoes')
        .insert([movimentacao])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success('Salvo com sucesso!', {
        description: 'Movimentação registrada.',
      });
    },
    onError: (error) => {
      toast.error('Erro ao salvar', {
        description: error.message,
      });
    },
  });
}

// CRUD for lists
export function useCreateTecido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string) => {
      const { error } = await supabase.from('est_tecidos').insert([{ nome }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecidos'] });
      toast.success('Tecido adicionado!');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteTecido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('est_tecidos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecidos'] });
      toast.success('Tecido removido!');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCreateOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string) => {
      const { error } = await supabase.from('est_operadores').insert([{ nome }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadores'] });
      toast.success('Operador adicionado!');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('est_operadores').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadores'] });
      toast.success('Operador removido!');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCreateMotivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string) => {
      const { error } = await supabase.from('est_motivos').insert([{ nome }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivos'] });
      toast.success('Motivo adicionado!');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteMotivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('est_motivos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivos'] });
      toast.success('Motivo removido!');
    },
    onError: (error) => toast.error(error.message),
  });
}
