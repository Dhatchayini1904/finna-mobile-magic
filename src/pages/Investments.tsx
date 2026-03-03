import { PortfolioSummary } from "@/components/investments/PortfolioSummary";
import { AllocationChart } from "@/components/investments/AllocationChart";
import { PerformanceChart } from "@/components/investments/PerformanceChart";
import { AIAdvisor } from "@/components/investments/AIAdvisor";
import { InvestmentInsights } from "@/components/investments/InvestmentInsights";
import { VoiceAIChatWidget } from "@/components/ai/VoiceAIChatWidget";
import { StockSearch } from "@/components/investments/StockSearch";
import { Watchlist } from "@/components/investments/Watchlist";
import { LiveMarketTracker } from "@/components/investments/LiveMarketTracker";
import { LiveMarketView } from "@/components/investments/LiveMarketView";
import { BankOffers } from "@/components/investments/BankOffers";
import { FundOffers } from "@/components/investments/FundOffers";
import { PortfolioAnalytics } from "@/components/investments/PortfolioAnalytics";
import { PriceAlerts } from "@/components/investments/PriceAlerts";
import { DiversificationAdvice } from "@/components/investments/DiversificationAdvice";
import { SIPCalculator } from "@/components/investments/SIPCalculator";
import { FDCalculator } from "@/components/investments/FDCalculator";
import { RDCalculator } from "@/components/investments/RDCalculator";
import { LumpSumCalculator } from "@/components/investments/LumpSumCalculator";
import { MutualFundInfo } from "@/components/investments/MutualFundInfo";
import { IndianStockInfo } from "@/components/investments/IndianStockInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const investmentQuickPrompts = [
  "Best SIP for beginners",
  "FD vs Mutual Fund",
  "Tax saving options",
  "Gold investment advice",
];

export default function Investments() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-10 pb-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground">
            {t('investments')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            Learn and grow your wealth wisely with AI-driven insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl bg-secondary/30 border-border/50 hover:bg-primary/10 hover:text-primary transition-all">
            <RefreshCw className="h-4 w-4" />
            {t('syncFeeds')}
          </Button>
          <Button size="sm" className="gap-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Plus className="h-4 w-4" />
            {t('addInvestment') || 'Add Investment'}
          </Button>
        </div>
      </div>

      <PortfolioSummary />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1 bg-secondary/30 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest px-6 h-10 rounded-lg">
            {t('overview') || 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-primary data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest px-6 h-10 rounded-lg">
            Live Market
          </TabsTrigger>
          <TabsTrigger value="calculators" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            {t('calculators') || 'Calculators'}
          </TabsTrigger>
          <TabsTrigger value="learn" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            {t('learn')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            {t('analytics') || 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <BankOffers />
            <FundOffers />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <LiveMarketTracker />
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

        <TabsContent value="live" className="space-y-6">
          <LiveMarketView />
        </TabsContent>

        <TabsContent value="calculators" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SIPCalculator />
            <FDCalculator />
            <RDCalculator />
            <LumpSumCalculator />
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
      </Tabs>
    </div>
  );
}
