import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Car, ShoppingBag, Utensils, Zap, Film, HeartPulse, GraduationCap, Edit, Trash2, Loader2 } from "lucide-react";
import { Budget } from "@/hooks/useBudgets";

interface BudgetCategoriesProps {
  budgets?: Budget[];
  loading?: boolean;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

const iconMap: Record<string, any> = {
  Housing: Home,
  Transportation: Car,
  Shopping: ShoppingBag,
  "Food & Dining": Utensils,
  Utilities: Zap,
  Entertainment: Film,
  Healthcare: HeartPulse,
  Education: GraduationCap,
};

const defaultCategories = [
  { name: "Housing", icon: Home, budget: 25000, spent: 25000, color: "bg-blue-500" },
  { name: "Transportation", icon: Car, budget: 8000, spent: 5200, color: "bg-purple-500" },
  { name: "Shopping", icon: ShoppingBag, budget: 12000, spent: 9800, color: "bg-pink-500" },
  { name: "Food & Dining", icon: Utensils, budget: 15000, spent: 11200, color: "bg-orange-500" },
];

export function BudgetCategories({ budgets = [], loading = false, onEdit, onDelete }: BudgetCategoriesProps) {
  const categories = budgets.length > 0 
    ? budgets.map(b => ({
        id: b.id,
        name: b.category,
        icon: iconMap[b.category] || ShoppingBag,
        budget: Number(b.budget_limit),
        spent: Number(b.spent),
        color: b.color || "bg-primary",
        raw: b,
      }))
    : defaultCategories.map(c => ({ ...c, id: c.name, raw: null as any }));

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Budget by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          categories.map((cat) => {
            const percentage = (cat.spent / cat.budget) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;
            const Icon = cat.icon;
            
            return (
              <div key={cat.id} className="space-y-2 group">
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
                    {cat.raw && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit?.(cat.raw)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => onDelete?.(cat.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-amber-500' : ''}`}
                />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
