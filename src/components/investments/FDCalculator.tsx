import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Landmark, IndianRupee, Calendar, Percent } from "lucide-react";

export function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    // Quarterly compounding (most common for Indian FDs)
    const n = 4; // compounding frequency
    const t = years;
    const r = interestRate / 100;
    
    const maturityAmount = principal * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - principal;
    
    return {
      principal,
      interestEarned,
      maturityAmount,
    };
  }, [principal, interestRate, years]);

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
          <div className="p-2 rounded-xl bg-warning/10">
            <Landmark className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">FD Calculator</CardTitle>
            <CardDescription>Fixed Deposit Returns</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Principal Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              Principal Amount
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">₹</span>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-28 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <Slider
            value={[principal]}
            onValueChange={([v]) => setPrincipal(v)}
            min={10000}
            max={10000000}
            step={10000}
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

        {/* Tenure */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Tenure
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
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            <div 
              className="h-full bg-warning transition-all duration-300"
              style={{ width: `${100 - interestPercent}%` }}
            />
            <div 
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${interestPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-warning" />
              Principal
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              Interest
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-xl bg-warning/5 border border-warning/10">
            <p className="text-xs text-muted-foreground mb-1">Principal</p>
            <p className="font-bold text-warning">{formatCurrency(results.principal)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-success/5 border border-success/10">
            <p className="text-xs text-muted-foreground mb-1">Interest</p>
            <p className="font-bold text-success">{formatCurrency(results.interestEarned)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-info/5 border border-info/10">
            <p className="text-xs text-muted-foreground mb-1">Maturity</p>
            <p className="font-bold text-info">{formatCurrency(results.maturityAmount)}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Calculated with quarterly compounding
        </p>
      </CardContent>
    </Card>
  );
}
