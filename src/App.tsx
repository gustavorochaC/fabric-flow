import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import TecidosPage from "./pages/admin/TecidosPage";
import OperadoresPage from "./pages/admin/OperadoresPage";
import MotivosPage from "./pages/admin/MotivosPage";
import NotFound from "./pages/NotFound";
import { SupabaseConfigAlert } from "./components/SupabaseConfigAlert";

const queryClient = new QueryClient();

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SupabaseConfigAlert />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/tecidos" element={<TecidosPage />} />
          <Route path="/admin/operadores" element={<OperadoresPage />} />
          <Route path="/admin/motivos" element={<MotivosPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
