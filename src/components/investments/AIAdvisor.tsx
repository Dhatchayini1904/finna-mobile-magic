import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ChevronRight } from "lucide-react";

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
    color: "text-amber-400",
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
  Buy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Sell: "bg-red-500/20 text-red-400 border-red-500/30",
  Hold: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export function AIAdvisor() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 via-card/50 to-purple-500/10 backdrop-blur-sm border-primary/30">
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Stock Advisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.symbol}
              className="p-4 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{rec.symbol}</span>
                    <Badge
                      variant="outline"
                      className={actionColors[rec.action]}
                    >
                      {rec.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="font-semibold text-primary">{rec.confidence}%</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-medium">₹{rec.currentPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-medium">₹{rec.targetPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Upside</p>
                  <p className={`font-medium flex items-center gap-1 ${
                    rec.upside >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {rec.upside >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {rec.upside >= 0 ? "+" : ""}{rec.upside}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rec.reason}</p>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Get More Recommendations
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
            >
              <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
              <div className="flex-1">
                <p className="font-medium">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
