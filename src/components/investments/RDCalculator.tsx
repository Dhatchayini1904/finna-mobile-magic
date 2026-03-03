import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PiggyBank, IndianRupee, Calendar, Percent } from "lucide-react";

export function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [interestRate, setInterestRate] = useState(7);
  const [months, setMonths] = useState(36);

  const results = useMemo(() => {
    // RD formula with quarterly compounding
    const n = 4; // quarterly compounding
    const r = interestRate / 100;
    const t = months;
    
    // Calculate maturity using the standard RD formula
    let maturityAmount = 0;
    for (let i = 1; i <= t; i++) {
      const remainingMonths = t - i + 1;
      const years = remainingMonths / 12;
      maturityAmount += monthlyDeposit * Math.pow(1 + r / n, n * years);
    }
    
    const totalDeposited = monthlyDeposit * t;
    const interestEarned = maturityAmount - totalDeposited;
    
    return {
      totalDeposited,
      interestEarned,
      maturityAmount,
    };
  }, [monthlyDeposit, interestRate, months]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const interestPercent = (results.interestEarned / results.maturityAmount) * 100;

  return (
    <Card variant="elevated" className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-info/10">
            <PiggyBank className="h-5 w-5 text-info" />
          </div>
          <div>
            <CardTitle className="text-lg">RD Calculator</CardTitle>
            <CardDescription>Recurring Deposit Returns</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Deposit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              Monthly Deposit
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">₹</span>
              <Input
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-24 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <Slider
            value={[monthlyDeposit]}
            onValueChange={([v]) => setMonthlyDeposit(v)}
            min={500}
            max={50000}
            step={500}
            className="w-full"
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              Interest Rate (p.a.)
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-16 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
                step={0.1}
              />
              <span className="text-sm font-medium">%</span>
            </div>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={([v]) => setInterestRate(v)}
            min={3}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Tenure in Months */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Tenure
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <Input
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-12 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
              <span className="text-sm font-medium">Mo</span>
            </div>
          </div>
          <Slider
            value={[months]}
            onValueChange={([v]) => setMonths(v)}
            min={6}
            max={120}
            step={6}
            className="w-full"
          />
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            <div 
              className="h-full bg-info transition-all duration-300"
              style={{ width: `${100 - interestPercent}%` }}
            />
            <div 
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${interestPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-info" />
              Deposited
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              Interest
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-xl bg-info/5 border border-info/10">
            <p className="text-xs text-muted-foreground mb-1">Deposited</p>
            <p className="font-bold text-info">{formatCurrency(results.totalDeposited)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-success/5 border border-success/10">
            <p className="text-xs text-muted-foreground mb-1">Interest</p>
            <p className="font-bold text-success">{formatCurrency(results.interestEarned)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Maturity</p>
            <p className="font-bold text-primary">{formatCurrency(results.maturityAmount)}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * {Math.floor(months / 12)} years {months % 12} months tenure
        </p>
      </CardContent>
    </Card>
  );
}
