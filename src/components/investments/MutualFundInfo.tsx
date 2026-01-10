import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Clock, Coins, ArrowRight, Info } from "lucide-react";

const fundTypes = [
  {
    name: "Equity Funds",
    description: "Invest in stocks for high growth potential",
    risk: "High",
    returns: "12-15%",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
    examples: ["Large Cap", "Mid Cap", "Small Cap", "Index Funds"],
  },
  {
    name: "Debt Funds",
    description: "Invest in bonds for stable returns",
    risk: "Low",
    returns: "6-8%",
    icon: Shield,
    color: "text-info",
    bgColor: "bg-info/10",
    examples: ["Liquid Funds", "Corporate Bonds", "Gilt Funds"],
  },
  {
    name: "Hybrid Funds",
    description: "Mix of equity and debt for balance",
    risk: "Medium",
    returns: "9-12%",
    icon: Coins,
    color: "text-warning",
    bgColor: "bg-warning/10",
    examples: ["Balanced Advantage", "Aggressive Hybrid", "Conservative"],
  },
  {
    name: "ELSS Funds",
    description: "Tax-saving with equity exposure",
    risk: "High",
    returns: "12-15%",
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
    examples: ["3-year lock-in", "80C deduction up to ₹1.5L"],
  },
];

const riskColors: Record<string, string> = {
  Low: "bg-success/20 text-success",
  Medium: "bg-warning/20 text-warning",
  High: "bg-destructive/20 text-destructive",
};

export function MutualFundInfo() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Mutual Funds</CardTitle>
              <CardDescription>Learn about different fund types</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Info className="h-3 w-3" />
            Educational
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {fundTypes.map((fund) => (
            <div 
              key={fund.name}
              className="p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${fund.bgColor}`}>
                  <fund.icon className={`h-4 w-4 ${fund.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{fund.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] px-1.5 py-0 ${riskColors[fund.risk]}`}
                    >
                      {fund.risk} Risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {fund.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-success">
                      Expected: {fund.returns} p.a.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {fund.examples.slice(0, 3).map((example) => (
                      <Badge key={example} variant="outline" className="text-[10px]">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-info/5 border border-primary/10">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Getting Started with Mutual Funds
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Start with a SIP of ₹500-1000/month</li>
            <li>• Choose funds based on your risk appetite</li>
            <li>• Invest for at least 3-5 years for best results</li>
            <li>• Diversify across fund types for balance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
