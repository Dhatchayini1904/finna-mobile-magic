import { PortfolioSummary } from "@/components/investments/PortfolioSummary";
import { AllocationChart } from "@/components/investments/AllocationChart";
import { PerformanceChart } from "@/components/investments/PerformanceChart";
import { Holdings } from "@/components/investments/Holdings";
import { AIAdvisor } from "@/components/investments/AIAdvisor";
import { InvestmentInsights } from "@/components/investments/InvestmentInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { StockSearch } from "@/components/investments/StockSearch";
import { Watchlist } from "@/components/investments/Watchlist";
import { NewsPanel } from "@/components/investments/NewsPanel";
import { PortfolioAnalytics } from "@/components/investments/PortfolioAnalytics";
import { PriceAlerts } from "@/components/investments/PriceAlerts";
import { DiversificationAdvice } from "@/components/investments/DiversificationAdvice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const investmentQuickPrompts = [
  "Best stocks to buy now",
  "Portfolio analysis",
  "Should I rebalance?",
  "Market outlook",
];

export default function Investments() {
  const [activeTab, setActiveTab] = useState("overview");

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="news">News & Research</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <PerformanceChart />
              <Holdings />
            </div>
            <div className="space-y-6">
              <StockSearch />
              <Watchlist />
              <AllocationChart />
              <AIAdvisor />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PortfolioAnalytics />
          <div className="grid gap-6 lg:grid-cols-2">
            <DiversificationAdvice />
            <div className="space-y-6">
              <PriceAlerts />
              <InvestmentInsights />
            </div>
          </div>
          <div className="h-[400px]">
            <AIChatWidget
              context="investment"
              title="Investment AI Advisor"
              placeholder="Ask about investments..."
              quickPrompts={investmentQuickPrompts}
            />
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <NewsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
