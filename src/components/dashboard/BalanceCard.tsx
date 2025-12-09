import { Eye, EyeOff, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 284650.50;
  const income = 45200;
  const expenses = 18350;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card 
      variant="glow" 
      className="p-6 relative overflow-hidden opacity-0 animate-fade-up"
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-glow opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
                {showBalance ? formatCurrency(balance) : "₹••••••••"}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-muted-foreground">This month</span>
            <p className="text-success font-semibold">+12.5%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="p-2 rounded-full bg-success/20">
              <ArrowUpRight className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="font-semibold text-success">
                {showBalance ? formatCurrency(income) : "₹••••••"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="p-2 rounded-full bg-destructive/20">
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="font-semibold text-destructive">
                {showBalance ? formatCurrency(expenses) : "₹••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
