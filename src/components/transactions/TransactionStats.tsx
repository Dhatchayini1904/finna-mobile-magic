import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TransactionStatsProps {
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
}

export function TransactionStats({ totalIncome, totalExpenses, transactionCount }: TransactionStatsProps) {
  const net = totalIncome - totalExpenses;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: ArrowUpRight,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: ArrowDownRight,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Net Balance",
      value: formatCurrency(Math.abs(net)),
      prefix: net >= 0 ? "+" : "-",
      icon: net >= 0 ? TrendingUp : TrendingDown,
      color: net >= 0 ? "text-success" : "text-destructive",
      bgColor: net >= 0 ? "bg-success/10" : "bg-destructive/10",
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      icon: Activity,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label}
          variant="elevated"
          className={cn(
            "p-4 opacity-0 animate-fade-up hover:border-primary/30 transition-all"
          )}
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("text-lg font-bold font-display", stat.color)}>
                {stat.prefix}{stat.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
