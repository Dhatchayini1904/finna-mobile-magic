import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Edit2, Bell } from "lucide-react";

const limits = [
  { category: "Dining Out", limit: 5000, spent: 4200, alertAt: 80 },
  { category: "Online Shopping", limit: 8000, spent: 9500, alertAt: 90 },
  { category: "Subscriptions", limit: 2000, spent: 1850, alertAt: 85 },
  { category: "Coffee & Snacks", limit: 1500, spent: 800, alertAt: 75 },
  { category: "Fuel", limit: 4000, spent: 3100, alertAt: 80 },
];

export function SpendingLimits() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Spending Limits</CardTitle>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Limits
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {limits.map((item) => {
          const percentage = (item.spent / item.limit) * 100;
          const isOverLimit = percentage > 100;
          const isNearAlert = percentage >= item.alertAt && percentage <= 100;
          
          return (
            <div 
              key={item.category}
              className={`p-3 rounded-lg border transition-colors ${
                isOverLimit 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : isNearAlert 
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-background/50 border-border/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOverLimit ? (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  ) : isNearAlert ? (
                    <Bell className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="font-medium">{item.category}</span>
                </div>
                <Badge variant={isOverLimit ? "destructive" : isNearAlert ? "secondary" : "outline"}>
                  ₹{item.spent.toLocaleString()} / ₹{item.limit.toLocaleString()}
                </Badge>
              </div>
              {isOverLimit && (
                <p className="text-xs text-red-400 mt-2">
                  Exceeded by ₹{(item.spent - item.limit).toLocaleString()}
                </p>
              )}
              {isNearAlert && !isOverLimit && (
                <p className="text-xs text-amber-400 mt-2">
                  {percentage.toFixed(0)}% used - approaching limit
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
