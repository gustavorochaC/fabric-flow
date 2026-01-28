/**
 * Admin Sidebar Component
 * 
 * Sidebar padrão seguindo a skill sidebar-standard.
 * Estrutura: Categorias (SidebarGroupLabel) organizam Seções (SidebarMenuItem).
 * 
 * Categorias:
 * - Plataforma: Dashboard
 * - Cadastros: Tecidos, Operadores, Motivos
 * - Ações: Logout (no final com mt-auto)
 * 
 * Baseado em: .agent/skills/sidebar-standard
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dashboard,
  Inventory,
  People,
  Warning,
  Inventory2,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AdminSidebar({
  onManageTecidos,
  onManageOperadores,
  onManageMotivos
}: {
  onManageTecidos?: () => void;
  onManageOperadores?: () => void;
  onManageMotivos?: () => void;
} = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Active state detection for each section
  const isDashboardActive = location.pathname === '/admin';
  const isTecidosActive = location.pathname === '/admin/tecidos';
  const isOperadoresActive = location.pathname === '/admin/operadores';
  const isMotivosActive = location.pathname === '/admin/motivos';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header Section */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Logo/Icon Container */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Inventory2 className="size-4" />
              </div>
              {/* Title and Subtitle */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Gestão de Estoque</span>
                <span className="truncate text-xs">Tapeçaria</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content Section */}
      <SidebarContent>
        {/* Category 1: Plataforma */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Section: Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  isActive={isDashboardActive}
                >
                  <Link to="/admin">
                    <Dashboard />
                    <span className="text-base">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Category 2: Cadastros */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Cadastros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Section: Tecidos */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Tecidos"
                  isActive={isTecidosActive}
                >
                  <Link to="/admin/tecidos">
                    <Inventory />
                    <span className="text-base">Tecidos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Section: Operadores */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Operadores"
                  isActive={isOperadoresActive}
                >
                  <Link to="/admin/operadores">
                    <People />
                    <span className="text-base">Operadores</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Section: Motivos */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Motivos"
                  isActive={isMotivosActive}
                >
                  <Link to="/admin/motivos">
                    <Warning />
                    <span className="text-base">Motivos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Actions Group (pushed to bottom with mt-auto) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Logout */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sair"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Logout />
                  <span className="text-base">Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Resize Handle */}
      <SidebarRail />
    </Sidebar>
  );
}
