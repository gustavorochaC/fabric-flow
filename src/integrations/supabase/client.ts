import { createClient } from '@supabase/supabase-js';

// Validar variáveis de ambiente obrigatórias
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criar cliente Supabase mesmo sem variáveis (para desenvolvimento)
// Em produção, as variáveis devem estar configuradas
// Se não estiverem, as queries falharão mas a aplicação não quebra
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey) {
  // Mostrar erro mais visível no console
  console.error(
    '❌ ERRO: Variáveis de ambiente do Supabase não configuradas!\n\n' +
    'Para corrigir:\n' +
    '1. Crie um arquivo .env.local na raiz do projeto\n' +
    '2. Adicione as seguintes linhas:\n' +
    '   VITE_SUPABASE_URL=sua_url_aqui\n' +
    '   VITE_SUPABASE_ANON_KEY=sua_chave_aqui\n' +
    '3. Reinicie o servidor de desenvolvimento (npm run dev)\n\n' +
    'Você pode encontrar essas informações em:\n' +
    'Supabase Dashboard > Settings > API'
  );
  
  // Não usar placeholder - isso causa requisições falhadas
  // Em vez disso, vamos usar valores vazios que gerarão erro claro
  supabase = createClient(
    supabaseUrl || 'https://missing-config.supabase.co',
    supabaseAnonKey || 'missing-key'
  );
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
