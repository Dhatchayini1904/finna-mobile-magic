import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, AlertTriangle, CheckCircle, Target, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Current allocation data (would come from real portfolio in production)
const currentAllocation = [
  { name: "Stocks", value: 45, target: 40, color: "hsl(160, 84%, 39%)" },
  { name: "Mutual Funds", value: 25, target: 30, color: "hsl(200, 80%, 50%)" },
  { name: "Crypto", value: 15, target: 5, color: "hsl(280, 70%, 55%)" },
  { name: "Gold", value: 10, target: 15, color: "hsl(45, 90%, 55%)" },
  { name: "Bonds", value: 5, target: 10, color: "hsl(340, 70%, 55%)" },
];

const recommendations = [
  {
    type: "rebalance",
    priority: "high",
    title: "Reduce Crypto Exposure",
    description: "Your crypto allocation (15%) is 3x higher than recommended (5%). Consider rebalancing to reduce volatility risk.",
    action: "Sell ₹12,500 worth of crypto assets",
    impact: "Lower portfolio volatility by ~18%",
  },
  {
    type: "increase",
    priority: "medium",
    title: "Increase Bond Holdings",
    description: "Bonds are underweight at 5% vs target 10%. Adding bonds provides stability and regular income.",
    action: "Invest ₹6,250 in government bonds or debt funds",
    impact: "Improve risk-adjusted returns",
  },
  {
    type: "increase",
    priority: "medium",
    title: "Add More Gold",
    description: "Gold allocation (10%) is below target (15%). Gold acts as a hedge against inflation and market crashes.",
    action: "Buy ₹6,250 in gold ETFs or sovereign gold bonds",
    impact: "Better portfolio diversification",
  },
  {
    type: "maintain",
    priority: "low",
    title: "Stocks Slightly Overweight",
    description: "Stock allocation is 5% above target. This is acceptable given your growth objectives.",
    action: "No immediate action needed",
    impact: "Monitor during next rebalancing",
  },
];

const riskMetrics = {
  diversificationScore: 72,
  riskLevel: "Moderate-High",
  correlationRisk: "Medium",
  sectorConcentration: "Technology (38%)",
};

export function DiversificationAdvice() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Portfolio Diversification</CardTitle>
          </div>
          <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
            Score: {riskMetrics.diversificationScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Allocation Comparison */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            Current vs Target Allocation
          </h4>
          {currentAllocation.map((asset) => {
            const diff = asset.value - asset.target;
            const isOverweight = diff > 0;
            const isBalanced = Math.abs(diff) <= 2;
            
            return (
              <div key={asset.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span>{asset.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{asset.value}%</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">{asset.target}%</span>
                    {!isBalanced && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          isOverweight 
                            ? "bg-warning/20 text-warning border-warning/30" 
                            : "bg-info/20 text-info border-info/30"
                        )}
                      >
                        {isOverweight ? `+${diff}%` : `${diff}%`}
                      </Badge>
                    )}
                    {isBalanced && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                </div>
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full transition-all"
                    style={{ 
                      width: `${asset.value}%`, 
                      backgroundColor: asset.color,
                      opacity: 0.8
                    }}
                  />
                  <div
                    className="absolute h-full w-0.5 bg-foreground"
                    style={{ left: `${asset.target}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Shield className="h-4 w-4" />
              Risk Level
            </div>
            <p className="font-medium text-warning">{riskMetrics.riskLevel}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Top Sector
            </div>
            <p className="font-medium">{riskMetrics.sectorConcentration}</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recommendations</h4>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border",
                rec.priority === "high" 
                  ? "bg-destructive/10 border-destructive/30" 
                  : rec.priority === "medium"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-secondary/50 border-border/50"
              )}
            >
              <div className="flex items-start gap-2">
                {rec.priority === "high" ? (
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                ) : rec.priority === "medium" ? (
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{rec.title}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {rec.action}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                      {rec.impact}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
