import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  icon: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Salary Deposit",
    category: "Income",
    amount: 45000,
    type: "income",
    date: "Today",
    icon: "💼",
  },
  {
    id: "2",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 649,
    type: "expense",
    date: "Today",
    icon: "🎬",
  },
  {
    id: "3",
    description: "Grocery Shopping",
    category: "Food & Dining",
    amount: 2850,
    type: "expense",
    date: "Yesterday",
    icon: "🛒",
  },
  {
    id: "4",
    description: "Freelance Payment",
    category: "Income",
    amount: 15000,
    type: "income",
    date: "Yesterday",
    icon: "💻",
  },
  {
    id: "5",
    description: "Uber Ride",
    category: "Transport",
    amount: 450,
    type: "expense",
    date: "2 days ago",
    icon: "🚗",
  },
];

export function RecentTransactions() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card 
      variant="elevated" 
      className="opacity-0 animate-fade-up stagger-3"
      style={{ animationFillMode: 'forwards' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Link to="/transactions">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
              "hover:bg-secondary/50 cursor-pointer group"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {transaction.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{transaction.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{transaction.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className={cn(
                  "font-semibold text-sm",
                  transaction.type === "income" ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
