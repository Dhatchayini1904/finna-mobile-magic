import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Home, Car, ShoppingBag, Utensils, Zap, Film, HeartPulse, GraduationCap } from "lucide-react";

const categories = [
  { name: "Housing", icon: Home, budget: 25000, spent: 25000, color: "bg-blue-500" },
  { name: "Transportation", icon: Car, budget: 8000, spent: 5200, color: "bg-purple-500" },
  { name: "Shopping", icon: ShoppingBag, budget: 12000, spent: 9800, color: "bg-pink-500" },
  { name: "Food & Dining", icon: Utensils, budget: 15000, spent: 11200, color: "bg-orange-500" },
  { name: "Utilities", icon: Zap, budget: 5000, spent: 3800, color: "bg-yellow-500" },
  { name: "Entertainment", icon: Film, budget: 6000, spent: 4100, color: "bg-red-500" },
  { name: "Healthcare", icon: HeartPulse, budget: 4000, spent: 1200, color: "bg-emerald-500" },
  { name: "Education", icon: GraduationCap, budget: 10000, spent: 8000, color: "bg-cyan-500" },
];

export function BudgetCategories() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Budget by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => {
          const percentage = (cat.spent / cat.budget) * 100;
          const isOverBudget = percentage > 100;
          const isNearLimit = percentage > 80 && percentage <= 100;
          const Icon = cat.icon;
          
          return (
            <div key={cat.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cat.color}/20`}>
                    <Icon className={`h-4 w-4 ${cat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isOverBudget && (
                    <Badge variant="destructive" className="text-xs">Over</Badge>
                  )}
                  {isNearLimit && (
                    <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">Near Limit</Badge>
                  )}
                  <span className={`text-sm font-medium ${isOverBudget ? 'text-red-400' : ''}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-amber-500' : ''}`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
