import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, DollarSign, ChevronRight } from "lucide-react";

const insights = [
  {
    title: "INFY showing strong momentum",
    description: "Technical indicators suggest continued upside. Consider adding to position.",
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Rebalancing recommended",
    description: "IT sector is 45% of portfolio vs recommended 30%. Consider diversifying.",
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Dividend opportunity",
    description: "HDFC Bank ex-date in 5 days. Hold for ₹19/share dividend.",
    icon: DollarSign,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "TATAMOTORS correction expected",
    description: "Overbought RSI signals. Consider booking partial profits.",
    icon: TrendingDown,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
];

export function InvestmentInsights() {
  return (
    <Card variant="premium" className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">AI Market Insights</CardTitle>
        <Badge variant="secondary" className="ml-auto">Real-time</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-xl ${insight.bgColor} hover:scale-[1.02] transition-all cursor-pointer group border border-transparent hover:border-border/50`}
            >
              <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
