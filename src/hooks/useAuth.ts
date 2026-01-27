const ADMIN_PASSWORD = "heitor.flexi0809";
const AUTH_STORAGE_KEY = "admin_authenticated";

/**
 * Hook para gerenciar autenticação simples do painel administrativo
 * Usa sessionStorage para manter a sessão apenas durante a aba do navegador
 */
export function useAuth() {
  /**
   * Valida a senha e armazena autenticação no sessionStorage
   * @param password - Senha fornecida pelo usuário
   * @returns true se a senha estiver correta, false caso contrário
   */
  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      return true;
    }
    return false;
  };

  /**
   * Remove a autenticação do sessionStorage
   */
  const logout = (): void => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  /**
   * Verifica se o usuário está autenticado
   * @returns true se estiver autenticado, false caso contrário
   */
  const isAuthenticated = (): boolean => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  };

  return {
    login,
    logout,
    isAuthenticated,
  };
}
