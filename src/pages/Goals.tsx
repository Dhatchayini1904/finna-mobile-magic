import { Button } from "@/components/ui/button";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalWallet } from "@/components/goals/GoalWallet";
import { Plus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const goals = [
  {
    name: "Emergency Fund",
    target: 300000,
    current: 150000,
    deadline: "Jun 2025",
    category: "emergency",
    icon: "🛡️",
    monthlyContribution: 15000,
  },
  {
    name: "Europe Trip",
    target: 200000,
    current: 85000,
    deadline: "Dec 2025",
    category: "travel",
    icon: "✈️",
    monthlyContribution: 10000,
  },
  {
    name: "New Car",
    target: 800000,
    current: 200000,
    deadline: "Dec 2026",
    category: "vehicle",
    icon: "🚗",
    monthlyContribution: 25000,
  },
  {
    name: "MBA Education",
    target: 500000,
    current: 50000,
    deadline: "Aug 2025",
    category: "education",
    icon: "🎓",
    monthlyContribution: 20000,
  },
  {
    name: "Home Down Payment",
    target: 2000000,
    current: 450000,
    deadline: "Dec 2027",
    category: "home",
    icon: "🏠",
    monthlyContribution: 35000,
  },
  {
    name: "Retirement Fund",
    target: 5000000,
    current: 800000,
    deadline: "Dec 2045",
    category: "retirement",
    icon: "🏖️",
    monthlyContribution: 15000,
  },
];

export default function Goals() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Track your savings targets</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>

      <GoalsOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard key={goal.name} {...goal} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <GoalWallet />

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-background/50">
                <p className="font-medium text-primary">Boost Emergency Fund</p>
                <p className="text-muted-foreground mt-1">
                  Increase monthly contribution by ₹5,000 to reach your target 2 months earlier.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <p className="font-medium text-amber-400">Rebalance Goals</p>
                <p className="text-muted-foreground mt-1">
                  Consider reducing travel fund temporarily to prioritize education goal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
