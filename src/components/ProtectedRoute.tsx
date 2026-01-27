import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas administrativas
 * Verifica se o usuário está autenticado e redireciona para a página principal se não estiver
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // Verificar autenticação a cada renderização
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
