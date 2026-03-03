import { PortfolioSummary } from "@/components/investments/PortfolioSummary";
import { AllocationChart } from "@/components/investments/AllocationChart";
import { PerformanceChart } from "@/components/investments/PerformanceChart";
import { AIAdvisor } from "@/components/investments/AIAdvisor";
import { InvestmentInsights } from "@/components/investments/InvestmentInsights";
import { VoiceAIChatWidget } from "@/components/ai/VoiceAIChatWidget";
import { StockSearch } from "@/components/investments/StockSearch";
import { Watchlist } from "@/components/investments/Watchlist";
import { NewsPanel } from "@/components/investments/NewsPanel";
import { PortfolioAnalytics } from "@/components/investments/PortfolioAnalytics";
import { PriceAlerts } from "@/components/investments/PriceAlerts";
import { DiversificationAdvice } from "@/components/investments/DiversificationAdvice";
import { SIPCalculator } from "@/components/investments/SIPCalculator";
import { FDCalculator } from "@/components/investments/FDCalculator";
import { RDCalculator } from "@/components/investments/RDCalculator";
import { GoldCalculator } from "@/components/investments/GoldCalculator";
import { MutualFundInfo } from "@/components/investments/MutualFundInfo";
import { IndianStockInfo } from "@/components/investments/IndianStockInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const investmentQuickPrompts = [
  "Best SIP for beginners",
  "FD vs Mutual Fund",
  "Tax saving options",
  "Gold investment advice",
];

export default function Investments() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Investments</h1>
          <p className="text-muted-foreground">Learn and grow your wealth wisely</p>
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
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <PerformanceChart />
            </div>
            <div className="space-y-6">
              <StockSearch />
              <Watchlist />
              <AllocationChart />
              <AIAdvisor />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calculators" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SIPCalculator />
            <FDCalculator />
            <RDCalculator />
            <GoldCalculator />
          </div>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <MutualFundInfo />
            <IndianStockInfo />
          </div>
          <div className="h-[400px]">
            <VoiceAIChatWidget
              context="investment"
              title="FINNAVA Investment Advisor"
              placeholder="Ask about investments in Hindi/English..."
              quickPrompts={investmentQuickPrompts}
            />
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
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <NewsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
