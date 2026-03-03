import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { useInvestments } from "@/hooks/useInvestments";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioSummary() {
  const { investments, loading } = useInvestments();

  const { totalValue, totalInvested, totalReturns, totalReturnsPercent } = useMemo(() => {
    let tv = 0;
    let ti = 0;
    investments.forEach(inv => {
      tv += inv.currentValue;
      ti += inv.investedValue;
    });

    const tr = tv - ti;
    const trp = ti > 0 ? (tr / ti) * 100 : 0;

    return {
      totalValue: tv,
      totalInvested: ti,
      totalReturns: tr,
      totalReturnsPercent: trp
    };
  }, [investments]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Value",
      value: `₹${totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      change: "",
      changePercent: "",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Invested Amount",
      value: `₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      change: "",
      changePercent: "",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Total P/L",
      value: `₹${Math.abs(totalReturns).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      change: totalReturns >= 0 ? "+" : "-",
      changePercent: `${Math.abs(totalReturnsPercent).toFixed(2)}%`,
      isPositive: totalReturns >= 0,
      icon: totalReturns >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: "Total Returns (%)",
      value: `${totalReturnsPercent.toFixed(2)}%`,
      change: "",
      changePercent: "",
      isPositive: totalReturnsPercent >= 0,
      icon: Percent,
    },
  ];

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
            <div className="text-2xl font-bold">{stat.change}{stat.value}</div>
            {stat.changePercent && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${stat.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                {stat.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}{stat.changePercent}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
