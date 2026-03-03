import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Gem, IndianRupee, Scale, TrendingUp } from "lucide-react";

export function GoldCalculator() {
  const [grams, setGrams] = useState(10);
  const [goldType, setGoldType] = useState<"24k" | "22k" | "18k">("24k");
  
  // Approximate current gold prices in INR per gram (educational purposes)
  const goldPrices = {
    "24k": 7200,
    "22k": 6600,
    "18k": 5400,
  };

  // Historical appreciation rate (approximate)
  const [appreciationRate, setAppreciationRate] = useState(8);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const pricePerGram = goldPrices[goldType];
    const currentValue = grams * pricePerGram;
    const futureValue = currentValue * Math.pow(1 + appreciationRate / 100, years);
    const appreciation = futureValue - currentValue;
    
    return {
      currentValue,
      futureValue,
      appreciation,
      pricePerGram,
    };
  }, [grams, goldType, appreciationRate, years]);

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

  return (
    <Card variant="elevated" className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10">
            <Gem className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Gold Investment</CardTitle>
            <CardDescription>Calculate gold value & returns</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gold Type Selection */}
        <div className="space-y-2">
          <Label>Gold Purity</Label>
          <div className="flex gap-2">
            {(["24k", "22k", "18k"] as const).map((type) => (
              <Badge
                key={type}
                variant={goldType === type ? "default" : "secondary"}
                className={`cursor-pointer flex-1 justify-center py-2 ${
                  goldType === type 
                    ? "bg-amber-500 hover:bg-amber-600" 
                    : "hover:bg-amber-500/20"
                }`}
                onClick={() => setGoldType(type)}
              >
                {type.toUpperCase()}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Current rate: ₹{goldPrices[goldType].toLocaleString('en-IN')}/gram
          </p>
        </div>

        {/* Weight in Grams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-muted-foreground" />
              Weight
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <Input
                type="number"
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="w-16 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
              <span className="text-sm font-medium">gm</span>
            </div>
          </div>
          <Slider
            value={[grams]}
            onValueChange={([v]) => setGrams(v)}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Expected Appreciation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Expected Growth (p.a.)
            </Label>
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-lg">
              <Input
                type="number"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(Number(e.target.value))}
                className="w-12 h-7 text-right border-0 bg-transparent p-0 focus-visible:ring-0"
              />
              <span className="text-sm font-medium">%</span>
            </div>
          </div>
          <Slider
            value={[appreciationRate]}
            onValueChange={([v]) => setAppreciationRate(v)}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        {/* Investment Horizon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              Hold Period
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
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <p className="text-xs text-muted-foreground mb-1">Today's Value</p>
            <p className="font-bold text-amber-500">{formatCurrency(results.currentValue)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-success/5 border border-success/10">
            <p className="text-xs text-muted-foreground mb-1">Appreciation</p>
            <p className="font-bold text-success">{formatCurrency(results.appreciation)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Future Value</p>
            <p className="font-bold text-primary">{formatCurrency(results.futureValue)}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Prices are indicative. Actual rates may vary.
        </p>
      </CardContent>
    </Card>
  );
}
