import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, TrendingUp, PiggyBank, ChevronRight, Calendar } from "lucide-react";

const insights = [
  {
    title: "Dream Vacation on track!",
    description: "You'll reach your ₹1.5L goal by March 2025 at current rate",
    icon: Target,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Increase Emergency Fund SIP",
    description: "Add ₹2,000/month to reach your goal 3 months earlier",
    icon: TrendingUp,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "New Car goal needs attention",
    description: "Currently ₹15,000 behind schedule. Consider increasing contributions.",
    icon: PiggyBank,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Tax benefit available",
    description: "Your PPF goal qualifies for ₹22,500 in tax savings under 80C",
    icon: Calendar,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

export function GoalInsights() {
  return (
    <Card variant="premium" className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">AI Goal Insights</CardTitle>
        <Badge variant="secondary" className="ml-auto">Personalized</Badge>
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
