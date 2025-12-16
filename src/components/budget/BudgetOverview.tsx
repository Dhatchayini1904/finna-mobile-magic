import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

const budgetData = {
  totalBudget: 85000,
  spent: 52300,
  remaining: 32700,
  savedThisMonth: 18500,
  lastMonthSpent: 58200,
};

export function BudgetOverview() {
  const spentPercentage = (budgetData.spent / budgetData.totalBudget) * 100;
  const changeFromLastMonth = ((budgetData.spent - budgetData.lastMonthSpent) / budgetData.lastMonthSpent) * 100;
  const isUnderBudget = spentPercentage < 75;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{budgetData.totalBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Monthly allocation</p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Spent</CardTitle>
          {changeFromLastMonth < 0 ? (
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-400" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{budgetData.spent.toLocaleString()}</div>
          <p className={`text-xs ${changeFromLastMonth < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeFromLastMonth > 0 ? '+' : ''}{changeFromLastMonth.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          <div className={`h-2 w-2 rounded-full ${isUnderBudget ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">₹{budgetData.remaining.toLocaleString()}</div>
          <Progress value={spentPercentage} className="h-1.5 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{spentPercentage.toFixed(0)}% of budget used</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-card/50 backdrop-blur-sm border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saved This Month</CardTitle>
          <PiggyBank className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">₹{budgetData.savedThisMonth.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Great progress! 🎉</p>
        </CardContent>
      </Card>
    </div>
  );
}
