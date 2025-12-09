import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  time: string;
  icon: string;
  merchant?: string;
  paymentMethod?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  groupByDate?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

function TransactionItem({ transaction, index }: { transaction: Transaction; index: number }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all duration-200",
        "hover:bg-secondary/50 cursor-pointer group opacity-0 animate-fade-up"
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {transaction.icon}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {transaction.category}
            </Badge>
            {transaction.merchant && (
              <span className="text-xs text-muted-foreground">
                {transaction.merchant}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={cn(
            "font-semibold",
            transaction.type === "income" ? "text-success" : "text-destructive"
          )}>
            {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-muted-foreground">{transaction.time}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function groupTransactionsByDate(transactions: Transaction[]) {
  const groups: { [key: string]: Transaction[] } = {};
  
  transactions.forEach((transaction) => {
    if (!groups[transaction.date]) {
      groups[transaction.date] = [];
    }
    groups[transaction.date].push(transaction);
  });

  return groups;
}

export function TransactionList({ transactions, groupByDate = true }: TransactionListProps) {
  if (groupByDate) {
    const grouped = groupTransactionsByDate(transactions);
    let itemIndex = 0;

    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, items]) => {
          const dayTotal = items.reduce((sum, t) => {
            return sum + (t.type === "income" ? t.amount : -t.amount);
          }, 0);

          return (
            <Card key={date} variant="elevated" className="overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{date}</span>
                  <Badge variant="secondary" className="text-xs">
                    {items.length} transactions
                  </Badge>
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  dayTotal >= 0 ? "text-success" : "text-destructive"
                )}>
                  {dayTotal >= 0 ? "+" : ""}{formatCurrency(Math.abs(dayTotal))}
                </span>
              </div>
              <div className="divide-y divide-border/50">
                {items.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                    index={itemIndex++}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card variant="elevated" className="divide-y divide-border/50">
      {transactions.map((transaction, index) => (
        <TransactionItem key={transaction.id} transaction={transaction} index={index} />
      ))}
    </Card>
  );
}
