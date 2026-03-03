import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Investments from "./pages/Investments";
import AIChat from "./pages/AIChat";
import Bills from "./pages/Bills";
import Goals from "./pages/Goals";
import Budget from "./pages/Budget";
import Learn from "./pages/Learn";
import News from "./pages/News";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light" storageKey="finnava-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="investments" element={<Investments />} />
                  <Route path="ai-chat" element={<AIChat />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="budget" element={<Budget />} />
                  <Route path="learn" element={<Learn />} />
                  <Route path="news" element={<News />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="help" element={<Help />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold font-display mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This section is coming soon. We're working hard to bring you amazing features!
      </p>
    </div>
  );
}

export default App;
