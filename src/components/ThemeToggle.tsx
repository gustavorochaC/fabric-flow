/**
 * Theme Toggle Component
 * 
 * Botão para alternar entre modo claro e escuro.
 * Usa ícones do Material UI Icons.
 * Projetado para uso na sidebar.
 */

import { LightMode, DarkMode } from "@mui/icons-material";
import { useTheme } from "./theme-provider";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <LightMode className="size-4" />
        ) : (
          <DarkMode className="size-4" />
        )}
        <span className="text-base">
          {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
