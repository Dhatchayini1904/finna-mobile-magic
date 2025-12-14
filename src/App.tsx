import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Investments from "./pages/Investments";
import AIChat from "./pages/AIChat";
import Bills from "./pages/Bills";
import Goals from "./pages/Goals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="investments" element={<Investments />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="bills" element={<Bills />} />
            <Route path="goals" element={<Goals />} />
            {/* Placeholder routes */}
            <Route path="budget" element={<ComingSoon title="Budget" />} />
            <Route path="learn" element={<ComingSoon title="Learn" />} />
            <Route path="settings" element={<ComingSoon title="Settings" />} />
            <Route path="help" element={<ComingSoon title="Help" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
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
