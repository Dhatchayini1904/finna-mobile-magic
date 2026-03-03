import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

const stats = [
  {
    title: "Total Value",
    value: "₹12,45,890",
    change: "+₹45,230",
    changePercent: "+3.76%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "Today's Gain",
    value: "₹8,450",
    change: "+0.68%",
    changePercent: "",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "Total Returns",
    value: "₹2,45,890",
    change: "+24.5%",
    changePercent: "",
    isPositive: true,
    icon: Percent,
  },
  {
    title: "Invested Amount",
    value: "₹10,00,000",
    change: "",
    changePercent: "",
    isPositive: true,
    icon: DollarSign,
  },
];

export function PortfolioSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                stat.isPositive ? "text-emerald-400" : "text-red-400"
              }`}>
                {stat.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change} {stat.changePercent}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
