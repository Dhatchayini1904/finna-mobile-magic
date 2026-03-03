import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Wallet, TrendingUp, Calendar } from "lucide-react";

const stats = [
  {
    title: "Total Goals",
    value: "6",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  {
    title: "Total Saved",
    value: "₹4,85,000",
    icon: Wallet,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
  {
    title: "Monthly Savings",
    value: "₹45,000",
    icon: TrendingUp,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
  {
    title: "Next Milestone",
    value: "Feb 2025",
    subtitle: "Emergency Fund",
    icon: Calendar,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
  },
];

export function GoalsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
