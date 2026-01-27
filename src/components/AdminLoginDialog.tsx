import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (login(password)) {
      toast({
        title: 'Acesso autorizado',
        description: 'Redirecionando para o painel administrativo...',
      });
      setPassword('');
      onOpenChange(false);
      navigate('/admin');
    } else {
      setError(true);
      toast({
        title: 'Senha incorreta',
        description: 'Por favor, verifique a senha e tente novamente.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AdminPanelSettings className="h-5 w-5 text-primary" />
            <DialogTitle>Painel Administrador</DialogTitle>
          </div>
          <DialogDescription>
            Digite a senha para acessar o painel administrativo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Senha:
            </label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Digite a senha"
              className={error ? 'border-destructive' : ''}
              autoFocus
              aria-invalid={error}
              aria-describedby={error ? 'password-error' : undefined}
            />
            {error && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Entrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
