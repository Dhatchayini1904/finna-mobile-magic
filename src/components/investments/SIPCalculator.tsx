import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, IndianRupee, Calendar, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

export function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const n = years * 12;
    const r = expectedReturn / 100 / 12;
    const totalInvestment = monthlyAmount * n;
    const futureValue = monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const estimatedReturns = futureValue - totalInvestment;
    
    return {
      totalInvestment,
      estimatedReturns,
      futureValue,
    };
  }, [monthlyAmount, expectedReturn, years]);

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

  const investmentPercent = (results.totalInvestment / results.futureValue) * 100;

  return (
    <Card variant="elevated" className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">SIP Calculator</CardTitle>
            <CardDescription>Systematic Investment Plan</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              Monthly Investment
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">₹</span>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-24 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <Slider
            value={[monthlyAmount]}
            onValueChange={([v]) => setMonthlyAmount(v)}
            min={500}
            max={100000}
            step={500}
            className="w-full"
          />
        </div>

        {/* Expected Return */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              Expected Return
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <Input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-16 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
              <span className="text-sm font-medium">%</span>
            </div>
          </div>
          <Slider
            value={[expectedReturn]}
            onValueChange={([v]) => setExpectedReturn(v)}
            min={1}
            max={30}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Investment Period */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Time Period
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-12 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
              <span className="text-sm font-medium">Yrs</span>
            </div>
          </div>
          <Slider
            value={[years]}
            onValueChange={([v]) => setYears(v)}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${investmentPercent}%` }}
            />
            <div 
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${100 - investmentPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Invested
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              Returns
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Invested</p>
            <p className="font-bold text-primary">{formatCurrency(results.totalInvestment)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-success/5 border border-success/10">
            <p className="text-xs text-muted-foreground mb-1">Returns</p>
            <p className="font-bold text-success">{formatCurrency(results.estimatedReturns)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-info/5 border border-info/10">
            <p className="text-xs text-muted-foreground mb-1">Total Value</p>
            <p className="font-bold text-info">{formatCurrency(results.futureValue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
