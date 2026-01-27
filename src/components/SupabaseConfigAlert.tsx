import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Warning } from '@mui/icons-material';

export function SupabaseConfigAlert() {
  const hasConfig = !!(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
    !import.meta.env.VITE_SUPABASE_URL.includes('missing-config')
  );

  if (hasConfig) {
    return null;
  }

  return (
    <Alert variant="destructive" className="m-4">
      <Warning className="h-4 w-4" />
      <AlertTitle>Configuração do Supabase Necessária</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          As variáveis de ambiente do Supabase não estão configuradas. 
          Por isso, os dados não estão sendo carregados.
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <p><strong>Para corrigir:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Crie um arquivo <code className="bg-muted px-1 rounded">.env.local</code> na raiz do projeto</li>
            <li>Adicione as seguintes linhas:</li>
          </ol>
          <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-x-auto">
{`VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui`}
          </pre>
          <p className="mt-2">
            Você pode encontrar essas informações em: <br />
            <strong>Supabase Dashboard → Settings → API</strong>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Após criar o arquivo, reinicie o servidor de desenvolvimento (Ctrl+C e depois npm run dev)
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
