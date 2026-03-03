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
      className="p-8 relative overflow-hidden opacity-0 animate-fade-up border-none shadow-2xl shadow-primary/20"
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl" />

      <div className="relative z-10 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">Total Balance</p>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tighter">
                {showBalance ? formatCurrency(balance) : "₹••••••••"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-0.5">Growth this month</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-lg font-black">+12.5%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all group">
            <div className="p-3 rounded-xl bg-white/10 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Income</p>
              <p className="text-xl font-black">
                {showBalance ? formatCurrency(income) : "₹••••••"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/10 backdrop-blur-md border border-white/5 hover:bg-black/20 transition-all group">
            <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="h-5 w-5 text-red-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Expenses</p>
              <p className="text-xl font-black">
                {showBalance ? formatCurrency(expenses) : "₹••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
