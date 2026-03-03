import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingDown, TrendingUp, AlertCircle, Lightbulb, ChevronRight } from "lucide-react";

const insights = [
  {
    type: "saving",
    title: "You're spending less on dining!",
    description: "Down 18% from last month. Keep it up!",
    icon: TrendingDown,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    type: "alert",
    title: "Shopping budget at 82%",
    description: "₹1,200 remaining for 8 days. Consider slowing down.",
    icon: AlertCircle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    type: "tip",
    title: "Switch to annual subscriptions",
    description: "You could save ₹2,400/year on your current apps.",
    icon: Lightbulb,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    type: "trend",
    title: "Fuel costs increasing",
    description: "Up 12% this month. Consider carpooling options.",
    icon: TrendingUp,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
];

export function BudgetInsights() {
  return (
    <Card variant="premium" className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">AI Budget Insights</CardTitle>
        <Badge variant="secondary" className="ml-auto">Live</Badge>
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
