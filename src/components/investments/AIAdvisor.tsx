import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Search,
  Activity,
  ShieldCheck,
  Zap,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const recommendations = [
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    action: "Buy",
    targetPrice: 1850,
    currentPrice: 1620,
    upside: 14.2,
    confidence: 85,
    reason: "Strong Q3 results, AI services growth, undervalued vs peers",
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    action: "Hold",
    targetPrice: 7200,
    currentPrice: 6850,
    upside: 5.1,
    confidence: 72,
    reason: "Market consolidation expected, maintain position",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    action: "Sell",
    targetPrice: 680,
    currentPrice: 780,
    upside: -12.8,
    confidence: 68,
    reason: "EV competition intensifying, book partial profits",
  },
];

const insights = [
  {
    type: "alert",
    title: "Portfolio Risk Alert",
    description: "Tech sector allocation (45%) exceeds recommended 30%. Consider rebalancing.",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  {
    type: "opportunity",
    title: "Tax Harvesting Opportunity",
    description: "₹15,000 in unrealized losses can offset capital gains. Review before March.",
    icon: Sparkles,
    color: "text-primary",
  },
];

const actionColors: Record<string, string> = {
  Buy: "bg-green-500/10 text-green-600 border-green-500/20",
  Sell: "bg-red-500/10 text-red-600 border-red-500/20",
  Hold: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export function AIAdvisor() {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleRefresh = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsScanning(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-blue-500/5 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/5">
        {isScanning && (
          <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <Search className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-black font-display tracking-tight mb-2">Scanning Global Markets</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">Analyzing 5,000+ data points for real-time patterns...</p>
            <div className="w-full max-w-xs space-y-2">
              <Progress value={scanProgress} className="h-1.5" />
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{scanProgress}% Complete</p>
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black font-display tracking-tight">AI Stock Advisor</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Market Agent Live</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {recommendations.map((rec) => (
            <div
              key={rec.symbol}
              className="group p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-background flex flex-col items-center justify-center border border-border/50 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <span className="text-xs font-black tracking-tighter leading-none mb-0.5">{rec.symbol}</span>
                    <Activity className="h-3 w-3 opacity-50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-sm tracking-tight">{rec.name}</p>
                      <Badge
                        variant="outline"
                        className={cn("px-2 py-0 h-5 text-[10px] font-black uppercase tracking-wider", actionColors[rec.action])}
                      >
                        {rec.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ShieldCheck className="h-3 w-3 text-primary opacity-60" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Smart Pick</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                  <div className="bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                    <p className="text-sm font-black text-primary">{rec.confidence}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/40 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Current</p>
                  <p className="text-base font-black tracking-tighter">₹{rec.currentPrice.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Target</p>
                  <p className="text-base font-black tracking-tighter text-primary">₹{rec.targetPrice.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Upside</p>
                  <p className={cn(
                    "text-base font-black tracking-tighter flex items-center gap-1",
                    rec.upside >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {rec.upside >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {rec.upside >= 0 ? "+" : ""}{rec.upside}%
                  </p>
                </div>
              </div>

              <div className="mt-3 relative z-10">
                <p className="text-xs font-medium text-muted-foreground/80 italic">"{rec.reason}"</p>
              </div>
            </div>
          ))}

          <Button className="w-full h-11 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-black uppercase text-xs tracking-widest border-none group">
            <Sparkles className="h-4 w-4 group-hover:animate-bounce" />
            Analyze Full Portfolio
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-black font-display tracking-tight text-foreground/80">Agentic Market Insights</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary">Live Context</Badge>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group flex gap-4 p-4 rounded-2xl bg-secondary/20 hover:bg-primary/5 border border-border/30 hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                <insight.icon className={cn("h-5 w-5", insight.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground tracking-tight mb-1">{insight.title}</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{insight.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
