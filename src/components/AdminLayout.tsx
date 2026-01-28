/**
 * Admin Layout Component
 * 
 * Wrapper para páginas admin que inclui o ThemeProvider.
 * Isso garante que o modo noturno funcione apenas nas páginas admin,
 * não afetando a página principal.
 */

import { ReactNode, useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme-provider";

function AdminContainer({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const container = document.getElementById("admin-container");
    if (container) {
      container.classList.remove("light", "dark");
      container.classList.add(theme);
    }
  }, [theme]);

  return (
    <div id="admin-container" className={theme}>
      {children}
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AdminContainer>
        {children}
      </AdminContainer>
    </ThemeProvider>
  );
}
