import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Info } from "lucide-react";
import { useState, useMemo } from "react";

export function LumpSumCalculator() {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(12);
    const [period, setPeriod] = useState(10);

    const results = useMemo(() => {
        const investedAmount = amount;
        const totalValue = amount * Math.pow(1 + rate / 100, period);
        const estReturns = totalValue - investedAmount;

        return {
            investedAmount,
            estReturns,
            totalValue
        };
    }, [amount, rate, period]);

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Lump Sum Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Total Investment (₹)</Label>
                            <span className="font-bold text-primary">₹{amount.toLocaleString('en-IN')}</span>
                        </div>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Expected Return Rate (p.a %)</Label>
                            <span className="font-bold text-primary">{rate}%</span>
                        </div>
                        <Slider
                            value={[rate]}
                            onValueChange={(val) => setRate(val[0])}
                            max={30}
                            step={0.5}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Time Period (Years)</Label>
                            <span className="font-bold text-primary">{period}Y</span>
                        </div>
                        <Slider
                            value={[period]}
                            onValueChange={(val) => setPeriod(val[0])}
                            max={40}
                            step={1}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/40">
                    <div>
                        <p className="text-xs text-muted-foreground">Invested Amount</p>
                        <p className="text-lg font-bold">₹{results.investedAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Est. Returns</p>
                        <p className="text-lg font-bold text-green-600">₹{results.estReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Value</p>
                        <p className="text-lg font-bold text-primary">₹{results.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Info className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Projected value based on historical market performance. Actual returns may vary depending on market conditions.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
