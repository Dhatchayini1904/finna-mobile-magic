import { PortfolioSummary } from "@/components/investments/PortfolioSummary";
import { AllocationChart } from "@/components/investments/AllocationChart";
import { PerformanceChart } from "@/components/investments/PerformanceChart";
import { Holdings } from "@/components/investments/Holdings";
import { AIAdvisor } from "@/components/investments/AIAdvisor";
import { InvestmentInsights } from "@/components/investments/InvestmentInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";

const investmentQuickPrompts = [
  "Best stocks to buy now",
  "Portfolio analysis",
  "Should I rebalance?",
  "Market outlook",
];

export default function Investments() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Investments</h1>
          <p className="text-muted-foreground">Track your portfolio performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      <PortfolioSummary />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart />
          <Holdings />
        </div>
        <div className="space-y-6">
          <AllocationChart />
          <AIAdvisor />
          <InvestmentInsights />
          <div className="h-[400px]">
            <AIChatWidget
              context="investment"
              title="Investment AI Advisor"
              placeholder="Ask about investments..."
              quickPrompts={investmentQuickPrompts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
